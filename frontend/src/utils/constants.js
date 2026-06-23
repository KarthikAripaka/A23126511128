export const API_BASE_URL = 'http://4.224.186.213/evaluation-service';

export const NOTIFICATION_TYPES = {
  Placement: { label: 'Placement', color: 'primary', weight: 3 },
  Result: { label: 'Result', color: 'secondary', weight: 2 },
  Event: { label: 'Event', color: 'default', weight: 1 },
};

export const TOP_N_OPTIONS = [10, 15, 20];

export const STORAGE_KEYS = {
  VIEWED_NOTIFICATIONS: 'affordmed_viewed_notifications',
};

export const ROUTES = {
  ALL_NOTIFICATIONS: '/all',
  PRIORITY_NOTIFICATIONS: '/priority',
};
