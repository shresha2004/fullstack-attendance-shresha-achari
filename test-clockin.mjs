#!/usr/bin/env node

/**
 * Test script to diagnose clock-in/clock-out issues
 * Run: node test-clockin.mjs
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function test() {
  console.log('🧪 Testing Clock In/Out endpoints...\n');

  try {
    // Step 1: Register a test employee
    console.log('1️⃣ Registering test employee...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `testemployee${Date.now()}@test.com`,
        password: 'testpass123',
        role: 'employee'
      })
    });

    if (!regRes.ok) {
      console.error('❌ Registration failed:', await regRes.text());
      return;
    }

    const regData = await regRes.json();
    const token = regData.token;
    console.log('✅ Registered. Token:', token.substring(0, 20) + '...\n');

    // Step 2: Test debug endpoint
    console.log('2️⃣ Testing debug endpoint (/api/debug/me)...');
    const debugRes = await fetch(`${BASE_URL}/debug/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!debugRes.ok) {
      console.error('❌ Debug endpoint failed:', await debugRes.text());
      return;
    }

    const debugData = await debugRes.json();
    console.log('✅ Debug response:', JSON.stringify(debugData, null, 2), '\n');

    // Step 3: Test clock-in
    console.log('3️⃣ Testing clock-in (/api/attendance/clock-in)...');
    const clockInRes = await fetch(`${BASE_URL}/attendance/clock-in`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const clockInData = await clockInRes.json();
    if (!clockInRes.ok) {
      console.error('❌ Clock-in failed:', clockInRes.status, clockInData);
      return;
    }

    console.log('✅ Clock-in successful:', JSON.stringify(clockInData, null, 2), '\n');

    // Step 4: Test clock-out
    console.log('4️⃣ Testing clock-out (/api/attendance/clock-out)...');
    const clockOutRes = await fetch(`${BASE_URL}/attendance/clock-out`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const clockOutData = await clockOutRes.json();
    if (!clockOutRes.ok) {
      console.error('❌ Clock-out failed:', clockOutRes.status, clockOutData);
      return;
    }

    console.log('✅ Clock-out successful:', JSON.stringify(clockOutData, null, 2), '\n');

    // Step 5: Fetch attendance logs
    console.log('5️⃣ Fetching attendance logs (/api/attendance/me)...');
    const logsRes = await fetch(`${BASE_URL}/attendance/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const logsData = await logsRes.json();
    if (!logsRes.ok) {
      console.error('❌ Fetch logs failed:', logsRes.status, logsData);
      return;
    }

    console.log('✅ Logs:', JSON.stringify(logsData, null, 2), '\n');

    console.log('✅ All tests passed!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

test();
