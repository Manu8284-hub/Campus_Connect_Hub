import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 150 }, // Fast ramp-up to 150 users
    { duration: '30s', target: 150 }, // Hold peak spike
    { duration: '10s', target: 0 },   // Fast ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s during the spike
    http_req_failed: ['rate<0.10'],   // Allow up to 10% failure rate under sudden extreme pressure
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const headers = { 'Content-Type': 'application/json' };
  
  const uniqueId = `${__VU}_${__ITER}_${Math.floor(Math.random() * 1000000)}`;
  const email = `spikeuser_${uniqueId}@example.com`;
  const password = 'SpikePassword123!';
  const name = `Spike Tester ${uniqueId}`;

  // 1. User Registration
  const registerPayload = JSON.stringify({ name, email, password });
  const regRes = http.post(`${BASE_URL}/auth/register`, registerPayload, { headers });
  
  const isRegistered = check(regRes, {
    'registration response is 201': (r) => r.status === 201,
  });

  if (!isRegistered) {
    sleep(0.5);
    return;
  }

  sleep(0.2); // Extremely short think time to simulate aggressive concurrent hammering

  // 2. User Login
  const loginPayload = JSON.stringify({ email, password });
  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, { headers });
  
  const isLoggedIn = check(loginRes, {
    'login response is 200': (r) => r.status === 200,
  });

  if (!isLoggedIn) {
    sleep(0.5);
    return;
  }

  sleep(0.2);

  // 3. Verify Session
  const verifyRes = http.get(`${BASE_URL}/auth/verify`, { headers });
  check(verifyRes, {
    'session verification is 200': (r) => r.status === 200,
  });

  // 4. Browse Clubs
  const clubsRes = http.get(`${BASE_URL}/api/clubs`, { headers });
  check(clubsRes, {
    'clubs catalog fetch is 200': (r) => r.status === 200,
  });

  // 5. Browse Events
  const eventsRes = http.get(`${BASE_URL}/api/events`, { headers });
  check(eventsRes, {
    'events catalog fetch is 200': (r) => r.status === 200,
  });

  // 6. Join a Club (Club ID 1)
  const joinPayload = JSON.stringify({ email, clubId: 1 });
  const joinRes = http.post(`${BASE_URL}/auth/join-club`, joinPayload, { headers });
  check(joinRes, {
    'join club response is 200': (r) => r.status === 200,
  });

  sleep(0.2);

  // 7. Leave the Club
  const leavePayload = JSON.stringify({ email, clubId: 1 });
  const leaveRes = http.post(`${BASE_URL}/auth/leave-club`, leavePayload, { headers });
  check(leaveRes, {
    'leave club response is 200': (r) => r.status === 200,
  });

  // 8. Logout
  const logoutRes = http.post(`${BASE_URL}/auth/logout`, null, { headers });
  check(logoutRes, {
    'logout response is 200': (r) => r.status === 200,
  });

  sleep(0.5);
}
