# Notification Priority System - System Design

## 1. Business Problem

Campus students receive a high volume of notifications about placements, results, and events. Important notifications (such as placement drives) get lost in the noise, causing students to miss critical deadlines and opportunities.

## 2. Priority Inbox Concept

The Priority Inbox automatically surfaces the most important notifications to the user by applying business-defined ranking rules. Instead of presenting a chronological list, the system ranks notifications by:

1. **Business Priority**: Placement > Result > Event
2. **Recency**: More recent notifications rank higher within the same type

This ensures students always see the 10 most important notifications first.

## 3. Notification Ranking Strategy

### Priority Weights
| Type | Weight |
|------|--------|
| Placement | 3 |
| Result | 2 |
| Event | 1 |

### Comparison Logic
A notification `A` has higher priority than notification `B` if:
- `A.TypeWeight > B.TypeWeight`, or
- `A.TypeWeight === B.TypeWeight` and `A.TimestampMs > B.TimestampMs`

This two-tiered comparison ensures that business importance dominates, while recency acts as a tiebreaker and freshness factor within the same category.

## 4. Data Structures Used

### Min-Heap (Priority Queue)
A generic `MinHeap` is the central data structure for maintaining the top-K notifications.

**Why Min-Heap?**
- We only care about the top 10 notifications, not the full sorted list.
- A min-heap of size K (K=10) keeps the smallest element at the root.
- As we iterate through all notifications, any new notification that is larger than the root replaces it.
- This guarantees O(N log K) time complexity vs. O(N log N) for full sorting.
- The heap requires only O(K) = O(10) additional space.

**Heap Invariant:**
- The root contains the *worst* of the current top-K elements.
- Any incoming element better than the root will displace it.
- After processing all notifications, extracting all elements and reversing gives the final ranked Top 10.

### Additional Structures
- **Normalized Notification Object**: Enriched with `TypeWeight` and `TimestampMs` for fast comparison.
- **Logging Middleware**: Centralized audit trail with timestamped JSON logs, replacing `console.log`/`console.error`.

## 5. Time Complexity

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Fetch Notifications | O(1) network | Depends on API latency |
| Normalize | O(1) per item | Extract and parse fields |
| Heap Insert | O(log K) | K = 10 |
| Overall (N items) | O(N log K) | N = total notifications |
| Final Extract | O(K log K) | Negligible (K=10) |

For 1,000,000 notifications, the heap-based approach requires ~1,000,000 * log₂(10) ≈ 3,320,000 operations vs. ~20,000,000 for full sort. This is a **6x speedup** and scales linearly with input size.

## 6. How Continuous Updates Are Handled

New notifications continuously arrive from the real-time API. The design supports streaming updates:

### Batch Re-computation
- For a batch of new notifications, simply iterate them through the existing `MinHeap`:
  - If `heap.size < K`, push directly.
  - Else if `newItem > heap.peek()`, pop and push (replace worst in top-K).
- No need to re-sort the entire dataset.

### Real-time Streaming
- Maintain a single `NotificationService` instance with a persistent heap.
- For each incoming notification, run `addToTopK()` in O(log K).
- This supports event-driven architectures (e.g., WebSockets, message queues).
- Memory footprint remains bounded at O(K).

### Simulation in This Codebase
The `index.js` demonstrates continuous updates by:
1. Computing initial Top 10.
2. Simulating 3 new Placement notifications with future timestamps.
3. Feeding them into a fresh heap seeded with the initial Top 10.
4. Showing that newer, higher-priority entries displace older ones.

## 7. Scalability Considerations

### Horizontal Scaling
- The processor is stateless with respect to the full dataset.
- Multiple instances can process independent notification shards.
- A final merge step can combine top-K lists from N instances in O(N*K log K).

### Persistent Storage
- If the notification list is too large for memory, use a distributed streaming platform (e.g., Apache Kafka, AWS Kinesis).
- Each consumer maintains its own local min-heap of size K.
- Results can be aggregated via MapReduce-style shuffling.

### Database Backing
- For historical queries, store each notification in a NoSQL store (Cassandra, DynamoDB) keyed by timestamp.
- The top-K query becomes: `SELECT * FROM notifications ORDER BY TypeWeight DESC, Timestamp DESC LIMIT 10`.
- An index on `(TypeWeight DESC, Timestamp DESC)` makes this query O(K).

### Caching
- Cache the Top 10 result for a short TTL (e.g., 30 seconds).
- Invalidate on new high-priority arrivals to keep latency low.

### Fault Tolerance
- API failures fall back to mock data automatically.
- Unrecognized types are logged and skipped with weight 0.
- Invalid timestamps are rejected and logged.

## 8. Logging Strategy

The `LoggingMiddleware` class replaces all `console.log` and `console.error` calls with structured logging.

### Features
- **Log Levels**: INFO, WARN, ERROR, DEBUG
- **Formats**: JSON (default) and plain text
- **Configurable threshold**: Only logs at or above the configured level are emitted.
- **Metadata support**: Every log includes contextual data (e.g., notification ID, type, duration).

### Example Log Entry
```json
{"timestamp":"2026-06-23T05:21:16.986Z","level":"INFO","message":"Top-K computation complete","totalRaw":125,"processed":125,"invalid":0,"topK":10,"durationMs":8}
```

### Production Enhancements
- Write logs to rotating file streams (e.g., `pino`, `winston`).
- Ship logs to a centralized aggregator (ELK, Datadog, Splunk).
- Add request IDs for end-to-end tracing across microservices.

## 9. Future Improvements

1. **Dynamic Priority Weights**: Allow admins to configure type weights without code changes (feature flags).
2. **User-Specific Ranking**: Incorporate user preferences, read history, and engagement scores.
3. **Multi-User Top-K**: Extend to per-user priority inboxes partitioned by user ID.
4. **Persistent Batching**: Combine micro-batches of new notifications with exponential backoff to reduce heap thrash.
5. **Observability**: Add metrics (Prometheus) for heap size, replacement rate, API latency, and error counts.
6. **Type-Safe Schemas**: Use Zod or TypeScript to validate API responses and prevent runtime errors.
7. **Graceful Degradation**: If the API is down, serve cached top-K from Redis with a stale-while-revalidate strategy.
