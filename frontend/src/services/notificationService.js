import { logger } from '../middleware/logger';

const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export const getTypeWeight = (type) => TYPE_WEIGHTS[type] || 0;

export const compareNotifications = (a, b) => {
  const typeDiff = getTypeWeight(a.Type) - getTypeWeight(b.Type);
  if (typeDiff !== 0) return typeDiff;
  return new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime();
};

export const normalizeNotification = (raw) => {
  if (!raw || !raw.ID || !raw.Type || !raw.Message || !raw.Timestamp) return null;
  return {
    ...raw,
    TypeWeight: getTypeWeight(raw.Type),
    TimestampMs: new Date(raw.Timestamp).getTime(),
  };
};

export const getTopKNotifications = (notifications, topK = 10) => {
  const normalized = notifications.map(normalizeNotification).filter(Boolean);
  logger.info('Computing Top-K notifications', { total: normalized.length, topK });

  const heap = [];
  const compare = (a, b) => compareNotifications(a, b);

  for (const notif of normalized) {
    if (heap.length < topK) {
      heap.push(notif);
      heap.sort(compare);
    } else if (compare(notif, heap[0]) > 0) {
      heap[0] = notif;
      heap.sort(compare);
    }
  }

  return heap.sort((a, b) => compareNotifications(b, a));
};

export const filterNotifications = (notifications, type = 'All') => {
  if (type === 'All') return notifications;
  return notifications.filter((n) => n.Type === type);
};

export default {
  getTopKNotifications,
  filterNotifications,
  getTypeWeight,
  compareNotifications,
};
