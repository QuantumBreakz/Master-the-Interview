import React, { useEffect, useRef } from 'react';
import { Bot, User, Mic, Send, StopCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import AIAvatar3D from './AIAvatar3D';

const ModernChatInterface = ({
    messages,
    isTyping,
    isListening,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    toggleRecording,
    autoSubmitCountdown,
    transcript
}) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] glass-card border-white/5 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-lg">Interview Session</h2>
                        <p className="text-xs text-text-secondary">AI Technical Interviewer</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-surface rounded-full border border-white/10 text-xs font-mono text-text-secondary">
                    {messages.length} Messages
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4 scrollbar-hide">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={clsx(
                                "flex gap-4 max-w-[85%]",
                                msg.role === 'candidate' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            {/* Avatar */}
                            <div className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg",
                                msg.role === 'candidate' ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"
                            )}>
                                {msg.role === 'candidate' ? <User size={18} /> : <Bot size={18} />}
                            </div>

                            {/* Bubble */}
                            <div className={clsx(
                                "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                                msg.role === 'candidate'
                                    ? "bg-secondary/10 border border-secondary/20 text-white rounded-tr-none"
                                    : "bg-surface border border-white/10 text-text-primary rounded-tl-none"
                            )}>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                <div className="text-[10px] opacity-50 mt-2 text-right">{msg.timestamp}</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4 max-w-[85%]"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                            <Bot size={18} />
                        </div>
                        <div className="bg-surface border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75" />
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Controls & Input */}
            <div className="mt-auto bg-surface/50 backdrop-blur-md border border-white/10 rounded-xl p-4">
                {/* Live Transcript */}
                {isListening && (
                    <div className="mb-3 px-3 py-2 bg-black/20 rounded-lg border border-white/5">
                        <p className="text-xs text-secondary animate-pulse font-mono">
                            <span className="mr-2">● Recording:</span>
                            {transcript || "Listening..."}
                        </p>
                    </div>
                )}

                <div className="flex items-end gap-3">
                    <button
                        onClick={toggleRecording}
                        className={clsx(
                            "p-3 rounded-xl transition-all duration-300 flex-shrink-0 shadow-lg",
                            isListening
                                ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 animate-pulse"
                                : "bg-surface border border-white/10 text-text-secondary hover:text-white hover:bg-white/5"
                        )}
                    >
                        {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
                    </button>

                    <div className="flex-1 relative">
                        <textarea
                            value={inputMessage || transcript}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your answer or use voice..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-10 min-h-[50px] max-h-[120px] focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm resize-none scrollbar-hide"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={(!inputMessage && !transcript) || isListening}
                        className="p-3 rounded-xl bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        {autoSubmitCountdown > 0 ? (
                            <span className="text-xs font-bold">{autoSubmitCountdown}s</span>
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModernChatInterface;
