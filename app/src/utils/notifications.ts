"use client";

import { LocalNotifications } from "@capacitor/local-notifications";

export const scheduleNotification = async (title, body, frequency, time) => {
  try {
    const notification = {
      title: title,
      body: body,
      id: 0,
      schedule: {},
    };

    if (frequency == "once") notification.schedule = { at: time };
    else
      notification.schedule = {
        every: frequency,
        on: { hour: time.getHours(), minute: time.getMinutes() },
      };

    const res = await LocalNotifications.schedule({
      notifications: [notification],
    });

    console.log("notification scheduled!", res);
  } catch (err) {
    console.error("Notification could not be scheduled", err);
  }
};
