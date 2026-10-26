import React from 'react';
import { BellRing, ShieldAlert, Cpu, Server, X, CheckCircle2, Zap } from 'lucide-react';

interface ClosedAppNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClosedAppNotificationModal: React.FC<ClosedAppNotificationModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#080E1E] border border-[#1E2D54] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#1E2D54] flex items-center justify-between bg-[#0B132B]">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#00E5FF]" />
            <h2 className="text-base font-bold text-[#F0F6FC]">
              Closed-App Android Push Notifications Architecture
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#1E2D54]/50 text-[#8B9CB5] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm text-[#CBD5E1]">
          {/* Why background execution dies on Android */}
          <div className="bg-[#FF2A55]/10 border border-[#FF2A55]/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-[#FF2A55] font-semibold text-xs uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              The Android Battery Constraint: Doze Mode & Swiped-Away State
            </div>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              When an Android user swipes away StormX India from Recents or locks the phone, the Linux OS process is terminated. 
              JavaScript intervals or in-app threads <strong>cannot execute</strong> without violating Google Play background execution limits.
            </p>
          </div>

          {/* The 3-Tier Production Architecture */}
          <div>
            <h3 className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider mb-3">
              Production Architecture Required (100% Free Tier)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Step 1 */}
              <div className="bg-[#0D172E] border border-[#1E2D54] rounded-xl p-3.5 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div className="font-semibold text-xs text-[#F0F6FC]">FCM Push Service</div>
                <p className="text-[11px] text-[#8B9CB5] leading-relaxed">
                  Google Play Services maintains a persistent low-power TCP connection with Firebase Cloud Messaging (FCM). Cost: <strong>₹0 / Free</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#0D172E] border border-[#1E2D54] rounded-xl p-3.5 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#2979FF]/10 text-[#2979FF] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div className="font-semibold text-xs text-[#F0F6FC]">IMD / Weather Cron</div>
                <p className="text-[11px] text-[#8B9CB5] leading-relaxed">
                  A free serverless cron (Cloudflare Worker or GitHub Action) polls IMD RSS & Open-Meteo every 15 min for severe squalls or rain nowcasts.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#0D172E] border border-[#1E2D54] rounded-xl p-3.5 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-[#00E676]/10 text-[#00E676] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div className="font-semibold text-xs text-[#F0F6FC]">Android Channels</div>
                <p className="text-[11px] text-[#8B9CB5] leading-relaxed">
                  FCM wakes up <code className="text-[#00E5FF]">FirebaseMessagingService</code>, which invokes <code className="text-[#00E5FF]">NotificationCompat.Builder</code> on the specific channel.
                </p>
              </div>
            </div>
          </div>

          {/* Android Kotlin Integration Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#8B9CB5]">
              <span>Kotlin Service Implementation (`StormXFirebaseService.kt`)</span>
              <span className="text-[10px] text-[#00E5FF] font-mono">Clean Architecture</span>
            </div>
            <pre className="p-3 bg-[#050914] border border-[#1E2D54] rounded-xl text-[11px] font-mono text-[#A5D6FF] overflow-x-auto leading-relaxed">
{`class StormXFirebaseService : FirebaseMessagingService() {
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        val title = remoteMessage.data["title"] ?: "IMD Weather Alert"
        val body = remoteMessage.data["body"] ?: "Heavy rainfall expected"
        val channelId = remoteMessage.data["channel"] ?: "stormx_severe_alerts"

        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.ic_weather_alert)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        NotificationManagerCompat.from(this).notify(System.currentTimeMillis().toInt(), notification)
    }
}`}
            </pre>
          </div>

          {/* Zero-Budget Cron Trigger Example */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#8B9CB5]">
              <span>Free Serverless Worker (Cloudflare / Node.js)</span>
              <span className="text-[10px] text-[#00E676] font-mono">₹0 / Free Tier</span>
            </div>
            <pre className="p-3 bg-[#050914] border border-[#1E2D54] rounded-xl text-[11px] font-mono text-[#A5D6FF] overflow-x-auto leading-relaxed">
{`// Cloudflare Worker Cron Trigger (Runs every 15 min)
export default {
  async scheduled(event, env) {
    const imdData = await fetch('https://mausam.imd.gov.in/responsive/all_india_warning.php');
    // If high-severity cyclone or cloudburst warning detected:
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: { 'Authorization': \`key=\${env.FCM_SERVER_KEY}\`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: '/topics/weather_india',
        data: { title: 'IMD Red Alert', body: 'Severe squall warning issued', channel: 'stormx_severe_alerts' }
      })
    });
  }
};`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E2D54] bg-[#0B132B] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#00E676]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Prepared in StormX India Codebase</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black text-xs font-bold rounded-xl transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
