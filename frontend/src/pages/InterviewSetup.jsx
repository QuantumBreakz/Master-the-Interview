import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, User, Check, AlertCircle, Loader2, Briefcase, Code } from 'lucide-react'
import config from '../config'

const InterviewSetup = () => {
    const navigate = useNavigate()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [selectedCandidateId, setSelectedCandidateId] = useState('')
    const [profileSummary, setProfileSummary] = useState(null)
    const [isStartingInterview, setIsStartingInterview] = useState(false)

    const handleFileUpload = async (file) => {
        setUploadError('')
        setSuccessMessage('')
        if (!file) return
        setIsUploading(true)
        // Quick health check to ensure backend is reachable
        try {
            const healthResp = await fetch(`${config.AI_BACKEND_URL}/api/health`);
            if (!healthResp.ok) throw new Error('Backend health check failed')
        } catch (err) {
            setUploadError(`Cannot reach backend at ${config.AI_BACKEND_URL} — please start the server and try again`)
            setIsUploading(false)
            return
        }
        try {
            const text = await file.text()
            let json = null
            try { json = JSON.parse(text) } catch (err) {
                setUploadError('Invalid JSON file')
                setIsUploading(false)
                return
            }

            let candidateIdToUse = json.candidateId || json.id || json.candidate_id
            if (!candidateIdToUse && json.candidateName) {
                candidateIdToUse = json.candidateName.toLowerCase().replace(/\s+/g, '_')
            }
            if (!candidateIdToUse || !json.candidateName) {
                setUploadError('JSON must include at least candidateId (or id) and candidateName')
                setIsUploading(false)
                return
            }

            if (json.skills && typeof json.skills === 'string') {
                json.skills = json.skills.split(',').map(s => s.trim()).filter(Boolean)
            }
            if (json.customQuestions && typeof json.customQuestions === 'string') {
                json.customQuestions = json.customQuestions.split('\n').map(q => q.trim()).filter(Boolean)
            }

            const payload = {
                candidateId: candidateIdToUse,
                candidateName: json.candidateName,
                position: json.position || json.role || 'Full Stack Developer',
                skills: json.skills || [],
                projectDetails: json.projectDetails || json.githubProjects || '',
                customQuestions: json.customQuestions || [],
                githubProjects: json.githubProjects || '',
                experience: json.experience || '',
                education: json.education || '',
                metadata: json.metadata || {},
                rawProfile: json
            }

            const resp = await fetch(`${config.AI_BACKEND_URL}/api/candidate/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!resp.ok) {
                const text = await resp.text().catch(() => null)
                setUploadError(text || `Server error: ${resp.status}`)
                setIsUploading(false)
                return
            }

            const data = await resp.json().catch(() => null)
            if (data && data.success) {
                try {
                    const genResp = await fetch(`${config.AI_BACKEND_URL}/api/candidate/generate-code-questions`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ candidateId: candidateIdToUse })
                    })
                    if (genResp && genResp.ok) {
                        const genData = await genResp.json().catch(() => null)
                        if (genData && genData.success) {
                            payload.codeQuestionsUrl = `${config.AI_BACKEND_URL}${genData.path}`
                            payload.codeQuestionsFile = genData.fileName
                        }
                    }
                } catch (err) {
                    console.warn('Could not generate code questions:', err)
                }

                setSuccessMessage(`Profile uploaded: ${payload.candidateName}`)
                setSelectedCandidateId(candidateIdToUse)
                setProfileSummary(payload)
            } else {
                setUploadError(data.error || 'Failed to save uploaded profile')
            }
        } catch (err) {
            console.error('Upload error:', err)
            setUploadError('Failed to upload file')
        } finally {
            setIsUploading(false)
            const input = document.getElementById('interviewUpload')
            if (input) input.value = ''
        }
    }

    const startInterviewWithUploaded = async () => {
        if (!selectedCandidateId) {
            setUploadError('No candidate selected. Upload a profile first.')
            return
        }

        setIsStartingInterview(true)
        setUploadError('')

        try {
            const sessionData = {
                candidateId: selectedCandidateId,
                applicationId: `app_upload_${Date.now()}`,
                jobId: `job_upload_${Date.now()}`,
                recruiterId: 'recruiter_upload',
                candidateDetails: {
                    candidateName: profileSummary.candidateName,
                    candidateEmail: profileSummary.candidateEmail || 'upload@example.com',
                    phoneNumber: profileSummary.phoneNumber || 'N/A',
                    companyName: 'Upload Session',
                    role: profileSummary.position,
                    techStack: profileSummary.skills || [],
                    experience: profileSummary.experience || 'Not specified'
                },
                scheduledDate: new Date().toISOString().split('T')[0],
                scheduledTime: new Date(Date.now() - 5 * 60000).toTimeString().split(' ')[0].substring(0, 5),
                duration: 60,
                timeZone: 'UTC'
            }

            const response = await fetch(`${config.AI_BACKEND_URL}/api/sessions/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData)
            })

            const data = await response.json()

            if (data.success) {
                const accessResponse = await fetch(`${config.AI_BACKEND_URL}/api/sessions/access-by-candidate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ candidateId: selectedCandidateId })
                })

                const accessData = await accessResponse.json()

                if (accessData.success) {
                    localStorage.setItem('interviewSession', JSON.stringify({
                        sessionId: accessData.session.sessionId,
                        accessToken: accessData.session.accessToken,
                        candidateName: accessData.session.candidateName,
                        candidateId: selectedCandidateId,
                        position: accessData.session.role,
                        companyName: accessData.session.companyName,
                        interviewData: accessData.interviewData
                    }))

                    navigate('/interview-session')
                } else {
                    setUploadError(accessData.error || 'Failed to access created session')
                }
            } else {
                setUploadError(data.error || 'Failed to create interview session')
            }
        } catch (err) {
            console.error('Error starting interview:', err)
            setUploadError('Failed to connect to server')
        } finally {
            setIsStartingInterview(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative z-10">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
                        <Code className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">AI Interviewer</h1>
                    <p className="text-text-secondary">Upload a candidate profile to begin</p>
                </div>

                <div className="glass-card p-8 shadow-2xl shadow-primary/5 border-t border-white/10">
                    <div className="space-y-6">
                        {/* File Upload Area */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Candidate JSON Profile
                            </label>
                            <label
                                htmlFor="interviewUpload"
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                                    ${isUploading
                                        ? 'border-primary bg-primary/10'
                                        : 'border-white/10 hover:border-primary/50 hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {isUploading ? (
                                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                    ) : (
                                        <Upload className={`w-8 h-8 mb-2 ${isUploading ? 'text-primary' : 'text-text-muted group-hover:text-primary transition-colors'}`} />
                                    )}
                                    <p className="text-sm text-text-muted group-hover:text-white transition-colors">
                                        {isUploading ? 'Uploading...' : 'Click to upload JSON'}
                                    </p>
                                </div>
                                <input
                                    id="interviewUpload"
                                    type="file"
                                    className="hidden"
                                    accept="application/json, .json"
                                    onChange={(e) => handleFileUpload(e.target.files && e.target.files[0])}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>

                        {/* Messages */}
                        {uploadError && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                                <p className="text-red-200 text-sm">{uploadError}</p>
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-400" />
                                <p className="text-green-200 text-sm">{successMessage}</p>
                            </div>
                        )}

                        {/* Profile Summary */}
                        {profileSummary && (
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {profileSummary.candidateName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{profileSummary.candidateName}</div>
                                        <div className="text-xs text-text-muted">ID: {selectedCandidateId}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                    <div className="bg-black/20 p-2 rounded-lg">
                                        <div className="text-text-muted text-xs mb-1 flex items-center gap-1"><Briefcase size={12} /> Role</div>
                                        <div className="text-text-secondary truncate">{profileSummary.position}</div>
                                    </div>
                                    <div className="bg-black/20 p-2 rounded-lg">
                                        <div className="text-text-muted text-xs mb-1 flex items-center gap-1"><FileText size={12} /> Projects</div>
                                        <div className="text-text-secondary">{profileSummary.projectDetails ? 'Included' : 'None'}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={startInterviewWithUploaded}
                            disabled={!selectedCandidateId || isStartingInterview}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {isStartingInterview ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Creating Session...
                                </>
                            ) : (
                                <>
                                    Start Interview Session
                                    <Code className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <p className="text-center text-text-muted text-xs">
                    Secure AI Interview Platform &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    )
}

export default InterviewSetup
