import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    Video,
    BarChart2,
    Settings,
    LogOut,
    Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
        { icon: Video, label: 'Interview', path: '/interview' },
        { icon: BarChart2, label: 'Results', path: '/results' }, // Placeholder default
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-background text-white selection:bg-white/20 relative overflow-x-hidden font-sans">
            {/* Background Ambient Mesh (Subtle) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[150px] opacity-20" />
                <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[150px] opacity-20" />
            </div>

            {/* Main Content */}
            <main className="relative z-10 min-h-screen pb-32">
                {children}
            </main>

            {/* Floating Dock Navigation */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-auto">
                <div className="glass-dock flex items-center gap-2 p-2 border border-white/10 shadow-2xl shadow-black/50 bg-black/60 backdrop-blur-2xl rounded-full">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={clsx(
                                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-20",
                                        isActive
                                            ? "bg-white text-black shadow-lg shadow-white/20"
                                            : "text-white/60 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </motion.div>

                                {/* Tooltip */}
                                <span className={clsx(
                                    "absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-[#1c1c1e] border border-white/10 rounded-lg text-xs font-medium text-white opacity-0 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl",
                                    "group-hover:opacity-100"
                                )}>
                                    {item.label}
                                </span>

                                {/* Active dot indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="dock-dot"
                                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-50"
                                    />
                                )}
                            </Link>
                        );
                    })}

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    <button
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-white/10 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Layout;
