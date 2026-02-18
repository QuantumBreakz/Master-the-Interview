import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
    const navigate = useNavigate();

    return (
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

            {/* Bottom Floating Visual Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
            </motion.div>

        </div>
    );
};

export default HomePage;
