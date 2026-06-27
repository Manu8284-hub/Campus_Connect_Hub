import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 40 },  // Ramp-up to 40 virtual users
    { duration: '1m30s', target: 40 }, // Hold constant at 40 users (peak load)
    { duration: '15s', target: 0 },   // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<600'], // 95% of requests must finish within 600ms
    http_req_failed: ['rate<0.02'],   // Error rate should be less than 2%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const headers = { 'Content-Type': 'application/json' };
  
  // Create a unique user for each VU iteration to simulate distinct people registering
  const uniqueId = `${__VU}_${__ITER}_${Math.floor(Math.random() * 1000000)}`;
  const email = `loaduser_${uniqueId}@example.com`;
  const password = 'LoadPassword123!';
  const name = `Load Tester ${uniqueId}`;

  // 1. User Registration
  const registerPayload = JSON.stringify({ name, email, password });
  const regRes = http.post(`${BASE_URL}/auth/register`, registerPayload, { headers });
  
  const isRegistered = check(regRes, {
    'registration response is 201': (r) => r.status === 201,
    'user object returned': (r) => r.json() && r.json().user && r.json().user.email === email,
  });

  if (!isRegistered) {
    // If registration failed (e.g. server busy or db lock), pause and skip rest of flow
    sleep(1);
    return;
  }

  sleep(1); // User think time

  // 2. User Login
  // Note: Registration automatically logs the user in (sets cookie),
  // but simulating a fresh login is critical because bcrypt password hashing
  // is extremely CPU-bound and exercises the backend's crypto capability.
  const loginPayload = JSON.stringify({ email, password });
  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, { headers });
  
  const isLoggedIn = check(loginRes, {
    'login response is 200': (r) => r.status === 200,
    'login contains user details': (r) => r.json() && r.json().user && r.json().user.email === email,
  });

  if (!isLoggedIn) {
    sleep(1);
    return;
  }

  sleep(1);

  // 3. Verify Session (uses the Cookie set during login/registration)
  const verifyRes = http.get(`${BASE_URL}/auth/verify`, { headers });
  check(verifyRes, {
    'session verification is 200': (r) => r.status === 200,
    'session matches user': (r) => r.json() && r.json().user && r.json().user.email === email,
  });

  // 4. View User Profile
  const profileRes = http.get(`${BASE_URL}/auth/profile/${encodeURIComponent(email)}`, { headers });
  check(profileRes, {
    'profile fetch is 200': (r) => r.status === 200,
    'profile email matches': (r) => r.json() && r.json().profile && r.json().profile.email === email,
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

  // 7. Join a Club (Club ID 1 is seeded by default)
  const joinPayload = JSON.stringify({ email, clubId: 1 });
  const joinRes = http.post(`${BASE_URL}/auth/join-club`, joinPayload, { headers });
  check(joinRes, {
    'join club response is 200': (r) => r.status === 200,
    'user joinedClubIds includes club': (r) => r.json() && r.json().profile && Array.isArray(r.json().profile.joinedClubIds) && r.json().profile.joinedClubIds.includes(1),
  });

  sleep(1.5); // Simulating reading/checking out club page

  // 8. Leave the Club
  const leavePayload = JSON.stringify({ email, clubId: 1 });
  const leaveRes = http.post(`${BASE_URL}/auth/leave-club`, leavePayload, { headers });
  check(leaveRes, {
    'leave club response is 200': (r) => r.status === 200,
    'user joinedClubIds does not include club': (r) => r.json() && r.json().profile && Array.isArray(r.json().profile.joinedClubIds) && !r.json().profile.joinedClubIds.includes(1),
  });

  sleep(1);

  // 9. Logout
  const logoutRes = http.post(`${BASE_URL}/auth/logout`, null, { headers });
  check(logoutRes, {
    'logout response is 200': (r) => r.status === 200,
  });

  sleep(2); // Pause before next iteration
}
