#!/usr/bin/env node
/**
 * Full portal nav E2E against running server (default :3005).
 * Usage: node scripts/verify-portal-nav-e2e.mjs
 */
import { chromium } from 'playwright'

const PORT = process.env.PORT || '3005'
const BASE = `http://127.0.0.1:${PORT}`
let failed = 0

function pass(n) {
  console.log(`PASS  ${n}`)
}
function fail(n, d) {
  failed++
  console.log(`FAIL  ${n}${d ? ` — ${d}` : ''}`)
}

function seed(sessionId, { currentStep, completedSteps, portalData = {} }) {
  return {
    sessionId,
    idKey: 'aumveda_portal_session_id',
    dataKey: `aumveda_portal_session_${sessionId}`,
    payload: JSON.stringify({
      sessionId,
      phase: currentStep,
      currentStep,
      completedSteps,
      portalData,
      progress: Math.round((completedSteps.length / 8) * 100),
      direction: 'forward',
    }),
  }
}

async function applySeed(page, s) {
  await page.addInitScript(
    ({ idKey, dataKey, sessionId, payload }) => {
      localStorage.setItem(idKey, sessionId)
      localStorage.setItem(dataKey, payload)
    },
    s,
  )
}

async function main() {
  console.log(`portal E2E @ ${BASE}`)

  try {
    const res = await fetch(`${BASE}/step-1`)
    if (!res.ok) throw new Error(`status ${res.status}`)
    pass('server up')
  } catch (e) {
    fail('server up', e.message)
    process.exit(1)
  }

  const browser = await chromium.launch({ headless: true })
  const consoleBag = []

  try {
    // ── Refresh / hard reload persistence ─────────────────────────────
    for (const step of [2, 3, 7]) {
      const ctx = await browser.newContext()
      const page = await ctx.newPage()
      page.on('pageerror', (e) => consoleBag.push(String(e)))
      const s = seed(`e2e_ref_${step}_${Date.now()}`, {
        currentStep: step,
        completedSteps: Array.from({ length: step - 1 }, (_, i) => i + 1),
        portalData: { chakraSelected: 'heart', intention: 'remain present and calm enough' },
      })
      await applySeed(page, s)
      await page.goto(`${BASE}/step-${step}`, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(1000)
      if (page.url().includes(`/step-${step}`)) pass(`land step-${step}`)
      else fail(`land step-${step}`, page.url())

      await page.reload({ waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)
      if (page.url().includes(`/step-${step}`)) pass(`reload stay step-${step}`)
      else fail(`reload stay step-${step}`, page.url())
      await ctx.close()
    }

    // ── Skip-ahead /step-5 fresh ──────────────────────────────────────
    {
      const ctx = await browser.newContext()
      const page = await ctx.newPage()
      await page.goto(`${BASE}/step-5`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)
      const u = page.url()
      if (u.includes('/step-5')) fail('block skip /step-5', u)
      else pass('block skip /step-5')
      await ctx.close()
    }

    // ── Skip /step-8 no loop ──────────────────────────────────────────
    {
      const ctx = await browser.newContext()
      const page = await ctx.newPage()
      const navs = []
      page.on('framenavigated', (f) => {
        if (f === page.mainFrame()) navs.push(f.url())
      })
      await page.goto(`${BASE}/step-8`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(2500)
      const flips = navs.filter((u) => /\/step-(1|8)\b/.test(u)).length
      if (flips > 8) fail('no redirect loop /step-8', navs.slice(-10).join(' > '))
      else if (page.url().includes('/step-8') && navs.every((u) => u.includes('/step-8')))
        fail('block skip /step-8', page.url())
      else pass('block skip /step-8 no-loop')
      await ctx.close()
    }

    // ── Data persist + browser back ───────────────────────────────────
    {
      const ctx = await browser.newContext()
      const page = await ctx.newPage()
      const s = seed(`e2e_data_${Date.now()}`, {
        currentStep: 2,
        completedSteps: [1],
        portalData: { chakraSelected: 'sacral' },
      })
      await applySeed(page, s)
      await page.goto(`${BASE}/step-2`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(800)
      let raw = await page.evaluate((k) => localStorage.getItem(k), s.dataKey)
      let parsed = JSON.parse(raw || '{}')
      if (parsed.portalData?.chakraSelected === 'sacral') pass('data present step-2')
      else fail('data present step-2', raw)

      // go to step-1 via history: navigate then back
      await page.goto(`${BASE}/step-1`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(800)
      await page.goBack()
      await page.waitForTimeout(1000)
      raw = await page.evaluate((k) => localStorage.getItem(k), s.dataKey)
      parsed = JSON.parse(raw || '{}')
      if (parsed.portalData?.chakraSelected === 'sacral') pass('data after back')
      else fail('data after back', raw)

      await page.reload({ waitUntil: 'networkidle' })
      await page.waitForTimeout(800)
      raw = await page.evaluate((k) => localStorage.getItem(k), s.dataKey)
      parsed = JSON.parse(raw || '{}')
      if (parsed.portalData?.chakraSelected === 'sacral') pass('data after refresh')
      else fail('data after refresh', raw)
      await ctx.close()
    }

    // ── Browser back/forward mid-portal ───────────────────────────────
    {
      const ctx = await browser.newContext()
      const page = await ctx.newPage()
      const s = seed(`e2e_hist_${Date.now()}`, {
        currentStep: 3,
        completedSteps: [1, 2],
        portalData: { chakraSelected: 'heart', archetypeSelected: 'seeker' },
      })
      await applySeed(page, s)
      await page.goto(`${BASE}/step-3`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(800)
      await page.goto(`${BASE}/step-2`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)
      // accessible completed step — should allow or sync without loop
      if (/\/step-[12]\b/.test(page.url()) || page.url().includes('/step-3'))
        pass('history to earlier step stable')
      else fail('history to earlier step stable', page.url())

      await page.goForward()
      await page.waitForTimeout(1000)
      if (!/redirect|error/i.test(page.url())) pass('browser forward stable')
      else fail('browser forward stable', page.url())
      await ctx.close()
    }

    // ── Happy path Step1→2 (breath ~32s) — race check ─────────────────
    {
      const ctx = await browser.newContext()
      const page = await ctx.newPage()
      page.on('pageerror', (e) => consoleBag.push(String(e)))
      await page.goto(`${BASE}/step-1`, { waitUntil: 'networkidle' })
      const cta = page.getByRole('button', { name: /Begin Your Journey/i })
      try {
        await cta.waitFor({ state: 'visible', timeout: 50000 })
        pass('step1 CTA after breath')
      } catch {
        fail('step1 CTA after breath', 'timeout')
        await ctx.close()
        // still finish other report
      }

      if (await cta.isVisible().catch(() => false)) {
        // double-click Continue (edge)
        await cta.click()
        await cta.click({ timeout: 500 }).catch(() => {})
        try {
          await page.waitForURL('**/step-2', { timeout: 12000 })
          await page.waitForTimeout(2000)
          if (page.url().includes('/step-2')) pass('happy step1→step2')
          else fail('happy step1→step2', page.url())
          if (page.url().includes('/step-1')) fail('no flash-back to step1', page.url())
          else pass('no flash-back to step1')

          const sid = await page.evaluate(() => localStorage.getItem('aumveda_portal_session_id'))
          const raw = sid
            ? await page.evaluate((id) => localStorage.getItem(`aumveda_portal_session_${id}`), sid)
            : null
          const st = raw ? JSON.parse(raw) : null
          if (st?.currentStep === 2 && st.completedSteps?.includes(1))
            pass('persist nextStep=2 after continue')
          else fail('persist nextStep=2 after continue', raw)
        } catch (e) {
          fail('happy step1→step2', e.message)
        }
      }
      await ctx.close()
    }

    // ── Second tab / fresh session ────────────────────────────────────
    {
      const ctx = await browser.newContext()
      const page = await ctx.newPage()
      await page.goto(`${BASE}/step-1`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(500)
      if (page.url().includes('/step-1')) pass('incognito-like fresh → step-1')
      else fail('incognito-like fresh → step-1', page.url())
      await ctx.close()
    }

    const hydra = consoleBag.filter((t) => /Hydration|hydration/i.test(t))
    const loops = consoleBag.filter((t) => /Maximum update depth|redirect loop/i.test(t))
    if (hydra.length) fail('console hydration', hydra[0])
    else pass('console no hydration')
    if (loops.length) fail('console redirect loop', loops[0])
    else pass('console no redirect loop')
  } finally {
    await browser.close()
  }

  console.log(failed ? `\nFAILED ${failed}` : '\nALL PASS')
  process.exit(failed ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
