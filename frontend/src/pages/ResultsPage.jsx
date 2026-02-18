import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Share2,
    Download,
    MessageSquare,
    Code2,
    ChevronDown,
    ChevronUp,
    Sparkles,
    CheckCircle2,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import config from '../config';

const ResultsPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [expandedTranscript, setExpandedTranscript] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!sessionId) {
                setLoading(false);
                setError("No session ID provided");
                return;
            }
            try {
                const response = await fetch(`${config.AI_BACKEND_URL}/api/sessions/${sessionId}/results`);
                const result = await response.json();

                if (result.success) {
                    setData(result.session);
                } else {
                    setError(result.error || "Failed to load results");
                }
            } catch (err) {
                console.error("Error fetching results:", err);
                setError("Network error. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Unable to load report</h2>
                <p className="text-white/50 mb-6">{error || "Session not found"}</p>
                <button onClick={() => navigate('/dashboard')} className="btn-apple-secondary">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    // Safely extract scores/transcript from the nested interviewData
    const interviewData = data.interviewData || {};
    const results = interviewData.results || {};
    const scores = results.scores || {}; // technical, communication, problemSolving
    const analysis = results.feedback || "No detailed analysis available yet.";
    const conversation = interviewData.conversationHistory || [];

    // Calculate overall if missing
    const overallScore = results.score || Math.round((
        (scores.technical || 0) + (scores.communication || 0) + (scores.problemSolving || 0)
    ) / 3) || 0;

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl animate-fade-in">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={16} />
                Back to Dashboard
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-accent-green/10 text-accent-green text-xs font-bold uppercase tracking-wider rounded-full border border-accent-green/20 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            {data.status || 'Completed'}
                        </span>
                        <span className="text-white/40 text-sm">{new Date(data.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">{data.role || "Technical Interview"}</h1>
                    <p className="text-white/50 text-lg">Analysis for <span className="text-white">{data.candidateName || "Candidate"}</span></p>
                </div>

                <div className="flex gap-3">
                    <button className="btn-apple-secondary flex items-center gap-2">
                        <Share2 size={16} />
                        Share
                    </button>
                    <button className="btn-apple-primary flex items-center gap-2">
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Overall Score - Large Card */}
                <div className="md:col-span-1 bento-card flex flex-col items-center justify-center text-center py-10">
                    <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                        {/* Animated Ring */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                            <circle cx="80" cy="80" r="70" stroke="url(#gradient)" strokeWidth="8" fill="transparent" strokeDasharray={439.8} strokeDashoffset={439.8 - (439.8 * overallScore) / 100} className="text-white" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#2997FF" />
                                    <stop offset="100%" stopColor="#BF5AF2" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-5xl font-bold tracking-tighter">{overallScore}</span>
                            <span className="text-xs text-white/40 uppercase tracking-widest mt-1">Overall</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full px-2">
                        <MiniScore label="Tech" score={scores.technical || 0} color="text-accent-blue" />
                        <MiniScore label="Comm" score={scores.communication || 0} color="text-accent-purple" />
                        <MiniScore label="Logic" score={scores.problemSolving || 0} color="text-accent-orange" />
                    </div>
                </div>

                {/* 2. AI Analysis - Wide Card */}
                <div className="md:col-span-2 bento-card relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-20 text-accent-indigo">
                        <Sparkles size={120} />
                    </div>

                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-accent-indigo" />
                        AI Analysis
                    </h3>

                    <div className="prose prose-invert max-w-none text-white/70 leading-relaxed text-lg font-light">
                        <p>{analysis}</p>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm">
                            <span className="text-white/40 block text-xs mb-1">Strongest Skill</span>
                            <span className="text-white font-medium">React State Management</span>
                        </div>
                        <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm">
                            <span className="text-white/40 block text-xs mb-1">Area to Improve</span>
                            <span className="text-white font-medium">System Design Trade-offs</span>
                        </div>
                    </div>
                </div>

                {/* 3. Transcript - Expandable */}
                <div className="md:col-span-3 bento-card p-0">
                    <div
                        className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => setExpandedTranscript(!expandedTranscript)}
                    >
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <MessageSquare size={20} className="text-accent-blue" />
                            Session Transcript
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-white/40">
                            {conversation.length} Messages
                            {expandedTranscript ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>

                    <motion.div
                        initial={false}
                        animate={{ height: expandedTranscript ? 'auto' : 0 }}
                        className="overflow-hidden border-t border-white/5"
                    >
                        <div className="p-6 space-y-6 bg-black/40">
                            {conversation.map((msg, idx) => (
                                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                        ? 'bg-accent-blue/10 text-white border border-accent-blue/20 rounded-tr-none'
                                        : 'bg-surface-highlight border border-white/5 text-white/80 rounded-tl-none'
                                        }`}>
                                        <div className="text-[10px] font-bold mb-1 opacity-50 uppercase tracking-wider">
                                            {msg.role === 'user' ? 'Candidate' : 'AI Interviewer'}
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

const MiniScore = ({ label, score, color }) => (
    <div className="flex flex-col items-center p-2 bg-white/5 rounded-xl border border-white/5">
        <span className={`text-lg font-bold ${color}`}>{score}</span>
        <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
    </div>
);

export default ResultsPage;
