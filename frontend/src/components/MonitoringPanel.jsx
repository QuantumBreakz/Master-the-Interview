import React, { useEffect, useRef, useState } from 'react';
import VideoMonitor from './VideoMonitor';
import ObjectDetector from './ObjectDetector';
import FaceDetector from './FaceDetector';
import { Camera, Eye, User } from 'lucide-react';

// MonitoringPanel coordinates the detectors
export default function MonitoringPanel({ useSharedStream = true, externalStream = null }) {
  const [stream, setStream] = useState(externalStream);
  const [sharedEnabled, setSharedEnabled] = useState(useSharedStream && !externalStream);
  const localStreamRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const startSharedStream = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) {
          s.getTracks().forEach(t => t.stop());
          return;
        }
        localStreamRef.current = s;
        setStream(s);
      } catch (err) {
        console.error('Failed to get user media for MonitoringPanel:', err);
      }
    };

    if (externalStream) {
      setStream(externalStream);
    } else if (sharedEnabled) {
      startSharedStream();
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      setStream(null);
    }

    return () => {
      mounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [sharedEnabled, externalStream]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input type="checkbox" checked={sharedEnabled} onChange={(e) => setSharedEnabled(e.target.checked)} className="sr-only" />
            <div className={`w-10 h-6 rounded-full transition-colors ${sharedEnabled ? 'bg-primary' : 'bg-white/20'}`}></div>
            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${sharedEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
          <span className="text-text-secondary font-medium">Use shared camera/audio stream</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VideoMonitor */}
        <div className="glass-card p-0 overflow-hidden relative min-h-[400px]">
          <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
            <Camera size={16} className="text-primary" />
            <span className="text-xs font-medium text-white">Live Monitor</span>
          </div>
          <div className="w-full h-full min-h-[400px]">
            <VideoMonitor stream={stream} />
          </div>
        </div>

        {/* Standalone detectors */}
        <div className="space-y-4">
          <div className="glass-card p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Eye size={18} className="text-secondary" />
              Object Detector
            </h4>
            <div className="bg-black/20 rounded-lg p-2 min-h-[200px]">
              <ObjectDetector />
            </div>
          </div>

          <div className="glass-card p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User size={18} className="text-accent" />
              Face Detector
            </h4>
            <div className="bg-black/20 rounded-lg p-2 min-h-[200px]">
              <FaceDetector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

