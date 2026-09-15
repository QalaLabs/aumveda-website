import crypto from 'crypto'
import { EasebuzzDualGateway } from '../src/lib/payment/eazebus-adapter.ts'

async function runTests() {
  console.log('=== STARTING EASEBUZZ CHECKSUM & HMAC-SHA512 VALIDATION TESTS ===\n')

  const testKey = 'TEST_MERCHANT_KEY_123'
  const testSalt = 'TEST_SALT_SECRET_456'

  const gateway = new EasebuzzDualGateway({
    primary: {
      key: testKey,
      salt: testSalt,
      env: 'test',
    },
  })

  let passed = 0
  let failed = 0

  // ── TEST 1: Generate Reverse SHA-512 Hash & Verify Validation ──
  console.log('Test 1: Reverse SHA-512 Hash verification...')
  const txnid = 'AUM-ORD-1001-9988'
  const amount = '6999.00'
  const status = 'success'
  const email = 'seeker@aumveda.com'
  const firstname = 'Vikram'
  const productinfo = 'Pyrite Abundance Cluster + Executive Somatic Reset'
  const udfs = ['1001', 'usr_123', 'SOMATIC_SEJAL', 'Solar Plexus', '', '', '', '', '', '']

  const reverseHash = gateway.generateReverseHash(
    testSalt,
    status,
    udfs,
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    testKey
  )

  const payload: Record<string, unknown> = {
    key: testKey,
    txnid,
    amount,
    status,
    email,
    firstname,
    productinfo,
    udf1: udfs[0],
    udf2: udfs[1],
    udf3: udfs[2],
    udf4: udfs[3],
    hash: reverseHash,
    easepayid: 'EASEPAY_99887766',
  }

  try {
    const res = await gateway.processWebhook(payload)
    if (res && res.status === 'SUCCESS' && res.orderId === '1001' && res.easepayid === 'EASEPAY_99887766') {
      console.log('  ✓ Test 1 Passed: Valid reverse SHA-512 hash verified successfully.')
      passed++
    } else {
      console.error('  ✗ Test 1 Failed: Unexpected result:', res)
      failed++
    }
  } catch (err) {
    console.error('  ✗ Test 1 Failed with exception:', err)
    failed++
  }

  // ── TEST 2: Strict HMAC-SHA512 Checksum Validation over Raw Body ──
  console.log('\nTest 2: Strict HMAC-SHA512 Checksum over raw request body...')
  const rawBody = JSON.stringify(payload)
  const hmacSha512 = crypto.createHmac('sha512', testSalt).update(rawBody).digest('hex')

  try {
    const resHmac = await gateway.processWebhook(payload, rawBody, hmacSha512)
    if (resHmac && resHmac.status === 'SUCCESS') {
      console.log('  ✓ Test 2 Passed: Strict HMAC-SHA512 checksum verified successfully.')
      passed++
    } else {
      console.error('  ✗ Test 2 Failed: Unexpected result:', resHmac)
      failed++
    }
  } catch (err) {
    console.error('  ✗ Test 2 Failed with exception:', err)
    failed++
  }

  // ── TEST 3: Tampered Payload Rejection ──
  console.log('\nTest 3: Tampered payload rejection...')
  const tamperedPayload = {
    ...payload,
    amount: '1.00', // Attacker altered amount
  }
  const tamperedRawBody = JSON.stringify(tamperedPayload)

  try {
    await gateway.processWebhook(tamperedPayload, tamperedRawBody, hmacSha512)
    console.error('  ✗ Test 3 Failed: Tampered payload was NOT rejected!')
    failed++
  } catch (err: any) {
    if (err.message.includes('Invalid Easebuzz webhook')) {
      console.log('  ✓ Test 3 Passed: Tampered payload was strictly rejected as expected:', err.message)
      passed++
    } else {
      console.error('  ✗ Test 3 Failed with unexpected error:', err)
      failed++
    }
  }

  // ── TEST 4: Constant-Time Comparison Timing Safe Equal ──
  console.log('\nTest 4: Timing-safe equality checks...')
  const sigA = crypto.createHmac('sha512', testSalt).update('hello-aumveda').digest('hex')
  const isValidA = gateway.verifyHmacSha512('hello-aumveda', sigA, testSalt)
  const isInvalidA = gateway.verifyHmacSha512('hello-tampered', sigA, testSalt)

  if (isValidA && !isInvalidA) {
    console.log('  ✓ Test 4 Passed: verifyHmacSha512 handles valid & invalid signatures correctly.')
    passed++
  } else {
    console.error('  ✗ Test 4 Failed: verifyHmacSha512 mismatch:', { isValidA, isInvalidA })
    failed++
  }

  console.log(`\n=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`)
  if (failed > 0) process.exit(1)
}

runTests().catch(err => {
  console.error('Fatal test error:', err)
  process.exit(1)
})
