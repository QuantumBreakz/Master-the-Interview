import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    ArrowUpRight,
    TrendingUp,
    Play,
    Code2,
    Calendar,
    Activity
} from 'lucide-react';
import config from '../config';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        averageScore: 0,
        totalTime: 0,
        problemsSolved: 0,
        recentSessions: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch sessions from backend
                const response = await fetch(`${config.AI_BACKEND_URL}/api/sessions/list`);
                const data = await response.json();

                if (data.success) {
                    const sessions = data.sessions || [];

                    // Calculate stats
                    const scores = sessions.map(s => s.interviewData?.results?.score || 0).filter(s => s > 0);
                    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                    const totalDuration = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);

                    // Format recent sessions for the list
                    const recent = sessions.slice(0, 5).map(s => ({
                        id: s.sessionId,
                        role: s.role || 'Technical Interview',
                        score: s.interviewData?.results?.score || s.score || 'N/A',
                        date: new Date(s.scheduledStartTime || s.created_at || Date.now()).toLocaleDateString(),
                        status: s.status
                    }));

                    setStats({
                        averageScore: avgScore,
                        totalTime: Math.round(totalDuration / 60), // minutes -> hours approx
                        problemsSolved: sessions.length, // approximation
                        recentSessions: recent
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-7xl animate-fade-in relative z-20">
            {/* Header */}
            <div className="mb-12 flex items-end justify-between">
                <div>
                    <h1 className="text-5xl font-bold mb-3 text-gradient-apple inline-block">Dashboard</h1>
                    <p className="text-white/40 text-lg">Your interview performance overview.</p>
                </div>
                <button
                    onClick={() => navigate('/interview')}
                    className="btn-apple-primary flex items-center gap-2"
                >
                    <Play size={18} fill="currentColor" />
                    New Session
                </button>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[180px]">

                {/* 1. Main Stats - Large Card (2x2) */}
                <div className="md:col-span-2 md:row-span-2 bento-card flex flex-col justify-between group">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/5 rounded-2xl">
                            <Activity className="text-accent-blue" size={32} />
                        </div>
                        <span className="px-3 py-1 bg-accent-green/10 text-accent-green text-sm font-medium rounded-full border border-accent-green/20">
                            Live Metrics
                        </span>
                    </div>
                    <div>
                        <div className="text-6xl font-bold text-white mb-2 tracking-tighter">
                            {loading ? "..." : `${stats.averageScore}%`}
                        </div>
                        <div className="text-white/40">Average Performance Score</div>
                    </div>
                    {/* Decorative BG */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[80px] -z-10 group-hover:bg-accent-blue/10 transition-colors" />
                </div>

                {/* 2. Quick Start / Next Interview (1x2) */}
                <div className="md:col-span-1 md:row-span-2 bento-card bg-[#1c1c1e] flex flex-col justify-between relative overflow-hidden group">
                    {/* Gradient BG */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-purple/20 to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />

                    <div className="relative z-10">
                        <div className="p-3 bg-white/10 w-fit rounded-2xl mb-4 backdrop-blur-md">
                            <Calendar className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-1">Upcoming</h3>
                        <p className="text-white/50 text-sm">Target: Senior Engineer</p>
                    </div>

                    <div className="relative z-10">
                        <div className="text-sm text-white/60 mb-4">Practice your system design skills.</div>
                        <button onClick={() => navigate('/interview')} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors border border-white/5">
                            Start Session
                        </button>
                    </div>
                </div>

                {/* 3. Recent Activity (1x2) - List */}
                <div className="md:col-span-1 md:row-span-2 bento-card p-0 flex flex-col">
                    <div className="p-6 pb-2">
                        <h3 className="font-bold text-lg">History</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-hide">
                        {loading ? (
                            <div className="text-center text-white/30 py-4">Loading...</div>
                        ) : stats.recentSessions.length === 0 ? (
                            <div className="text-center text-white/30 py-4">No sessions yet.</div>
                        ) : (
                            stats.recentSessions.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => navigate(`/results/${item.id}`)}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group/item"
                                >
                                    <div>
                                        <div className="font-medium text-sm truncate max-w-[100px]">{item.role}</div>
                                        <div className="text-xs text-white/30">{item.date}</div>
                                    </div>
                                    <div className={`text-sm font-bold ${typeof item.score === 'number' && item.score >= 70 ? 'text-accent-green' : 'text-accent-orange'}`}>
                                        {item.score}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 4. Total Time (1x1) */}
                <div className="bento-card flex flex-col justify-center items-center text-center group">
                    <div className="mb-2 text-white/40 group-hover:text-amber-400 transition-colors">
                        <Clock size={32} />
                    </div>
                    <div className="text-3xl font-bold">{formatTime(stats.totalTime)}</div>
                    <div className="text-xs text-white/30 uppercase tracking-widest mt-1">Practice Time</div>
                </div>

                {/* 5. Coding Stats (1x1) */}
                <div className="bento-card flex flex-col justify-center items-center text-center group">
                    <div className="mb-2 text-white/40 group-hover:text-cyan-400 transition-colors">
                        <Code2 size={32} />
                    </div>
                    <div className="text-3xl font-bold">{stats.problemsSolved}</div>
                    <div className="text-xs text-white/30 uppercase tracking-widest mt-1">Sessions</div>
                </div>

                {/* 6. Decoration / Link (2x1) */}
                <div className="md:col-span-2 bento-card flex items-center justify-between group cursor-pointer" onClick={() => navigate('/results')}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-orange to-accent-red flex items-center justify-center">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-lg">View Detailed Analytics</div>
                            <div className="text-white/40 text-sm">Deep dive into your strengths & weaknesses</div>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowUpRight size={20} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;
