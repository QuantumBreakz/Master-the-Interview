
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Code, Mic, Cpu, Zap, Terminal, Activity, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex flex-col bg-background text-white overflow-x-hidden font-sans selection:bg-primary selection:text-white">

            {/* Gradient Mesh Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Main Content Container */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16 md:gap-24">

                {/* Left Column: Text & CTA */}
                <div className="flex-1 text-center lg:text-left">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        theme={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-300 mb-8 backdrop-blur-md"
                    >
                        <Zap size={14} className="fill-blue-300" />
                        <span>AI-Powered Technical Assessment</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
                    >
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Standard</span> for <br />
                        Engineering Talent.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl text-white/60 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                    >
                        Conduct conversational technical interviews driven by GPT-4.
                        Assess coding skills, communication, and problem-solving in real-time.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                    >
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                            Start Interview
                            <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/results')}
                            className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium text-lg text-white w-full sm:w-auto"
                        >
                            View Sample Report
                        </button>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-white/40 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>GPT-4 Engine</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Real-time Audio</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>IDE Integration</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Functional Visual / Demo Card */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="flex-1 w-full max-w-xl lg:max-w-full"
                >
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full opacity-50" />

                        {/* THE APP INTERFACE MOCK */}
                        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">

                            {/* Window Header */}
                            <div className="h-40 bg-[#1e1e1e] border-b border-white/5 p-4 flex flex-col justify-between relative overflow-hidden">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <Cpu size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">AI Interviewer</h3>
                                            <p className="text-xs text-white/50">Session #8492 • Live Analysis</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Waveform Animation Mock */}
                                <div className="absolute right-0 bottom-0 w-32 h-16 opacity-20 flex items-end gap-1 px-4 pb-4">
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [10, 30, 15, 40, 20] }}
                                            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                                            className="w-1 bg-white rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Main Content Split */}
                            <div className="grid grid-cols-5 h-[300px]">
                                {/* Chat Area (Left) */}
                                <div className="col-span-2 border-r border-white/5 p-4 space-y-4 bg-[#0a0a0a]">
                                    <div className="bg-white/5 rounded-lg rounded-tl-none p-3 text-xs text-white/80 border border-white/5">
                                        Can you verify if this text is a palindrome?
                                    </div>
                                    <div className="bg-blue-600/20 rounded-lg rounded-tr-none p-3 text-xs text-blue-100 border border-blue-500/30 ml-auto max-w-[90%]">
                                        Sure, I'll use two pointers.
                                    </div>
                                    <div className="bg-white/5 rounded-lg rounded-tl-none p-3 text-xs text-white/80 border border-white/5">
                                        Walk me through the time complexity.
                                    </div>
                                </div>

                                {/* Code Editor Area (Right) */}
                                <div className="col-span-3 bg-[#1e1e1e] p-4 font-mono text-xs relative">
                                    <div className="flex items-center justify-between text-white/30 mb-2 pb-2 border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Terminal size={12} />
                                            <span>solution.js</span>
                                        </div>
                                        <span className="text-green-500 flex items-center gap-1">
                                            <Activity size={10} /> Live
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p><span className="text-purple-400">function</span> <span className="text-yellow-300">isPalindrome</span>(str) {'{'}</p>
                                        <p className="pl-4"><span className="text-blue-400">let</span> left = <span className="text-orange-300">0</span>;</p>
                                        <p className="pl-4"><span className="text-blue-400">let</span> right = str.length - <span className="text-orange-300">1</span>;</p>
                                        <p className="pl-4">&nbsp;</p>
                                        <p className="pl-4"><span className="text-purple-400">while</span> (left &lt; right) {'{'}</p>
                                        <p className="pl-8"><span className="text-gray-500">// Check characters</span></p>
                                        <p className="pl-8"><span className="text-purple-400">if</span> (str[left] !== str[right])</p>
                                        <p className="pl-12"><span className="text-purple-400">return</span> <span className="text-red-300">false</span>;</p>
                                        <p className="pl-4">{'}'}</p>
                                        <p className="pl-4"><span className="text-purple-400">return</span> <span className="text-green-300">true</span>;</p>
                                        <p>{'}'}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>

            </main>

        </div>
    );
};

export default HomePage;
