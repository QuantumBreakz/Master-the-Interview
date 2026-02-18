
import React, { useState } from 'react';
import { User, Bell, Shield, Monitor, Save, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileSettings />;
            case 'notifications': return <NotificationSettings />;
            case 'security': return <SecuritySettings />;
            case 'appearance': return <AppearanceSettings />;
            default: return <ProfileSettings />;
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl animate-fade-in min-h-[80vh]">
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-2 text-white">Settings</h1>
                <p className="text-white/50">Manage your account preferences and app settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-2">
                    <SettingNavIcon
                        icon={User}
                        label="Profile"
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />
                    <SettingNavIcon
                        icon={Bell}
                        label="Notifications"
                        active={activeTab === 'notifications'}
                        onClick={() => setActiveTab('notifications')}
                    />
                    <SettingNavIcon
                        icon={Shield}
                        label="Security"
                        active={activeTab === 'security'}
                        onClick={() => setActiveTab('security')}
                    />
                    <SettingNavIcon
                        icon={Monitor}
                        label="Appearance"
                        active={activeTab === 'appearance'}
                        onClick={() => setActiveTab('appearance')}
                    />
                </div>

                {/* Main Settings Area */}
                <div className="md:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bento-card p-8 min-h-[500px]"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

/* --- Sub-Components --- */

const ProfileSettings = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-bold text-white mb-1">Profile Information</h2>
            <p className="text-sm text-white/50">Update your photo and personal details.</p>
        </div>

        {/* Avatar Upload */}
        <div className="flex items-center gap-6 pb-6 border-b border-white/5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-purple-500/20">
                AA
            </div>
            <div>
                <button className="btn-apple-secondary text-sm py-2 px-4 mb-2 bg-white/10 hover:bg-white/20 border-white/10">Change Avatar</button>
                <p className="text-xs text-white/30">JPG, GIF or PNG. Max size of 2MB</p>
            </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">First Name</label>
                <input type="text" defaultValue="Ali" className="mac-input w-full" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Last Name</label>
                <input type="text" defaultValue="Ahmed" className="mac-input w-full" />
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-white/70">Email Address</label>
                <input type="email" defaultValue="ali@example.com" className="mac-input w-full" />
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-white/70">Bio</label>
                <textarea rows="3" className="mac-input w-full" placeholder="Tell us a little about yourself..." defaultValue="Senior Software Engineer passionate about AI and scalable systems." />
            </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
            <button className="btn-apple-secondary bg-transparent border-white/10 hover:bg-white/5">Cancel</button>
            <button className="btn-apple-primary flex items-center gap-2">
                <Save size={18} />
                Save Changes
            </button>
        </div>
    </div>
);

const NotificationSettings = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-bold text-white mb-1">Notifications</h2>
            <p className="text-sm text-white/50">Choose what we contact you about.</p>
        </div>

        <div className="space-y-6">
            <ToggleOption label="Interview Reminders" desc="Get notified 1 hour before scheduled sessions" defaultChecked />
            <ToggleOption label="Analysis Reports" desc="Email me when my interview results are ready" defaultChecked />
            <ToggleOption label="New Features" desc="Occasional updates about new platform improvements" />
            <ToggleOption label="Marketing" desc="Receive offers and promotions" />
        </div>
    </div>
);

const SecuritySettings = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-bold text-white mb-1">Security</h2>
            <p className="text-sm text-white/50">Keep your account secure.</p>
        </div>

        <div className="space-y-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h3 className="font-bold text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                    <input type="password" placeholder="Current Password" className="mac-input w-full" />
                    <input type="password" placeholder="New Password" className="mac-input w-full" />
                    <button className="btn-apple-primary w-full">Update Password</button>
                </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                    <h3 className="font-bold text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-white/50">Add an extra layer of security to your account</p>
                </div>
                <button className="btn-apple-secondary text-xs">Enable 2FA</button>
            </div>
        </div>
    </div>
);

const AppearanceSettings = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-bold text-white mb-1">Appearance</h2>
            <p className="text-sm text-white/50">Customize your interface experience.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border-2 border-primary bg-white/5 cursor-pointer relative overflow-hidden">
                <div className="absolute top-2 right-2 text-primary"><Check size={20} /></div>
                <div className="h-20 bg-[#0a0a0a] rounded-lg mb-3 border border-white/10" />
                <p className="font-bold text-white">Dark Mode</p>
                <p className="text-xs text-white/50">Default</p>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 cursor-not-allowed opacity-50 relative overflow-hidden grayscale">
                <div className="h-20 bg-white rounded-lg mb-3 border border-black/10" />
                <p className="font-bold text-white">Light Mode</p>
                <p className="text-xs text-white/50">Coming Soon</p>
            </div>
        </div>

        <div className="space-y-4 pt-6">
            <ToggleOption label="Reduce Motion" desc="Minimize animations for a simpler experience" />
            <ToggleOption label="High Contrast" desc="Increase contrast for better visibility" />
        </div>
    </div>
);

const ToggleOption = ({ label, desc, defaultChecked }) => {
    const [checked, setChecked] = useState(defaultChecked || false);
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <p className="font-medium text-white">{label}</p>
                <p className="text-sm text-white/40">{desc}</p>
            </div>
            <button onClick={() => setChecked(!checked)} className={`text-2xl transition-colors ${checked ? 'text-primary' : 'text-white/20'}`}>
                {checked ? <ToggleRight size={32} fill="currentColor" /> : <ToggleLeft size={32} />}
            </button>
        </div>
    );
}

const SettingNavIcon = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
            ? 'bg-white text-black font-medium shadow-lg scale-[1.02]'
            : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}>
        <Icon size={18} />
        {label}
    </button>
);

export default SettingsPage;
