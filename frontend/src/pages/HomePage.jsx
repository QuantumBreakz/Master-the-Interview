
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Code, Mic, Cpu, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex flex-col bg-background text-white overflow-x-hidden font-sans selection:bg-primary selection:text-white">

            {/* Hero Section (Restored Original Design) */}
            <div className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden">

                {/* Ambient Background Lights */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                            Master the <br /> Interview.
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        AI-powered technical interviews. <span className="text-white">Real-time feedback.</span> <br />
                        Professional grade environment.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn-apple-primary text-lg px-8 py-4 flex items-center gap-3 group"
                        >
                            Start Practicing
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-all">
                                <Play size={16} fill="currentColor" />
                            </div>
                            <span className="font-medium">Watch Demo</span>
                        </button>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
                >
                    <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </motion.div>
            </div>

            {/* Features Grid (Bento) - Retaining functionality popuation */}
            <section id="features" className="py-20 md:py-32 px-6 relative z-10 bg-black/50 backdrop-blur-3xl border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need.</h2>
                        <p className="text-white/50 max-w-2xl mx-auto">Comprehensive tools designed to simulate real-world interview scenarios.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Large */}
                        <div className="md:col-span-2 bento-card p-10 min-h-[300px] relative overflow-hidden group">
                            <div className="relative z-10 max-w-md">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                                    <Cpu size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Powered by GPT-4</h3>
                                <p className="text-white/60 leading-relaxed">
                                    Our AI engine understands context, nuance, and code logic. It doesn't just check for keywords; it evaluates your problem-solving approach.
                                </p>
                            </div>
                            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                        </div>

                        {/* Card 2: Tall */}
                        <div className="md:row-span-2 bento-card p-10 relative overflow-hidden">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                                <Code size={24} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Live Code Analysis</h3>
                            <p className="text-white/60 mb-8">
                                Real-time syntax checking, optimization suggestions, and complexity analysis as you type.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bento-card p-8">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-6">
                                <Mic size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Natural Voice</h3>
                            <p className="text-white/60 text-sm">
                                Speak naturally. Our speech-to-text models capture every word with 99% accuracy.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="bento-card p-8">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-6">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Global Standards</h3>
                            <p className="text-white/60 text-sm">
                                Questions curated from top tech companies to ensure industry relevance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="Logo" className="w-6 h-6 grayscale opacity-50" />
                        <span className="text-white/40 font-medium">AI Interviewer © 2024</span>
                    </div>
                    <div className="flex gap-8 text-sm text-white/40">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
