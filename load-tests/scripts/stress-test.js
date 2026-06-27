import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Gradual ramp-up
    { duration: '1m', target: 100 },   // Normal-to-heavy load
    { duration: '1m', target: 200 },   // Stress testing peak
    { duration: '1m30s', target: 200 }, // Hold stress load
    { duration: '30s', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'], // 95% of requests under 1.5s (degraded expectation is OK under stress)
    http_req_failed: ['rate<0.05'],    // Less than 5% request failure rate
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const headers = { 'Content-Type': 'application/json' };
  
  const uniqueId = `${__VU}_${__ITER}_${Math.floor(Math.random() * 1000000)}`;
  const email = `stressuser_${uniqueId}@example.com`;
  const password = 'StressPassword123!';
  const name = `Stress Tester ${uniqueId}`;

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

  sleep(0.5); // Shortened think time under stress to increase request density

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

  sleep(0.5);

  // 3. Verify Session
  const verifyRes = http.get(`${BASE_URL}/auth/verify`, { headers });
  check(verifyRes, {
    'session verification is 200': (r) => r.status === 200,
  });

  // 4. View User Profile
  const profileRes = http.get(`${BASE_URL}/auth/profile/${encodeURIComponent(email)}`, { headers });
  check(profileRes, {
    'profile fetch is 200': (r) => r.status === 200,
  });

  // 5. Browse Clubs
  const clubsRes = http.get(`${BASE_URL}/api/clubs`, { headers });
  check(clubsRes, {
    'clubs catalog fetch is 200': (r) => r.status === 200,
  });

  // 6. Browse Events
  const eventsRes = http.get(`${BASE_URL}/api/events`, { headers });
  check(eventsRes, {
    'events catalog fetch is 200': (r) => r.status === 200,
  });

  // 7. Join a Club (Club ID 1)
  const joinPayload = JSON.stringify({ email, clubId: 1 });
  const joinRes = http.post(`${BASE_URL}/auth/join-club`, joinPayload, { headers });
  check(joinRes, {
    'join club response is 200': (r) => r.status === 200,
  });

  sleep(0.5);

  // 8. Leave the Club
  const leavePayload = JSON.stringify({ email, clubId: 1 });
  const leaveRes = http.post(`${BASE_URL}/auth/leave-club`, leavePayload, { headers });
  check(leaveRes, {
    'leave club response is 200': (r) => r.status === 200,
  });

  sleep(0.5);

  // 9. Logout
  const logoutRes = http.post(`${BASE_URL}/auth/logout`, null, { headers });
  check(logoutRes, {
    'logout response is 200': (r) => r.status === 200,
  });

  sleep(1);
}
