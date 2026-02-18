import React from 'react';
import { Video, Mic, MicOff, Camera, CameraOff, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import AIAvatar3D from './AIAvatar3D';
import VideoMonitor from './VideoMonitor';

const ModernSidebar = ({
    isTyping,
    isSpeaking,
    currentStream,
    isVideoEnabled,
    isAudioEnabled,
    voiceEnabled,
    toggleVideo,
    toggleAudio,
    setVoiceEnabled,
    interviewDuration
}) => {

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6 h-full overflow-y-auto pr-2 scrollbar-hide">

            {/* Timer Card */}
            <div className="glass-card p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">Duration</span>
                <span className="font-mono text-xl font-bold text-primary animate-pulse">
                    {formatTime(interviewDuration)}
                </span>
            </div>

            {/* AI Interviewer Feed */}
            <div className="glass-card p-0 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 pointer-events-none" />

                <div className="p-4 absolute top-0 left-0 z-20 w-full flex justify-between items-start">
                    <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-md border border-white/10 flex items-center gap-2">
                        <div className={clsx("w-2 h-2 rounded-full", isSpeaking ? "bg-accent animate-pulse" : "bg-primary")} />
                        <span className="text-xs font-medium text-white">AI Interviewer</span>
                    </div>
                    {isTyping && (
                        <div className="px-2 py-1 bg-primary/20 backdrop-blur-md rounded-md border border-primary/20 text-xs text-primary font-medium">
                            Thinking...
                        </div>
                    )}
                </div>

                <div className="aspect-video bg-gradient-to-br from-indigo-900 to-black relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full relative">
                            {/* Placeholder for 3D Avatar or Image */}
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1675557009875-436f52c4224c?q=80&w=2540&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center relative">
                                    {isSpeaking && (
                                        <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping opacity-20" />
                                    )}
                                    <AIAvatar3D className="w-24 h-24 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Controls */}
                <div className="absolute bottom-4 right-4 z-20">
                    <button
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white border border-white/10 transition-colors"
                        title={voiceEnabled ? "Mute AI" : "Unmute AI"}
                    >
                        {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                </div>
            </div>

            {/* Candidate Feed */}
            <div className="glass-card p-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 pointer-events-none" />

                <div className="p-4 absolute top-0 left-0 z-20 w-full flex justify-between items-start">
                    <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-md border border-white/10 flex items-center gap-2">
                        <div className={clsx("w-2 h-2 rounded-full", isVideoEnabled ? "bg-red-500 animate-pulse" : "bg-gray-500")} />
                        <span className="text-xs font-medium text-white">You</span>
                    </div>
                </div>

                <div className="aspect-video bg-black relative flex items-center justify-center">
                    {isVideoEnabled && currentStream ? (
                        <VideoMonitor stream={currentStream} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-text-muted">
                            <Video size={32} />
                            <span className="text-sm">Camera Off</span>
                        </div>
                    )}
                </div>

                {/* Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex justify-center gap-3">
                    <button
                        onClick={toggleVideo}
                        className={clsx(
                            "p-3 rounded-full border transition-all",
                            isVideoEnabled
                                ? "bg-white/10 border-white/10 text-white hover:bg-white/20"
                                : "bg-red-500/20 border-red-500/50 text-red-500 hover:bg-red-500/30"
                        )}
                    >
                        {isVideoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
                    </button>
                    <button
                        onClick={toggleAudio}
                        className={clsx(
                            "p-3 rounded-full border transition-all",
                            isAudioEnabled
                                ? "bg-white/10 border-white/10 text-white hover:bg-white/20"
                                : "bg-red-500/20 border-red-500/50 text-red-500 hover:bg-red-500/30"
                        )}
                    >
                        {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ModernSidebar;
