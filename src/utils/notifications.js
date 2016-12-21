import PushNotification from 'react-native-push-notification';
import { Worker } from 'react-native-workers';

const worker = new Worker('src/worker.js');

worker.onmessage = (message) => {
  console.log('Got worker msg: %o', message);
};

PushNotification.configure({
  onRegister(token) {
    console.log('Notifcation token: %o', token);
  },

  onNotification(notification) {
    console.log('Notification: %o', notification);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: true,
});

export default {};
