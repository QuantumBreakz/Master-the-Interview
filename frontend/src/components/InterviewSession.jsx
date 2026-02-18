import axios from 'axios';
import { useEffect, useState } from 'react';
import config from '../config';
import { User, Lock, Key, ChevronRight, Clock, Building, Briefcase, Calendar, Check, Play, LogOut, Code, FileText, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InterviewSession = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingInterview, setLoadingInterview] = useState(false);
  const [interviewInitialized, setInterviewInitialized] = useState(false);
  const [accessForm, setAccessForm] = useState({
    sessionId: '',
    accessToken: ''
  });
  const [candidateId, setCandidateId] = useState('');
  const [accessMode, setAccessMode] = useState('session'); // 'session' or 'candidate'

  // Check for session data from URL parameters or localStorage
  useEffect(() => {
    // First, check localStorage for session data (from InterviewSetup)
    const storedSession = localStorage.getItem('interviewSession');
    if (storedSession) {
      try {
        const sessionInfo = JSON.parse(storedSession);

        if (sessionInfo.sessionId && sessionInfo.accessToken) {
          setAccessForm({
            sessionId: sessionInfo.sessionId,
            accessToken: sessionInfo.accessToken
          });

          // Set pre-loaded data if available
          if (sessionInfo.interviewData) {
            setSessionData({
              sessionId: sessionInfo.sessionId,
              candidateName: sessionInfo.candidateName,
              role: sessionInfo.position,
              companyName: sessionInfo.companyName,
              status: 'active'
            });
            setInterviewData(sessionInfo.interviewData);
            setInterviewInitialized(true);

            // Clear localStorage after successful load
            localStorage.removeItem('interviewSession');
          } else {
            // Auto-access session to get interview data
            handleAccessSession(sessionInfo.sessionId, sessionInfo.accessToken);
          }
          return;
        }
      } catch (err) {
        console.error('Error parsing stored session:', err);
        localStorage.removeItem('interviewSession'); // Clean up invalid data
      }
    }

    // Fallback to URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId');
    const token = urlParams.get('token');

    if (sessionId && token) {
      setAccessForm({ sessionId, accessToken: token });
      // Auto-access if URL contains session details
      handleAccessSession(sessionId, token);
    }
  }, []);

  const handleAccessSession = async (sessionId = accessForm.sessionId, accessToken = accessForm.accessToken) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.AI_BACKEND_URL}/api/sessions/access`, {
        sessionId,
        accessToken
      });

      if (response.data.success) {
        setSessionData(response.data.session);
        setInterviewData(response.data.interviewData);
      } else {
        setError(response.data.error || 'Failed to access session');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to access session');
    } finally {
      setLoading(false);
    }
  };

  const handleAccessByCandidateId = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.AI_BACKEND_URL}/api/sessions/access-by-candidate`, {
        candidateId
      });

      if (response.data.success) {
        setSessionData(response.data.session);
        setInterviewData(response.data.interviewData);

        // Update access form with the retrieved session details for future use
        setAccessForm({
          sessionId: response.data.session.sessionId,
          accessToken: response.data.session.accessToken
        });

      } else {
        setError(response.data.error || 'Failed to access session');

        // Show helpful information if session not yet accessible
        if (response.data.sessionInfo) {
          const info = response.data.sessionInfo;
          setError(`${response.data.message || response.data.error}\n\nSession Details:\n- Candidate: ${info.candidateName}\n- Role: ${info.role}\n- Company: ${info.companyName}\n- Scheduled: ${new Date(info.scheduledStartTime).toLocaleString()}\n- Access from: ${new Date(info.accessibleFrom).toLocaleString()}\n- Time until access: ${info.timeUntilAccess} minutes`);
        }
      }
    } catch (err) {
      if (err.response?.data?.sessionInfo) {
        const info = err.response.data.sessionInfo;
        setError(`${err.response.data.message || err.response.data.error}\n\nSession Details:\n- Candidate: ${info.candidateName}\n- Role: ${info.role}\n- Company: ${info.companyName}\n- Scheduled: ${new Date(info.scheduledStartTime).toLocaleString()}\n- Access from: ${new Date(info.accessibleFrom).toLocaleString()}\n- Time until access: ${info.timeUntilAccess} minutes`);
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to access session');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeInterview = async () => {
    if (!sessionData || !accessForm.accessToken) return;

    setLoadingInterview(true);
    try {
      const response = await axios.post(`${config.AI_BACKEND_URL}/api/sessions/initialize-interview/${sessionData.sessionId}`, {
        accessToken: accessForm.accessToken
      });

      if (response.data.success) {
        setInterviewData(response.data.interviewData);
        setInterviewInitialized(true);
        // Navigate to the main interview page with state
        navigate('/', {
          state: {
            sessionData,
            interviewData: response.data.interviewData,
            accessToken: accessForm.accessToken
          }
        });
      } else {
        alert('Failed to initialize interview: ' + response.data.error);
      }
    } catch (err) {
      alert('Error initializing interview: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoadingInterview(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (sessionData) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-fade-in relative z-10 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Calendar className="text-white" size={32} />
            Session Overview
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/5">ID: {sessionData.sessionId}</span>
            <span className={`px-3 py-1 rounded-full border ${sessionData.status === 'active' ? 'border-accent-green/20 text-accent-green bg-accent-green/10' :
              'border-accent-blue/20 text-accent-blue bg-accent-blue/10'
              }`}>
              {sessionData.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Candidate Information */}
          <div className="bento-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <User className="text-white/60" size={20} />
              Candidate Information
            </h3>
            <div className="space-y-3 text-white/60">
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>Name</span> <span className="text-white font-medium">{sessionData.candidateName}</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>Role</span> <span className="text-white font-medium">{sessionData.role}</span>
              </p>
              <p className="flex justify-between">
                <span>Company</span> <span className="text-white font-medium">{sessionData.companyName}</span>
              </p>
            </div>
          </div>

          {/* Session Details */}
          <div className="bento-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Clock className="text-white/60" size={20} />
              Time & Duration
            </h3>
            <div className="space-y-3 text-white/60">
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>Start Time</span> <span className="text-white font-medium">{formatTime(sessionData.scheduledStartTime)}</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span>Duration</span> <span className="text-white font-medium">{sessionData.duration} min</span>
              </p>
              <p className="flex justify-between">
                <span>Remaining</span>
                <span className={`font-medium ${sessionData.timeRemaining <= 10 ? 'text-accent-red' : 'text-accent-green'}`}>
                  {sessionData.timeRemaining} min
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="bento-card p-6 border-l-4 border-l-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Play size={100} className="text-white" />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <h4 className="text-xl font-medium text-white mb-2">Ready to Start?</h4>
              <p className="text-white/50 max-w-lg">
                Your interview environment is prepared. Click start to enter the interview room with the AI assistant.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleInitializeInterview}
                disabled={loadingInterview}
                className="btn-apple-primary flex items-center gap-2"
              >
                {loadingInterview ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    Start Interview <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Interview Preview Data */}
        {interviewData && (
          <div className="space-y-6">
            <div className="bento-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <FileText className="text-white/60" size={20} />
                Interview Content Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-sm text-white/40 mb-1">Questions Prepared</div>
                  <div className="text-2xl font-bold text-white">{interviewData.interviewQuestions?.length || 0}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-sm text-white/40 mb-1">Coding Tasks</div>
                  <div className="text-2xl font-bold text-white">{interviewData.codingTasks?.length || 0}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-1 mt-10 animate-fade-in relative z-10">
      <div className="glass-panel p-8 rounded-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Lock className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Access Interview</h2>
          <p className="text-white/40 mt-2">Enter your credentials to access the secure interview session.</p>
        </div>

        {/* Access Mode Tabs */}
        <div className="flex mb-8 bg-black/20 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setAccessMode('candidate')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${accessMode === 'candidate'
              ? 'bg-white/10 text-white shadow-lg border border-white/10'
              : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
          >
            Candidate ID
          </button>
          <button
            onClick={() => setAccessMode('session')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${accessMode === 'session'
              ? 'bg-white/10 text-white shadow-lg border border-white/10'
              : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
          >
            Session Details
          </button>
        </div>

        {/* Candidate ID Access */}
        {accessMode === 'candidate' && (
          <form onSubmit={(e) => { e.preventDefault(); handleAccessByCandidateId(); }} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="candidateId" className="block text-sm font-medium text-white/60">
                Candidate ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="text"
                  id="candidateId"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="w-full mac-input pl-10"
                  placeholder="Enter your candidate ID"
                  required
                />
              </div>
              <p className="text-xs text-white/30">
                Check your invitation email for the ID
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm flex items-start gap-2">
                <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                <div className="whitespace-pre-wrap">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !candidateId}
              className="w-full btn-apple-primary flex items-center justify-center gap-2"
            >
              {loading ? 'Accessing...' : (
                <>
                  Access Interview <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Session Details Access */}
        {accessMode === 'session' && (
          <form onSubmit={(e) => { e.preventDefault(); handleAccessSession(); }} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="sessionId" className="block text-sm font-medium text-white/60">
                Session ID
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="text"
                  id="sessionId"
                  value={accessForm.sessionId}
                  onChange={(e) => setAccessForm({ ...accessForm, sessionId: e.target.value })}
                  className="w-full mac-input pl-10"
                  placeholder="Enter session ID"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="accessToken" className="block text-sm font-medium text-white/60">
                Access Token
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="text"
                  id="accessToken"
                  value={accessForm.accessToken}
                  onChange={(e) => setAccessForm({ ...accessForm, accessToken: e.target.value })}
                  className="w-full mac-input pl-10"
                  placeholder="Enter access token"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm flex items-start gap-2">
                <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                <div className="whitespace-pre-wrap">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-apple-primary flex items-center justify-center gap-2"
            >
              {loading ? 'Accessing...' : (
                <>
                  Access Session <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-white/30">
            Secure AI Interview Platform • Protected Connection
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;