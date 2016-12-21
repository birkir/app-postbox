import PushNotification from 'react-native-push-notification';
import { read } from './utils/storage';
import Store from './store';

function process({ deliveries }) {
  deliveries
  .checkUpdates()
  .then((updates) => {
    updates.forEach((update) => {
      PushNotification.localNotificationSchedule({
        message: update.message,
        date: new Date(Date.now() + (60 * 1000)), // in 60 secs
      });
    });
  });
}

setInterval(async () => {
  process(new Store(await read()));
}, 60 * 60 * 1000);
