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

    // Only add Safari Web ID if it exists
    if (process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID) {
      config.safari_web_id = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID;
    }

    await OneSignal.init(config);

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      console.log('Service Worker registration:', registration);
    }
  } catch (error) {
    console.error('Error initializing OneSignal:', error);
  }
};

// Subscribe user to notifications
export const subscribeToNotifications = async (): Promise<boolean> => {
  try {
    // First check if we already have permission
    const currentPermission = await OneSignal.Notifications.permission;
    console.log('Current permission:', currentPermission);
    
    if (!currentPermission) {
      // If no permission, show the prompt
      const result = await OneSignal.Slidedown.promptPush();
      console.log('Prompt result:', result);
      
      // Check if permission was granted
      const newPermission = await OneSignal.Notifications.permission;
      console.log('New permission:', newPermission);
      
      if (!newPermission) {
        return false;
      }
    }

    // Enable push subscription
    await OneSignal.User.PushSubscription.optIn();
    const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
    console.log('Is subscribed:', isSubscribed);
    
    // Double check browser permission
    const browserPermission = await OneSignal.Notifications.permission;
    console.log('Final browser permission:', browserPermission);

    return Boolean(isSubscribed && browserPermission);
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    return false;
  }
};

// Unsubscribe user from notifications
export const unsubscribeFromNotifications = async (): Promise<boolean> => {
  try {
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
    const permission = await OneSignal.Notifications.permission;
    const isPushEnabled = await OneSignal.User.PushSubscription.optedIn;
    console.log('Permission:', permission, 'Push enabled:', isPushEnabled);
    return permission && isPushEnabled ? 'granted' : 'denied';
  } catch (error) {
    console.error('Error getting notification status:', error);
    return 'denied';
  }
};

// Set external user ID for targeting
export const setExternalUserId = async (userId: string): Promise<void> => {
  try {
    await OneSignal.login(userId);
    console.log('External user ID set:', userId);
  } catch (error) {
    console.error('Error setting external user ID:', error);
  }
}; 