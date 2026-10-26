import React, { useState } from 'react';
import { Download, Copy, Check, FileCode, FolderArchive, Terminal, Sparkles, X, AlertCircle, Loader2 } from 'lucide-react';
import { ANDROID_PROJECT_FILES, generateAndroidProjectZip } from '../services/androidExportService';

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'guide'>('guide');

  if (!isOpen) return null;

  const currentFile = ANDROID_PROJECT_FILES[selectedFileIndex];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const blob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stormx-india-android-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating ZIP archive:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#080E1E] border border-[#1E2D54] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#1E2D54] flex items-center justify-between bg-[#0B132B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#F0F6FC]">
                StormX India - Android Studio Project & Free APK Builder
              </h2>
              <p className="text-[11px] text-[#8B9CB5]">
                Kotlin 2.0 • Jetpack Compose • Material 3 • Zero Budget & No PC Required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#1E2D54]/50 text-[#8B9CB5] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout - Integrity Check */}
        <div className="px-4 py-2.5 bg-[#0D172E] border-b border-[#1E2D54] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-[#00E5FF]">
            <Sparkles className="w-4 h-4 text-[#00E5FF] animate-pulse" />
            <span className="font-semibold">Source Code Tree Ready:</span>
            <span className="text-[#CBD5E1]">10 clean architecture files</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === 'guide'
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-[#8B9CB5] hover:text-white'
              }`}
            >
              How to Build APK (No PC)
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === 'files'
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-[#8B9CB5] hover:text-white'
              }`}
            >
              Browse Kotlin Files
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'guide' ? (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm flex-1">
            {/* Honest build status notice */}
            <div className="p-4 rounded-xl bg-[#2979FF]/10 border border-[#2979FF]/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#2979FF] shrink-0 mt-0.5" />
              <div className="text-xs text-[#CBD5E1] space-y-1">
                <div className="font-bold text-[#F0F6FC]">Honest APK Generation Notice</div>
                <div>
                  The APK binary is not pre-packaged because it requires Gradle compilation with the Android SDK. 
                  Below are the exact steps to compile and install your <code className="text-[#00E5FF]">app-debug.apk</code> for free directly on your Android phone without needing a computer.
                </div>
              </div>
            </div>

            {/* Step-by-Step GitHub Actions Phone Flow */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center text-[11px]">A</span>
                  Recommended: 100% Free Cloud Build via GitHub Actions (On Phone)
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#00E676]/15 text-[#00E676] font-semibold">
                  Zero Budget • ~3 Minutes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#0D172E] border border-[#1E2D54] rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-bold text-[#F0F6FC]">1. Download Project ZIP</div>
                  <p className="text-[11px] text-[#8B9CB5] leading-relaxed">
                    Tap the <strong>"Download Android Project (.zip)"</strong> button below. It bundles the complete Gradle & Compose source tree.
                  </p>
                </div>

                <div className="bg-[#0D172E] border border-[#1E2D54] rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-bold text-[#F0F6FC]">2. Create Free GitHub Repo</div>
                  <p className="text-[11px] text-[#8B9CB5] leading-relaxed">
                    Open <span className="text-[#00E5FF]">github.com</span> on your phone Chrome browser. Tap <strong>New Repo</strong> & upload the extracted files.
                  </p>
                </div>

                <div className="bg-[#0D172E] border border-[#1E2D54] rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-bold text-[#F0F6FC]">3. Download & Install APK</div>
                  <p className="text-[11px] text-[#8B9CB5] leading-relaxed">
                    The included <code className="text-[#00E5FF]">build-apk.yml</code> builds the APK. Tap <strong>Actions -&gt; Artifacts -&gt; app-debug.apk</strong> to install!
                  </p>
                </div>
              </div>
            </div>

            {/* Option B: Termux directly on phone */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center text-[11px]">B</span>
                Alternative: On-Device Compilation with Termux (Direct on Android)
              </h3>

              <div className="p-3 bg-[#050914] border border-[#1E2D54] rounded-xl text-xs font-mono text-[#A5D6FF] space-y-1 overflow-x-auto">
                <div className="text-[#5A6D88]"># Run directly inside Termux on your phone:</div>
                <div>pkg update && pkg install openjdk-17 git gradle</div>
                <div>git clone &lt;your-repo&gt; && cd stormx-india</div>
                <div>gradle assembleDebug</div>
                <div className="text-[#00E676]"># Your APK is generated at: app/build/outputs/apk/debug/app-debug.apk</div>
                <div>termux-open app/build/outputs/apk/debug/app-debug.apk</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* File List sidebar */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#1E2D54] bg-[#0B132B]/60 p-2 overflow-y-auto max-h-40 md:max-h-full">
              <div className="text-[10px] font-bold text-[#5A6D88] uppercase tracking-wider px-2 py-1">
                Project Files
              </div>
              {ANDROID_PROJECT_FILES.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono flex items-center justify-between transition ${
                    selectedFileIndex === idx
                      ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold'
                      : 'text-[#8B9CB5] hover:bg-[#132247]/50 hover:text-white'
                  }`}
                >
                  <span className="truncate">{file.path.split('/').pop()}</span>
                  <span className="text-[9px] uppercase px-1 rounded bg-[#1E2D54] text-[#8B9CB5]">{file.category.split('-')[0]}</span>
                </button>
              ))}
            </div>

            {/* Code preview & copy */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#050914]">
              <div className="p-3 border-b border-[#1E2D54] flex items-center justify-between bg-[#080E1E]">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#00E5FF]" />
                  <span className="text-xs font-mono text-[#F0F6FC]">{currentFile.path}</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1E2D54]/50 hover:bg-[#1E2D54] text-xs text-[#CBD5E1] transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00E676]" />
                      <span className="text-[#00E676]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-[#A5D6FF] leading-relaxed select-text">
                {currentFile.content}
              </pre>
            </div>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="p-4 border-t border-[#1E2D54] bg-[#0B132B] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#8B9CB5]">
            Everything is configured for Kotlin 2.0 & Android 15 (API 35).
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#2979FF] hover:opacity-90 text-black font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.4)] transition disabled:opacity-50"
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Packaging Project...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Android Project (.zip)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
