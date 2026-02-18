import React from 'react';
import { User, Bell, Shield, Moon, Monitor, Mic } from 'lucide-react';

const SettingsPage = () => {
    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl animate-fade-in">
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-2">Settings</h1>
                <p className="text-white/50">Manage your preferences and account</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Navigation (Visual Only for now) */}
                <div className="md:col-span-1 space-y-2">
                    <SettingNavIcon icon={User} label="Profile" active />
                    <SettingNavIcon icon={Bell} label="Notifications" />
                    <SettingNavIcon icon={Shield} label="Security" />
                    <SettingNavIcon icon={Monitor} label="Appearance" />
                </div>

                {/* Main Settings Area - Bento Card */}
                <div className="md:col-span-2 bento-card">
                    <h2 className="text-xl font-bold mb-6">Profile Settings</h2>

                    <div className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent-blue to-accent-purple flex items-center justify-center text-2xl font-bold">
                                AA
                            </div>
                            <div>
                                <button className="btn-apple-secondary text-sm py-2 px-4 mb-2">Change Avatar</button>
                                <p className="text-xs text-white/30">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60">First Name</label>
                                <input type="text" defaultValue="Ali" className="mac-input w-full" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60">Last Name</label>
                                <input type="text" defaultValue="Ahmed" className="mac-input w-full" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-white/60">Email Address</label>
                                <input type="email" defaultValue="ali@example.com" className="mac-input w-full" />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                            <button className="btn-apple-secondary">Cancel</button>
                            <button className="btn-apple-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingNavIcon = ({ icon: Icon, label, active }) => (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
            ? 'bg-white text-black font-medium'
            : 'text-white/60 hover:bg-white/5 hover:text-white'
        }`}>
        <Icon size={18} />
        {label}
    </button>
);

export default SettingsPage;
