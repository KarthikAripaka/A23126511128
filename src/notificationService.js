import MinHeap from './minHeap.js';
import { logger } from './loggingMiddleware.js';

const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1
};

const VALID_TYPES = Object.keys(TYPE_WEIGHTS);

export function getTypeWeight(type) {
  if (!VALID_TYPES.includes(type)) {
    logger.warn('Unknown notification type encountered', { type });
    return 0;
  }
  return TYPE_WEIGHTS[type];
}

export function compareNotifications(a, b) {
  const typeDiff = getTypeWeight(a.Type) - getTypeWeight(b.Type);
  if (typeDiff !== 0) return typeDiff;
  return a.TimestampMs - b.TimestampMs;
}

export function normalizeNotification(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (!raw.ID || !raw.Type || !raw.Message || !raw.Timestamp) return null;
  
  const timestampMs = new Date(raw.Timestamp).getTime();
  if (Number.isNaN(timestampMs)) {
    logger.warn('Invalid timestamp in notification', { id: raw.ID, timestamp: raw.Timestamp });
    return null;
  }

  return {
    ID: raw.ID,
    Type: raw.Type,
    Message: raw.Message,
    Timestamp: raw.Timestamp,
    TimestampMs: timestampMs,
    TypeWeight: getTypeWeight(raw.Type)
  };
}

export class NotificationService {
  constructor(config = {}) {
    this.apiUrl = config.apiUrl || 'http://4.224.186.213/evaluation-service/notifications';
    this.authToken = config.authToken || process.env.NOTIFICATION_API_KEY || '';
    this.topK = config.topK || 10;
    this.heap = new MinHeap(compareNotifications);
  }

  async fetchNotifications() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    logger.info('Fetching notifications from API', { url: this.apiUrl });

    let data;
    try {
      const response = await fetch(this.apiUrl, { headers });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      data = await response.json();
    } catch (error) {
      logger.error('Failed to fetch from API, using mock data for demonstration', {
        error: error.message,
        url: this.apiUrl
      });
      data = this.getMockNotifications();
    }

    const notifications = Array.isArray(data) ? data : (data.notifications || []);
    if (!Array.isArray(notifications)) {
      logger.error('Invalid API response format', { dataType: typeof data });
      return [];
    }

    logger.info(`Received ${notifications.length} notifications`, { count: notifications.length });
    return notifications;
  }

  getMockNotifications() {
    const now = Date.now();
    const types = ['Placement', 'Result', 'Event'];
    const messages = {
      Placement: [
        'Google Drive interview scheduled for tomorrow',
        'Microsoft campus placement drive next week',
        'Amazon hiring for SDE role',
        'Goldman Sachs internship offer released',
        'Flipkart Grid 5.0 registration open',
        'Tata Consultancy Services campus drive',
        'Accenture placement results announced',
        'Infosys SES recruitment started',
        'Wipro Elite National Level Test',
        'Deloitte campus placement process'
      ],
      Result: [
        'Semester 6 results declared',
        'GATE 2026 scorecard released',
        'CAT 2025 percentile announced',
        'JEE Advanced rank out',
        'Internal exam results published',
        'Lab assessment marks updated',
        'Project evaluation scores live',
        'Mid-term marks available',
        'Assignment grades posted',
        'End-semester results out'
      ],
      Event: [
        'Tech fest registration closes Friday',
        'Cultural night tomorrow at 6 PM',
        'Guest lecture on AI at 10 AM',
        'Hackathon kickoff this weekend',
        'Alumni meet next Sunday',
        'Sports day schedule released',
        'Coding workshop registration open',
        'Book fair in library hall',
        'Photography contest deadline',
        'Annual day celebration next month'
      ]
    };

    const notifications = [];
    for (let i = 0; i < 125; i++) {
      const type = types[i % 3];
      const msgs = messages[type];
      const msg = msgs[i % msgs.length];
      const offset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // up to 7 days ago
      const timestamp = new Date(now - offset).toISOString();

      notifications.push({
        ID: `notif-${String(i + 1).padStart(4, '0')}`,
        Type: type,
        Message: `${msg} #${i + 1}`,
        Timestamp: timestamp
      });
    }
    return notifications;
  }

  processNotification(raw) {
    const normalized = normalizeNotification(raw);
    if (!normalized) return null;
    logger.debug('Processing notification', { id: normalized.ID, type: normalized.Type });
    return normalized;
  }

  addToTopK(notification) {
    if (this.heap.size < this.topK) {
      this.heap.push(notification);
      logger.debug(`Added to heap (size ${this.heap.size})`, { id: notification.ID, type: notification.Type });
    } else {
      const worst = this.heap.peek();
      if (compareNotifications(notification, worst) > 0) {
        this.heap.pop();
        this.heap.push(notification);
        logger.debug(`Replaced in heap`, { id: notification.ID, type: notification.Type });
      }
    }
  }

  async getTopKNotifications() {
    const rawNotifications = await this.fetchNotifications();
    const startTime = Date.now();
    let processed = 0;
    let invalid = 0;

    for (const raw of rawNotifications) {
      const normalized = this.processNotification(raw);
      if (!normalized) {
        invalid++;
        continue;
      }
      processed++;
      this.addToTopK(normalized);
    }

    const topNotifications = this.heap.toSortedArray().reverse();

    logger.info('Top-K computation complete', {
      totalRaw: rawNotifications.length,
      processed,
      invalid,
      topK: topNotifications.length,
      durationMs: Date.now() - startTime
    });

    return topNotifications;
  }

  reset() {
    this.heap = new MinHeap(compareNotifications);
  }
}

export default NotificationService;
