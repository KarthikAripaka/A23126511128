# Campus Notifications - Priority Inbox System

> Stage 1 Deliverable - AffordMed Campus Hiring Evaluation

A production-quality backend service that fetches campus notifications, ranks them by business priority, and surfaces the Top 10 highest-priority items using an efficient Min-Heap algorithm.

## Features

- Fetches notifications from the external API
- Normalizes and validates incoming data
- Ranks by: **Placement > Result > Event**, then by recency
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
   ID       : 7d9729a7-401d-4713-a559-98d227c707e1
   Message  : Eli Lilly and Company hiring
   Time     : 2026-06-23 02:57:56

#3 [Placement] (Priority: HIGH)
   ID       : 2c774a99-a78c-430d-8971-11eecc7b5d33
   Message  : PayPal Holdings Inc. hiring
   Time     : 2026-06-22 22:59:27

#4 [Placement] (Priority: HIGH)
   ID       : fbbf5bcd-8efa-4a32-bda7-18180b01952e
   Message  : Marvell Technology Inc. hiring
   Time     : 2026-06-22 16:26:25

#5 [Placement] (Priority: HIGH)
   ID       : 45256dd8-8a58-4303-b0e4-34b9a33d1647
   Message  : CSX Corporation hiring
   Time     : 2026-06-22 13:27:30

#6 [Placement] (Priority: HIGH)
   ID       : c6e2fb14-1cd9-4b3e-8df8-37826b9f3919
   Message  : Tesla Inc. hiring
   Time     : 2026-06-22 10:25:33

#7 [Result] (Priority: MEDIUM)
   ID       : 277d3d5d-264b-419e-94d8-099805ba14b1
   Message  : external
   Time     : 2026-06-23 01:56:51

#8 [Result] (Priority: MEDIUM)
   ID       : 9938af9d-e637-41dc-bd34-89ec424e8ca5
   Message  : project-review
   Time     : 2026-06-23 01:28:35

#9 [Result] (Priority: MEDIUM)
   ID       : 52d5c4f6-5001-410f-bb2d-edde283bc6a7
   Message  : mid-sem
   Time     : 2026-06-23 01:25:46

#10 [Result] (Priority: MEDIUM)
    ID       : 4471c9c6-211d-452e-9258-4c9f464d88a2
    Message  : internal
    Time     : 2026-06-22 22:57:04

--- Summary ---
Placement : 6
Result    : 4
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

## No Frontend

This is a **backend-only** service. It produces CLI output and structured logs. No React, Material UI, or web pages are included per Stage 1 requirements.
