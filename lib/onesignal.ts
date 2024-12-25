import OneSignal from 'react-onesignal';

let isInitialized = false;

// Initialize OneSignal
export const initializeOneSignal = async () => {
  if (isInitialized) return;
  
  try {
    const config = {
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
      serviceWorkerPath: '/OneSignalSDKWorker.js',
      notifyButton: {
        enable: false,
      },
      allowLocalhostAsSecureOrigin: true,
      promptOptions: {
        slidedown: {
          prompts: [
            {
              type: "push",
              autoPrompt: false,
              text: {
                actionMessage: "Would you like to receive notifications about new matches?",
                acceptButton: "Allow",
                cancelButton: "Cancel",
              },
            }
          ]
        }
      }
    };

    await OneSignal.init(config);
    isInitialized = true;
    console.log('OneSignal Initialized');
  } catch (error) {
    console.error('Error initializing OneSignal:', error);
    // Don't throw error to prevent app from breaking
  }
};

// Subscribe user to notifications
export const subscribeToNotifications = async (): Promise<boolean> => {
  try {
    if (!isInitialized) {
      await initializeOneSignal();
    }

    // If OneSignal is blocked or failed to initialize, fall back to browser notifications
    if (!isInitialized) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    await OneSignal.User.PushSubscription.optIn();
    const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
    console.log('OneSignal subscription status:', isSubscribed);

    return Boolean(isSubscribed);
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    return false;
  }
};

// Unsubscribe user from notifications
export const unsubscribeFromNotifications = async (): Promise<boolean> => {
  try {
    if (!isInitialized) {
      return true; // If OneSignal isn't initialized, consider it as unsubscribed
    }

    await OneSignal.User.PushSubscription.optOut();
    const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
    console.log('Is still subscribed:', isSubscribed);
    return !isSubscribed;
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
    return true; // Return true to allow the UI to update
  }
};

// Get current subscription status
export const getNotificationStatus = async (): Promise<'granted' | 'denied'> => {
  try {
    if (!isInitialized) {
      const browserPermission = Notification.permission;
      return browserPermission === 'granted' ? 'granted' : 'denied';
    }

    const isPushEnabled = await OneSignal.User.PushSubscription.optedIn;
    console.log('Push enabled:', isPushEnabled);
    return isPushEnabled ? 'granted' : 'denied';
  } catch (error) {
    console.error('Error getting notification status:', error);
    return 'denied';
  }
};

// Set external user ID for targeting
export const setExternalUserId = async (userId: string): Promise<void> => {
  try {
    if (!isInitialized) {
      return; // Skip if OneSignal isn't initialized
    }

    await OneSignal.login(userId);
    console.log('External user ID set:', userId);
  } catch (error) {
    console.error('Error setting external user ID:', error);
  }
}; 