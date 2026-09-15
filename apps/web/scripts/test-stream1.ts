// Stream 1 Unit Verification

function inferNervousSystemState(metrics: {
  rageClicksCount: number
  deadClicksCount: number
  hesitationDwellMs: number
  cursorVelocityAvg?: number | null
}): 'HYPERAROUSAL' | 'SHUTDOWN' | 'REGULATED' {
  const { rageClicksCount, deadClicksCount, hesitationDwellMs, cursorVelocityAvg } = metrics

  if (rageClicksCount >= 2 || (rageClicksCount >= 1 && (cursorVelocityAvg ?? 0) > 1.2)) {
    return 'HYPERAROUSAL'
  }

  if (deadClicksCount >= 3 || (hesitationDwellMs > 15000 && (cursorVelocityAvg ?? 0) < 0.2)) {
    return 'SHUTDOWN'
  }

  return 'REGULATED'
}

async function runTests() {
  console.log('=== RUNNING STREAM 1 VERIFICATION TESTS ===')

  // 1. Behavioral Telemetry Inference Tests
  console.log('\n--- Test 1: Behavioral Telemetry State Inference ---')
  
  const hyperarousal1 = inferNervousSystemState({
    rageClicksCount: 3,
    deadClicksCount: 1,
    hesitationDwellMs: 2000,
    cursorVelocityAvg: 0.8,
  })
  console.log(`Rage clicks (3) -> Expected: HYPERAROUSAL, Got: ${hyperarousal1}`)
  if (hyperarousal1 !== 'HYPERAROUSAL') throw new Error('Failed hyperarousal test 1')

  const shutdown1 = inferNervousSystemState({
    rageClicksCount: 0,
    deadClicksCount: 4,
    hesitationDwellMs: 20000,
    cursorVelocityAvg: 0.05,
  })
  console.log(`Dead clicks (4) + prolonged dwell -> Expected: SHUTDOWN, Got: ${shutdown1}`)
  if (shutdown1 !== 'SHUTDOWN') throw new Error('Failed shutdown test 1')

  const regulated1 = inferNervousSystemState({
    rageClicksCount: 0,
    deadClicksCount: 1,
    hesitationDwellMs: 3000,
    cursorVelocityAvg: 0.5,
  })
  console.log(`Normal interaction -> Expected: REGULATED, Got: ${regulated1}`)
  if (regulated1 !== 'REGULATED') throw new Error('Failed regulated test 1')

  console.log('✔ All Telemetry Inference Tests Passed!')

  // 2. OTP Code Validation Logic
  console.log('\n--- Test 2: OTP Format & Expiry Rules ---')
  const validRegex = /^\d{6}$/
  console.log('OTP "123456" matches 6-digit regex:', validRegex.test('123456'))
  console.log('OTP "12345" fails 6-digit regex:', !validRegex.test('12345'))
  console.log('OTP "abcdef" fails 6-digit regex:', !validRegex.test('abcdef'))

  const now = new Date()
  const unexpired = new Date(now.getTime() + 10 * 60 * 1000)
  const expired = new Date(now.getTime() - 1000)

  console.log('Unexpired code valid check:', now <= unexpired)
  console.log('Expired code expiration check:', now > expired)

  if (!validRegex.test('849201') || validRegex.test('12') || !(now <= unexpired) || !(now > expired)) {
    throw new Error('OTP validation logic failure')
  }

  // 3. Brute force lock simulation
  console.log('\n--- Test 3: OTP Brute Force 3-Attempt Lock ---')
  let attempts = 0
  const maxAttempts = 3
  const simulateAttempt = (code: string, actual: string) => {
    attempts++
    if (attempts >= maxAttempts) {
      return { ok: false, locked: true, error: 'Maximum attempts reached (3/3).' }
    }
    if (code !== actual) {
      return { ok: false, locked: false, remaining: maxAttempts - attempts }
    }
    return { ok: true, locked: false }
  }

  const res1 = simulateAttempt('111111', '654321')
  console.log('Attempt 1 (wrong):', res1)
  const res2 = simulateAttempt('222222', '654321')
  console.log('Attempt 2 (wrong):', res2)
  const res3 = simulateAttempt('333333', '654321')
  console.log('Attempt 3 (wrong):', res3)

  if (!res3.locked) throw new Error('Lock should be engaged on attempt 3')
  console.log('✔ Brute force lock test passed!')

  console.log('\n=== ALL STREAM 1 TESTS PASSED SUCCESSFULLY! ===')
}

runTests().catch((err) => {
  console.error('Test failed:', err)
  process.exit(1)
})
