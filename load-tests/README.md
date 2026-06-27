# Campus Connect Hub — k6 Load Testing Suite

This directory contains a complete load testing suite powered by [k6](https://k6.io/), an open-source tool for API load and performance testing.

The tests simulate real-world user activity on the backend, focusing on authentication, profile lookups, browsing catalog lists, and performing write operations like joining and leaving clubs.

---

## Table of Contents
- [Installation](#1-installation)
- [Testing Profiles](#2-testing-profiles)
- [How to Run the Tests](#3-how-to-run-the-tests)
- [Configuring the Target Environment](#4-configuring-the-target-environment)
- [Interpreting Test Results](#5-interpreting-test-results)
- [Important Caveats & Tips](#6-important-caveats--tips)

---

## 1. Installation

k6 is compiled as a standalone Go binary (not an npm package). You must install it on your system to run the tests.

### Windows
Using Windows Package Manager (Winget):
```powershell
winget install grafana.k6
```
Or via Chocolatey:
```powershell
choco install k6
```

### macOS
Using Homebrew:
```bash
brew install k6
```

### Linux
For Debian/Ubuntu systems:
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5D28574BB111794
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/ antitrust/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Run using Docker
If you prefer not to install it locally:
```bash
docker run --rm -i -v "$(pwd):/app" -w /app grafana/k6 run load-tests/scripts/smoke-test.js
```

---

## 2. Testing Profiles

We have designed four different load testing profiles matching standard software engineering performance-testing methodologies:

| File Name | Test Profile | Concurrency (VUs) | Duration | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`smoke-test.js`** | **Smoke Test** | 1 VU | 10s | Minimal load. Verifies that endpoints work correctly under baseline conditions. |
| **`load-test.js`** | **Load Test** | Ramps to 40 VUs | 2m15s | Regular peak-load simulation. Validates SLA/performance thresholds. |
| **`stress-test.js`** | **Stress Test** | Ramps to 200 VUs | 4m30s | Heavy load to check system limits, scalability, and find breaking points. |
| **`spike-test.js`** | **Spike Test** | Ramps to 150 VUs | 50s | Extremely sudden burst of traffic to evaluate recovery speed. |

---

## 3. How to Run the Tests

Ensure your backend server is running (e.g. `npm run dev` or `node server.js` from the `backend/` directory) before running the load tests.

From the **project root directory**, you can use the following NPM wrapper scripts:

### Run the Smoke Test
Verifies baseline API availability:
```bash
npm run test:load:smoke
```

### Run the Standard Load Test
Simulates a real-world peak load scenario (40 users concurrently registering, logging in, surfing events/clubs, joining a club, leaving a club, and logging out):
```bash
npm run test:load
```

### Run the Stress Test
Pushes the system boundary with up to 200 concurrent users:
```bash
npm run test:load:stress
```

### Run the Spike Test
Assesses how the system handles sudden bursts of traffic:
```bash
npm run test:load:spike
```

---

## 4. Configuring the Target Environment

By default, the scripts target `http://localhost:3000`. You can test staging or production backends by setting the `BASE_URL` environment variable.

### On Windows (PowerShell)
```powershell
$env:BASE_URL="https://your-api-domain.com"
npm run test:load
```

### On macOS / Linux
```bash
BASE_URL=https://your-api-domain.com npm run test:load
```

### Directly via the k6 CLI
```bash
k6 run -e BASE_URL=https://your-api-domain.com load-tests/scripts/load-test.js
```

---

## 5. Interpreting Test Results

When a k6 run finishes, it prints a summary of statistics to the terminal. Pay close attention to:

- **`http_req_duration`**: The end-to-end response time of the requests (includes server response and network transfer). Check `p(95)` (95th percentile) to see what response time 95% of your users experienced.
- **`http_req_failed`**: The rate/percentage of requests that returned errors (non-2xx statuses). Our tests set thresholds requiring this to be `< 1%` to `< 5%` depending on the test type.
- **`vus` & `vus_max`**: Number of virtual users currently running.
- **`checks`**: The percentage of test assertions that succeeded (e.g., verifying status code 200/201, checking if database response lists are lists).

---

## 6. Important Caveats & Tips

- **Fallback Database (Local JSON)**: If the backend is running in local fallback database mode (writing state to `backend/backend-db.json` due to no MongoDB instance active), multiple concurrent user registrations or club writes can bottleneck on JSON file I/O operations. This will skew load test statistics and can trigger JSON parsing issues. **For stress/spike tests, make sure a real MongoDB database is configured.**
- **Bcrypt Hashing**: Simulating user logins triggers password validation using `bcrypt.compare()`. This is deliberately CPU-intensive on the server side to protect passwords. As a result, the stress/spike tests are highly CPU-bound. If CPU usage hits 100%, consider scaling your machine or using pre-generated JWT tokens to bypass bcrypt hashing in tests targeting non-auth API endpoints.
