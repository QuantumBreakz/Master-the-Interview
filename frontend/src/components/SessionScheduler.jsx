import { useEffect, useState } from 'react';
import { Calendar, Clock, User, Briefcase, Code, FileText, Plus, RefreshCw, Check, AlertCircle } from 'lucide-react';
import config from '../config';

const SessionScheduler = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        candidateId: '',
        candidateName: '',
        position: '',
        startTime: '',
        endTime: '',
        duration: 60,
        skills: '',
        experienceLevel: 'intermediate',
        focusAreas: 'technical,problem-solving',
        allowCodeEditor: true,
        customQuestions: '',
        notes: ''
    });

    // Load existing sessions
    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            const response = await fetch(`${config.AI_BACKEND_URL}/api/scheduled-sessions/list`);
            const data = await response.json();

            if (data.success) {
                setSessions(data.sessions);
            } else {
                setError('Failed to load sessions');
            }
        } catch (err) {
            setError('Error loading sessions: ' + err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Prepare the data
            const sessionData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                focusAreas: formData.focusAreas.split(',').map(s => s.trim()).filter(Boolean),
                customQuestions: formData.customQuestions.split('\n').map(q => q.trim()).filter(Boolean)
            };

            const response = await fetch(`${config.AI_BACKEND_URL}/api/scheduled-sessions/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Session created successfully! Session ID: ${data.session.sessionId}`);
                setFormData({
                    candidateId: '',
                    candidateName: '',
                    position: '',
                    startTime: '',
                    endTime: '',
                    duration: 60,
                    skills: '',
                    experienceLevel: 'intermediate',
                    focusAreas: 'technical,problem-solving',
                    allowCodeEditor: true,
                    customQuestions: '',
                    notes: ''
                });
                loadSessions(); // Reload the sessions list
            } else {
                setError(data.error || 'Failed to create session');
            }
        } catch (err) {
            setError('Error creating session: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateStr) => {
        return new Date(dateStr).toLocaleString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'completed': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
            case 'expired': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'cancelled': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fade-in relative z-10">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Calendar className="text-white" size={32} />
                        Session Scheduler
                    </h1>
                    <p className="text-white/50">Create and manage time-bound interview sessions for candidates</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-200 rounded-2xl flex items-center gap-3">
                    <Check size={20} />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Create Session Form */}
                <div className="lg:col-span-7 bento-card p-8">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-white/60" />
                        Create New Session
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/60">
                                    Candidate ID *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                    <input
                                        type="text"
                                        name="candidateId"
                                        value={formData.candidateId}
                                        onChange={handleInputChange}
                                        className="w-full mac-input pl-10"
                                        required
                                        placeholder="e.g., CAND001"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/60">
                                    Candidate Name *
                                </label>
                                <input
                                    type="text"
                                    name="candidateName"
                                    value={formData.candidateName}
                                    onChange={handleInputChange}
                                    className="w-full mac-input"
                                    required
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/60">
                                Position
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    className="w-full mac-input pl-10"
                                    placeholder="e.g., Software Developer"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/60">
                                    Start Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="w-full mac-input"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-white/60">
                                    End Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="w-full mac-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/60">
                                Duration (minutes)
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    min="15"
                                    max="180"
                                    className="w-full mac-input pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/60">
                                Skills (comma-separated)
                            </label>
                            <div className="relative">
                                <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleInputChange}
                                    className="w-full mac-input pl-10"
                                    placeholder="JavaScript, React, Node.js"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/60">
                                Experience Level
                            </label>
                            <select
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleInputChange}
                                className="w-full mac-input appearance-none"
                            >
                                <option value="junior">Junior</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="senior">Senior</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="allowCodeEditor"
                                        checked={formData.allowCodeEditor}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-6 rounded-full transition-colors ${formData.allowCodeEditor ? 'bg-accent-green' : 'bg-white/10'}`}></div>
                                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.allowCodeEditor ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="ml-3 text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                                    Allow Code Editor
                                </span>
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/60">
                                Custom Questions (one per line)
                            </label>
                            <textarea
                                name="customQuestions"
                                value={formData.customQuestions}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full mac-input min-h-[100px]"
                                placeholder="Tell me about your experience with React&#10;How do you handle state management?&#10;Describe your testing approach"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/60">
                                Notes
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-white/20" size={16} />
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full mac-input pl-10 min-h-[60px]"
                                    placeholder="Additional notes for this session..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-apple-primary"
                        >
                            {loading ? 'Creating Session...' : 'Create Session'}
                        </button>
                    </form>
                </div>

                {/* Sessions List */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bento-card p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Scheduled Sessions</h2>
                            <button
                                onClick={loadSessions}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors"
                                title="Refresh List"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {sessions.map((session) => (
                                <div key={session.sessionId} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-white/20 transition-colors group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-medium text-white">{session.candidateName}</h3>
                                            <p className="text-sm text-white/50">{session.position}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(session.status)}`}>
                                            {session.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-xs text-white/40">
                                        <div className="flex items-center gap-2">
                                            <User size={12} />
                                            <span>ID: {session.candidateId}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} />
                                            <span>{formatDateTime(session.startTime)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {sessions.length === 0 && (
                                <div className="text-center text-white/30 py-12 border-2 border-dashed border-white/5 rounded-2xl">
                                    <Calendar className="mx-auto mb-3 opacity-20" size={48} />
                                    No scheduled sessions found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionScheduler;