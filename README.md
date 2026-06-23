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
   ID       : notif-0085
   Message  : Flipkart Grid 5.0 registration open #85
   Time     : 2026-06-23T03:13:07.625Z

#2 [Placement] (Priority: HIGH)
   ID       : notif-0025
   Message  : Flipkart Grid 5.0 registration open #25
   Time     : 2026-06-23T02:19:48.063Z

... (8 more) ...

--- Summary ---
Placement : 10
Result    : 0
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
