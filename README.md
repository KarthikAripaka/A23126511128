 Campus Notifications - Priority Inbox System

> Stage 1 Deliverable - AffordMed Campus Hiring Evaluation

A productio0n-quality backend service that fetches campus notifications, ranks them by business priority, and surfaces the Top 10 highest-priority items using an efficient Min-Heap algorithm.

## Features

- Fetches notifications from the external API
- Normalizes and validates incoming data
- Ranks by: ll*Placement > Result > Event**, then by recency
- Maintains Top 10 in **O(N log K)** time using a Min-Heap
- Integrates structured **Logging Middleware** (no console.log)
- Handles continuous/streaming updates without full re-sorts
- Gracefully degrades to mock data when API is unavailable

## Folder Structure

```
.
├── src/
│   ├── loggingMiddleware.js      # Structured logging (JSON + text)
│   ├── minHeap.js                # Generic Min-Heap implementation
│   ├── notificationService.js    # API fetch, normalization, Top-K logic
│   └── index.js                  # Executable demo & continuous update sim
├── Notification_System_Design.md # Architecture & design rationale
├── README.md                     # This file
├── package.json
└── sample-output.json            # Captured program output
```

## Installation

```bash
npm install
```

## Configuration

Set the authorization token in an environment variable if the API is accessible:

```bash
export NOTIFICATION_API_KEY="your-token-here"
```

The service will automatically use this token in the `Authorization` header.

## Usage

```bash
npm start
# or
node src/index.js
```

## Sample Output

```
========================================
 Campus Notifications - Priority Inbox  
========================================

--- Top 10 Highest-Priority Notifications ---

#1 [Placement] (Priority: HIGH)
   ID       : 4d2e9d9d-1059-45fe-8cc6-ca81bc343fc2
   Message  : Berkshire Hathaway Inc. hiring
   Time     : 2026-06-23 04:28:22

#2 [Placement] (Priority: HIGH)
   ID       : f1476c4c-a381-42f5-8b93-9caa09cd1347
   Message  : Eli Lilly and Company hiring
   Time     : 2026-06-23 02:30:45

#3 [Placement] (Priority: HIGH)
   ID       : 2358bbac-7be0-4081-bb0c-5c9ae537f1f7
   Message  : CSX Corporation hiring
   Time     : 2026-06-23 01:00:32

#4 [Placement] (Priority: HIGH)
   ID       : 2c774a99-a78c-430d-8971-11eecc7b5d33
   Message  : PayPal Holdings Inc. hiring
   Time     : 2026-06-22 22:59:27

#5 [Placement] (Priority: HIGH)
   ID       : d057bbe3-a8cf-43df-8e19-0f0a2c17ddd3
   Message  : Marvell Technology Inc. hiring
   Time     : 2026-06-22 21:02:16

#6 [Result] (Priority: MEDIUM)
   ID       : 0377ccf8-d38d-4ca5-800b-c6dcd60c65f9
   Message  : end-sem
   Time     : 2026-06-23 03:01:11

#7 [Result] (Priority: MEDIUM)
   ID       : 9938af9d-e637-41dc-bd34-89ec424e8ca5
   Message  : project-review
   Time     : 2026-06-23 01:28:35

#8 [Result] (Priority: MEDIUM)
   ID       : da8d87ad-8fbe-4e68-9458-d86fef344b77
   Message  : project-review
   Time     : 2026-06-22 16:01:37

#9 [Result] (Priority: MEDIUM)
   ID       : e6a00534-916c-4861-b8c9-16ab984a0178
   Message  : internal
   Time     : 2026-06-22 16:00:06

#10 [Result] (Priority: MEDIUM)
    ID       : b33a5479-8ac0-4f45-b870-91b0619c2021
    Message  : internal
    Time     : 2026-06-22 12:01:24

--- Summary ---
Placement : 5
Result    : 5
Event     : 0
Total     : 10
```

> Full program output (including structured logs) is available at `sample-output.json`.

## Algorithm

For N notifications and K=10:

1. **Normalize**: Attach `TypeWeight` and `TimestampMs` to each notification.
2. **Heap Push**: Maintain a Min-Heap of size at most K.
   - If heap has < K items, push directly.
   - Else, if `newNotification > heap.peek()`, replace the root (worst current item).
3. **Extract**: Pop all items, reverse for descending priority.

This avoids sorting the entire dataset and keeps memory bounded at O(K).

## Logging

All audit trails use the `LoggingMiddleware` in JSON format by default:

```json
{"timestamp":"2026-06-23T05:21:16.986Z","level":"INFO","message":"Top-K computation complete","totalRaw":125,"processed":125,"invalid":0,"topK":10,"durationMs":8}
```

Log levels: `DEBUG`, `INFO`, `WARN`, `ERROR`. Adjust via `LoggingMiddleware` constructor.

## Git Commit Recommendations

```bash
# Stage 1: Core implementation
git checkout -b stage1/priority-notification-system
git add package.json README.md Notification_System_Design.md src/
git commit -m "feat: implement notification priority system with min-heap

- Add LoggingMiddleware for structured JSON logging
- Add MinHeap for O(N log K) Top-10 selection
- Add NotificationService with API fetch and mock fallback
- Add executable index.js with Top-10 display and continuous update demo
- Add design document explaining priority, data structures, and scalability
- Add README with setup and usage instructions"

# If API credentials are obtained later:
git add .
git commit -m "chore: enable production API integration"
```

Frontend included for visualization of ranked notifications.

To start the frontend:

```bash
cd frontend
npm install
npm run dev
