import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1, // 1 virtual user
  duration: '10s', // 10s run duration
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete under 500ms
    http_req_failed: ['rate<0.01'],   // less than 1% request failures allowed
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  // 1. Validate root backend status
  const resRoot = http.get(`${BASE_URL}/`, { headers });
  check(resRoot, {
    'root status is 200': (r) => r.status === 200,
    'backend message matches': (r) => r.json() && r.json().message && r.json().message.includes('Backend is running'),
  });

  // 2. Fetch clubs list
  const resClubs = http.get(`${BASE_URL}/api/clubs`, { headers });
  check(resClubs, {
    'clubs status is 200': (r) => r.status === 200,
    'clubs structure correct': (r) => r.json() && Array.isArray(r.json().clubs),
  });

  // 3. Fetch events list
  const resEvents = http.get(`${BASE_URL}/api/events`, { headers });
  check(resEvents, {
    'events status is 200': (r) => r.status === 200,
    'events structure correct': (r) => r.json() && Array.isArray(r.json().events),
  });

  sleep(1);
}
