import OneSignal from 'react-onesignal';

let isInitialized = false;

// Initialize OneSignal
export const initializeOneSignal = async () => {
  if (isInitialized) return;
  
  try {
    const config = {
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
      serviceWorkerPath: '/OneSignalSDKWorker.js',
      serviceWorkerParam: { scope: '/push/onesignal/' },
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

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      console.log('Service Worker registration:', registration);
    }
  } catch (error) {
    console.error('Error initializing OneSignal:', error);
    throw error;
  }
};

// Subscribe user to notifications
export const subscribeToNotifications = async (): Promise<boolean> => {
  try {
    if (!isInitialized) {
      await initializeOneSignal();
    }

    // Request browser permission first
    const permission = await Notification.requestPermission();
    console.log('Browser permission:', permission);
    
    if (permission !== 'granted') {
      return false;
    }

    // Then handle OneSignal subscription
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
      await initializeOneSignal();
    }

    await OneSignal.User.PushSubscription.optOut();
    const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
    console.log('Is still subscribed:', isSubscribed);
    return !isSubscribed;
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
    return false;
  }
};

// Get current subscription status
export const getNotificationStatus = async (): Promise<'granted' | 'denied'> => {
  try {
    if (!isInitialized) {
      await initializeOneSignal();
    }

    const browserPermission = Notification.permission;
    const isPushEnabled = await OneSignal.User.PushSubscription.optedIn;
    console.log('Browser permission:', browserPermission, 'Push enabled:', isPushEnabled);
    return browserPermission === 'granted' && isPushEnabled ? 'granted' : 'denied';
  } catch (error) {
    console.error('Error getting notification status:', error);
    return 'denied';
  }
};

// Set external user ID for targeting
export const setExternalUserId = async (userId: string): Promise<void> => {
  try {
    if (!isInitialized) {
      await initializeOneSignal();
    }

    await OneSignal.login(userId);
    console.log('External user ID set:', userId);
  } catch (error) {
    console.error('Error setting external user ID:', error);
  }
}; 