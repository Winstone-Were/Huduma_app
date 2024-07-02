import { Expo } from "expo-server-sdk";

const sendPushNotification = async (targetExpoPushToken, message) => {
  const expo = new Expo();
  const messages = [{
    to: targetExpoPushToken,
    sound: "default",
    title: "Huduma app", // Default title for all notifications
    body: message,
    data: { message }
  }];
  
  const chunks = expo.chunkPushNotifications(messages);

  const sendChunks = async () => {
    for (const chunk of chunks) {
      try {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  };

  sendChunks();
};

export default {
  sendPushNotification
};
