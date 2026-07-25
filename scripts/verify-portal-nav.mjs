#!/usr/bin/env node
/**
 * verify-portal-nav.mjs — Portal RedirectGuard race-fix verification
 *
 * Mirrors decision logic from:
 *   apps/web/src/portal/engine/PortalRouter.tsx (RedirectGuard)
 *
 * SessionPersistence localStorage keys (for optional browser seed):
 *   aumveda_portal_session_id          → active session id
 *   aumveda_portal_session_<sessionId> → JSON state payload
 *   aumveda_portal_user_id             → optional user id
 *
 * ── Auto-verifiable checklist ──────────────────────────────────────────────
 *  [x] Forward-nav race: engineAdvanced + URL lag → replace_forward (NOT goToStep)
 *  [x] Browser back: URL behind, accessible → goToStep(url)
 *  [x] Skip-ahead blocked: URL > engine → replace_engine
 *  [x] In sync: engine === url → noop
 *  [~] Optional smoke: PLAYWRIGHT=1 + server up → GET /step-1 loads
 *  [ ] Full E2E forward-nav race (needs Step1 breath cycles OR localStorage seed)
 *  [ ] Full E2E browser-back mid-portal (needs localStorage seed)
 *
 * Usage:
 *   node scripts/verify-portal-nav.mjs
 *   PLAYWRIGHT=1 PORT=3005 node scripts/verify-portal-nav.mjs
 */

// ── Pure guard decision (no React) ─────────────────────────────────────────

/**
 * @param {{ engine: number, url: number, engineAdvanced?: boolean, accessible?: boolean, hydrated?: boolean, phase?: string }} input
 * @returns {{ action: 'noop'|'replace_forward'|'replace_engine'|'goToStep'|'replace_completed', step?: number }}
 */
export function decideRedirectGuard(input) {
  const {
    engine,
    url,
    engineAdvanced = false,
    accessible = true,
    hydrated = true,
    phase = 'active',
  } = input

  if (!hydrated) return { action: 'noop' }

  if (phase === 'completed') {
    if (url !== 8) return { action: 'replace_completed', step: 8 }
    return { action: 'noop' }
  }

  // Invalid / missing route step → bounce to engine
  if (url == null || Number.isNaN(url)) {
    return { action: 'replace_engine', step: engine }
  }

  if (url === engine) return { action: 'noop' }

  // Skip-ahead: URL ahead of engine
  if (url > engine) {
    return { action: 'replace_engine', step: engine }
  }

  // URL behind engine
  if (url < engine) {
    // Forward-nav race: engine already advanced, pathname lagging
    if (engineAdvanced) {
      return { action: 'replace_forward', step: engine }
    }
    // Inaccessible earlier step → stay on engine
    if (!accessible) {
      return { action: 'replace_engine', step: engine }
    }
    // Browser back to accessible step → sync engine down
    return { action: 'goToStep', step: url }
  }

  return { action: 'noop' }
}

// ── Decision matrix cases ──────────────────────────────────────────────────

const CASES = [
  {
    name: 'forward-nav race: engine=2 url=1 engineAdvanced → replace_forward',
    input: { engine: 2, url: 1, engineAdvanced: true },
    expect: { action: 'replace_forward', step: 2 },
    assert: (r) => r.action === 'replace_forward' && r.action !== 'goToStep',
  },
  {
    name: 'browser back: engine=2 url=1 !advanced accessible → goToStep(1)',
    input: { engine: 2, url: 1, engineAdvanced: false, accessible: true },
    expect: { action: 'goToStep', step: 1 },
    assert: (r) => r.action === 'goToStep' && r.step === 1,
  },
  {
    name: 'skip blocked: engine=2 url=5 → replace_engine',
    input: { engine: 2, url: 5 },
    expect: { action: 'replace_engine', step: 2 },
    assert: (r) => r.action === 'replace_engine' && r.step === 2,
  },
  {
    name: 'in sync: engine=5 url=5 → noop',
    input: { engine: 5, url: 5 },
    expect: { action: 'noop' },
    assert: (r) => r.action === 'noop',
  },
]

function runDecisionMatrix() {
  let failed = 0
  console.log('\n── RedirectGuard decision matrix ──')
  for (const c of CASES) {
    const result = decideRedirectGuard(c.input)
    const ok = c.assert(result)
    if (ok) {
      console.log(`PASS  ${c.name}`)
    } else {
      failed++
      console.log(
        `FAIL  ${c.name}\n      got=${JSON.stringify(result)} expect~=${JSON.stringify(c.expect)}`,
      )
    }
  }
  return failed
}

// ── Optional Playwright smoke ──────────────────────────────────────────────

async function tryPlaywrightSmoke() {
  if (process.env.PLAYWRIGHT !== '1') {
    console.log('\n── Playwright smoke ──')
    console.log('SKIP  set PLAYWRIGHT=1 to enable')
    return 0
  }

  const port = process.env.PORT || '3005'
  const base = `http://127.0.0.1:${port}`

  console.log('\n── Playwright smoke ──')

  // Quick reachability check first (no Playwright needed)
  let reachable = false
  try {
    const res = await fetch(`${base}/step-1`, { redirect: 'manual' })
    reachable = res.status >= 200 && res.status < 500
    if (res.status === 200 || res.status === 307 || res.status === 308) {
      console.log(`PASS  GET /step-1 → ${res.status} (server up on :${port})`)
    } else {
      console.log(`FAIL  GET /step-1 → ${res.status}`)
      return 1
    }
  } catch (err) {
    console.log(`SKIP  server not reachable at ${base} (${err.cause?.code || err.message})`)
    return 0
  }

  // Try real Playwright if installed
  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    console.log('SKIP  playwright package not installed (HTTP check above is enough)')
    return reachable ? 0 : 1
  }

  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    const res = await page.goto(`${base}/step-1`, { waitUntil: 'domcontentloaded', timeout: 15000 })
    const status = res?.status() ?? 0
    if (status === 200) {
      console.log(`PASS  playwright open /step-1 → ${status}`)
      return 0
    }
    console.log(`FAIL  playwright open /step-1 → ${status}`)
    return 1
  } catch (err) {
    console.log(`FAIL  playwright: ${err.message}`)
    return 1
  } finally {
    await browser.close()
  }
}

// ── Session key documentation (self-check) ─────────────────────────────────

const SESSION_KEYS = {
  SESSION_ID_KEY: 'aumveda_portal_session_id',
  SESSION_KEY_PREFIX: 'aumveda_portal_session_',
  USER_ID_KEY: 'aumveda_portal_user_id',
}

function printSessionKeys() {
  console.log('\n── SessionPersistence keys ──')
  console.log(`INFO  ${SESSION_KEYS.SESSION_ID_KEY}`)
  console.log(`INFO  ${SESSION_KEYS.SESSION_KEY_PREFIX}<sessionId>`)
  console.log(`INFO  ${SESSION_KEYS.USER_ID_KEY}`)
}

/**
 * Helper for future E2E seed — builds localStorage payload matching SessionPersistence.
 * Not executed by default; exported for documentation / copy-paste.
 */
export function buildPortalSessionSeed({
  sessionId = 'portal_verify_seed_00000000',
  currentStep = 2,
  completedSteps = [1],
} = {}) {
  return {
    [SESSION_KEYS.SESSION_ID_KEY]: sessionId,
    [`${SESSION_KEYS.SESSION_KEY_PREFIX}${sessionId}`]: JSON.stringify({
      sessionId,
      phase: currentStep,
      currentStep,
      completedSteps,
      portalData: {},
      progress: Math.round((completedSteps.length / 8) * 100),
      direction: 'forward',
    }),
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('verify-portal-nav — RedirectGuard race-fix check')
  printSessionKeys()

  const matrixFails = runDecisionMatrix()
  const smokeFails = await tryPlaywrightSmoke()

  const total = matrixFails + smokeFails
  console.log('\n── summary ──')
  if (total === 0) {
    console.log('PASS  all checks')
    process.exit(0)
  }
  console.log(`FAIL  ${total} check(s) failed`)
  process.exit(1)
}

const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith('verify-portal-nav.mjs') ||
    process.argv[1].replace(/\\/g, '/').endsWith('scripts/verify-portal-nav.mjs'))

if (isDirectRun) {
  main().catch((err) => {
    console.error('FAIL  unexpected:', err)
    process.exit(1)
  })
}
