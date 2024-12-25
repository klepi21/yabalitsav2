import OneSignal from 'react-onesignal';

// Initialize OneSignal
export const initializeOneSignal = async () => {
  try {
    const config: any = {
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
      notifyButton: {
        enable: false,
      },
      allowLocalhostAsSecureOrigin: true,
    };

    // Only add Safari Web ID if it exists
    if (process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID) {
      config.safari_web_id = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID;
    }

    await OneSignal.init(config);
  } catch (error) {
    console.error('Error initializing OneSignal:', error);
  }
};

// Subscribe user to notifications
export const subscribeToNotifications = async () => {
  try {
    // First check if we already have permission
    const currentPermission = await OneSignal.Notifications.permission;
    
    if (!currentPermission) {
      // If no permission, show the prompt
      await OneSignal.Slidedown.promptPush();
      // Check if permission was granted
      const newPermission = await OneSignal.Notifications.permission;
      if (!newPermission) {
        return false;
      }
    }

    // Enable push subscription
    await OneSignal.User.PushSubscription.optIn();
    return true;
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    return false;
  }
};

// Unsubscribe user from notifications
export const unsubscribeFromNotifications = async () => {
  try {
    await OneSignal.User.PushSubscription.optOut();
    return true;
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
    return false;
  }
};

// Get current subscription status
export const getNotificationStatus = async () => {
  try {
    const permission = await OneSignal.Notifications.permission;
    const isPushEnabled = await OneSignal.User.PushSubscription.optedIn;
    return permission && isPushEnabled ? 'granted' : 'denied';
  } catch (error) {
    console.error('Error getting notification status:', error);
    return 'denied';
  }
};

// Set external user ID for targeting
export const setExternalUserId = async (userId: string) => {
  try {
    await OneSignal.login(userId);
  } catch (error) {
    console.error('Error setting external user ID:', error);
  }
}; 