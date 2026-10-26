export interface AndroidNotificationChannel {
  id: string;
  name: string;
  description: string;
  importance: 'HIGH' | 'DEFAULT' | 'LOW';
  vibration: boolean;
  sound: boolean;
  badge: boolean;
}

export const ANDROID_NOTIFICATION_CHANNELS: AndroidNotificationChannel[] = [
  {
    id: 'stormx_severe_alerts',
    name: 'IMD Severe Weather & Cyclone Warnings',
    description: 'High-priority notifications for Red & Orange level IMD alerts, squalls, and cloudbursts.',
    importance: 'HIGH',
    vibration: true,
    sound: true,
    badge: true
  },
  {
    id: 'stormx_daily_forecast',
    name: 'Daily Morning Weather Briefing',
    description: 'Daily morning summary with high/low temperatures, precipitation outlook and AQI.',
    importance: 'DEFAULT',
    vibration: false,
    sound: true,
    badge: false
  },
  {
    id: 'stormx_rain_nowcast',
    name: 'Rain & Precipitation Nowcasts',
    description: 'Predictive alerts sent when radar detects rain probability exceeding 70% in your sector.',
    importance: 'HIGH',
    vibration: true,
    sound: true,
    badge: true
  }
];

export interface SimulatedAndroidNotification {
  id: string;
  channelId: string;
  title: string;
  body: string;
  timestamp: string;
  smallIcon: string;
  priority: 'high' | 'normal';
}

/**
 * Request notification permission safely supporting both Android Web View and standard browsers
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Notification permission request error:', err);
    return 'denied';
  }
}

/**
 * Post a notification using the browser Web Notification API and haptics if supported
 */
export function dispatchNotification(title: string, body: string, tag: string = 'stormx-alert'): boolean {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    // Android haptic vibration pattern: 200ms pulse, 100ms pause, 200ms pulse
    try {
      navigator.vibrate([200, 100, 200]);
    } catch {
      // Haptic vibrate ignored if user has not interacted
    }
  }

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const options: NotificationOptions = {
        body,
        icon: '/favicon.ico',
        tag,
        badge: '/favicon.ico'
      };
      new Notification(title, options);
      return true;
    } catch (e) {
      console.warn('Browser system notification dispatch error:', e);
    }
  }
  return false;
}
