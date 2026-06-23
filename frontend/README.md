# Campus Notifications - Priority Inbox (Frontend)

> Stage 2 Deliverable - AffordMed Campus Hiring Evaluation

React frontend for viewing, filtering, and prioritizing campus notifications.

## Features

- View all notifications from the API
- View priority-ranked notifications (Top 10 / 15 / 20)
- Filter by type: Placement, Result, Event
- Track viewed / unviewed notifications via localStorage
- Responsive Material UI layout
- Structured logging via middleware (no console.log)
- Error handling with user-friendly alerts

## Prerequisites

- Node.js >= 16
- npm or yarn

## Installation

```bash
cd frontend
npm install
```

## Environment Variables

The API base URL and auth token are pre-configured in `src/services/api.js`.

To override, create a `.env` file:

```env
VITE_API_BASE_URL=http://4.224.186.213/evaluation-service
VITE_AUTH_TOKEN=your-token-here
```

## Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── NotificationCard.jsx
│   │   ├── NotificationList.jsx
│   │   ├── FilterBar.jsx
│   │   ├── TopNSelector.jsx
│   │   ├── LoadingState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── EmptyState.jsx
│   │   └── NavigationBar.jsx
│   ├── pages/
│   │   ├── AllNotifications.jsx
│   │   └── PriorityNotifications.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── notificationService.js
│   ├── middleware/
│   │   └── logger.js
│   ├── hooks/
│   │   ├── useNotifications.js
│   │   ├── usePriorityNotifications.js
│   │   └── useViewedNotifications.js
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   └── storage.js
│   ├── theme/
│   │   └── theme.js
│   ├── App.jsx
│   └── index.js
├── package.json
├── vite.config.js
└── README.md
```

## Screenshots Placeholder

- **All Notifications Page**: `screenshots/all-notifications.png`
- **Priority Notifications Page**: `screenshots/priority-notifications.png`
- **Filter Functionality**: `screenshots/filter-demo.png`
- **Top N Selector**: `screenshots/top-n-selector.png`
- **Viewed / Unviewed Behavior**: `screenshots/viewed-status.png`
- **Mobile Responsive View**: `screenshots/mobile-view.png`
- **Error Handling**: `screenshots/error-state.png`

## Video Recording Checklist

Record the following:

1. All Notifications page loading and displaying cards
2. Priority Notifications page showing Top 10/15/20
3. Filter by type (Placement, Result, Event)
4. Top N selector changing results instantly
5. Click a notification to mark as viewed
6. Refresh page to verify viewed state persists
7. Mobile responsive view (resize browser)
8. Error handling (disconnect network to see error state)

## Evaluation Checklist

- [ ] React + React Router DOM + Axios + MUI used
- [ ] No Tailwind / Bootstrap / ShadCN / Chakra / Ant Design
- [ ] No console.log / console.error / console.warn
- [ ] Logging middleware integrated
- [ ] All API calls through `services/api.js`
- [ ] Top N selector (10, 15, 20)
- [ ] Type filters (All, Placement, Result, Event)
- [ ] Viewed/unviewed tracking with localStorage
- [ ] Responsive Material UI design
- [ ] Loading, Error, Empty states present
- [ ] Application runs on http://localhost:3000

## Git Commit Recommendations

```bash
git checkout -b stage2/react-frontend
git add frontend/
git commit -m "feat: implement React frontend for notification priority system

- Add Material UI components (Card, Chip, Badge, AppBar, etc.)
- Add Axios service with interceptors and logging
- Add custom hooks for notifications, priority, and viewed state
- Add routing between All Notifications and Priority pages
- Add localStorage-based viewed/unviewed tracking
- Add responsive layout and error/loading/empty states
- Add README with setup instructions and evaluation checklist"
```
