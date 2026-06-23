import NotificationService, { getTypeWeight, compareNotifications } from './notificationService.js';
import MinHeap from './minHeap.js';
import { logger, LOG_LEVELS } from './loggingMiddleware.js';

function renderNotification(n, rank) {
  const typeWeight = getTypeWeight(n.Type);
  const priorityLabel = typeWeight === 3 ? 'HIGH' : typeWeight === 2 ? 'MEDIUM' : 'LOW';

  return `#${rank} [${n.Type}] (Priority: ${priorityLabel})
   ID       : ${n.ID}
   Message  : ${n.Message}
   Time     : ${n.Timestamp}`;
}

async function main() {
  console.log('========================================');
  console.log(' Campus Notifications - Priority Inbox  ');
  console.log('========================================\n');

  logger.info('Application started');

  const service = new NotificationService({
    apiUrl: 'http://4.224.186.213/evaluation-service/notifications',
    topK: 10
  });

  try {
    const initialTop10 = await service.getTopKNotifications();

    console.log('\n--- Top 10 Highest-Priority Notifications ---\n');

    for (let i = 0; i < initialTop10.length; i++) {
      console.log(renderNotification(initialTop10[i], i + 1));
      console.log('');
    }

    const placementCount = initialTop10.filter(n => n.Type === 'Placement').length;
    const resultCount = initialTop10.filter(n => n.Type === 'Result').length;
    const eventCount = initialTop10.filter(n => n.Type === 'Event').length;

    console.log('--- Summary ---');
    console.log(`Placement : ${placementCount}`);
    console.log(`Result    : ${resultCount}`);
    console.log(`Event     : ${eventCount}`);
    console.log(`Total     : ${initialTop10.length}`);

    console.log('\n--- Simulating Continuous Updates (3 new arrivals) ---\n');

    const continuousSvc = new NotificationService({ topK: 10 });
    const baseTop10 = await continuousSvc.getTopKNotifications();

    const newArrivals = [
      {
        ID: 'notif-new-001',
        Type: 'Placement',
        Message: 'New: Google L5 hiring drive announced',
        Timestamp: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString()
      },
      {
        ID: 'notif-new-002',
        Type: 'Placement',
        Message: 'New: Meta campus drive tomorrow',
        Timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      },
      {
        ID: 'notif-new-003',
        Type: 'Placement',
        Message: 'New: Apple SE role open for freshers',
        Timestamp: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
      }
    ];

    const updatedHeap = new MinHeap(compareNotifications);
    for (const n of baseTop10) updatedHeap.push(n);

    for (const raw of newArrivals) {
      const norm = continuousSvc.processNotification(raw);
      if (!norm) continue;
      if (updatedHeap.size < 10) {
        updatedHeap.push(norm);
      } else {
        const worst = updatedHeap.peek();
        if (compareNotifications(norm, worst) > 0) {
          updatedHeap.pop();
          updatedHeap.push(norm);
        }
      }
    }

    const updatedTop = updatedHeap.toSortedArray().reverse();
    for (let i = 0; i < updatedTop.length; i++) {
      console.log(renderNotification(updatedTop[i], i + 1));
      console.log('');
    }

    logger.info('Application completed successfully');

  } catch (error) {
    logger.error('Application failed', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

main();
