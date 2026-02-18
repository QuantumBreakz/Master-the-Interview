import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AIAvatar3D from '../components/AIAvatar3D'
import VideoMonitor from '../components/VideoMonitor'
import config from '../config'
import ModernChatInterface from '../components/ModernChatInterface'
import ModernSidebar from '../components/ModernSidebar'
import { Code2, X, Zap, User, RefreshCw, ArrowRight } from 'lucide-react'

const InstructionStep = ({ number, title, desc }) => (
    <div className="flex items-center gap-4 group">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-mono text-sm group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20 transition-all">
            {number}
        </div>
        <div>
            <h4 className="font-bold text-white group-hover:text-white transition-colors">{title}</h4>
            <p className="text-sm text-white/50">{desc}</p>
        </div>
    </div>
);


const InterviewPage = () => {
    const navigate = useNavigate()
    const [sessionData, setSessionData] = useState(null)
    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessage] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [interviewStatus, setInterviewStatus] = useState('active') // active, paused, ended
    const [isVideoEnabled, setIsVideoEnabled] = useState(false)
    const [isAudioEnabled, setIsAudioEnabled] = useState(true)
    const [isTyping, setIsTyping] = useState(false)
    const [questionsAnswered, setQuestionsAnswered] = useState(3)
    const [interviewDuration, setInterviewDuration] = useState(0)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [voiceEnabled, setVoiceEnabled] = useState(true)
    const [isListening, setIsListening] = useState(false)
    const [showCodeEditor, setShowCodeEditor] = useState(false)
    const [codeEditorUrl, setCodeEditorUrl] = useState('')
    const [isAwaitingCodeEvaluation, setIsAwaitingCodeEvaluation] = useState(false)
    const [editorAcknowledged, setEditorAcknowledged] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(0)
    const videoRef = useRef(null)

    const streamRef = useRef(null)
    const [currentStream, setCurrentStream] = useState(null)
    const messagesEndRef = useRef(null)
    const chatContainerRef = useRef(null)
    const iframeRef = useRef(null)
    const speechSynthesisRef = useRef(null)
    const recognitionRef = useRef(null)
    const prevListeningRef = useRef(false)
    const suppressRecognitionRef = useRef(false)
    const autoSubmitTimerRef = useRef(null)
    const pendingMessageRef = useRef('')
    const countdownIntervalRef = useRef(null)
    const typingAutoSendTimerRef = useRef(null)
    const typingAutoSendIntervalRef = useRef(null)
    const [typingAutoSendCountdown, setTypingAutoSendCountdown] = useState(0)
    const [candidateIdInput, setCandidateIdInput] = useState('')
    const [isLoadingSession, setIsLoadingSession] = useState(false)
    const [sessionError, setSessionError] = useState('')
    const [backendStatus, setBackendStatus] = useState('checking') // checking, online, offline
    const [sessionTiming, setSessionTiming] = useState(null) // For scheduled session timing info
    const [timeRemaining, setTimeRemaining] = useState(null) // Real-time countdown

    // Generate session URL for sharing
    const generateSessionUrl = (sessionInfo) => {
        const baseUrl = window.location.origin + window.location.pathname
        const params = new URLSearchParams({
            sessionId: sessionInfo.sessionId,
            accessToken: sessionInfo.accessToken,
            candidateId: sessionInfo.candidateId
        })
        return `${baseUrl}?${params.toString()}`
    }

    // Handle direct candidate ID access
    const handleCandidateIdAccess = async () => {
        if (!candidateIdInput.trim()) {
            setSessionError('Please enter a candidate ID')
            return
        }

        setIsLoadingSession(true)
        setSessionError('')

        try {
            console.log('Accessing session with candidate ID:', candidateIdInput)

            // Access session using candidate ID
            const accessUrl = `${config.AI_BACKEND_URL}/api/sessions/access-by-candidate`
            console.log('🔍 Manual session access URL:', accessUrl)
            const response = await fetch(accessUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidateId: candidateIdInput.trim() })
            })

            const data = await response.json()

            if (data.success) {
                console.log('Session accessed successfully')

                // Store session info in localStorage
                const sessionInfo = {
                    sessionId: data.session.sessionId,
                    accessToken: data.session.accessToken,
                    candidateName: data.session.candidateName,
                    candidateId: candidateIdInput.trim(),
                    position: data.session.role,
                    companyName: data.session.companyName,
                    interviewData: data.interviewData
                }

                localStorage.setItem('interviewSession', JSON.stringify(sessionInfo))

                // Set session data and start interview
                setSessionData(sessionInfo)

                // Initialize the session
                await initializeInterviewSession(sessionInfo)

                // Set welcome message
                const welcomeMessage = `Hello ${data.session.candidateName}! Welcome to your technical interview for the ${data.session.role} position at ${data.session.companyName}. I'll be asking you some questions today to understand your technical skills and experience better. Let's start with: Can you tell me about yourself and your technical background?`

                setMessages([{
                    role: 'interviewer',
                    content: welcomeMessage,
                    timestamp: new Date().toLocaleTimeString()
                }])

            } else {
                if (response.status === 403 && data.sessionInfo) {
                    // Session found but not accessible yet
                    const info = data.sessionInfo
                    setSessionError(`Interview not yet accessible.\n\nSession Details:\n- Candidate: ${info.candidateName}\n- Role: ${info.role}\n- Company: ${info.companyName}\n- Scheduled: ${new Date(info.scheduledStartTime).toLocaleString()}\n- Access from: ${new Date(info.accessibleFrom).toLocaleString()}\n- Time until access: ${info.timeUntilAccess} minutes`)
                } else {
                    setSessionError(data.error || 'Failed to access session')
                }
            }
        } catch (err) {
            console.error('Error accessing session:', err)
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                setSessionError('Failed to connect to server. Please make sure the backend is running on port 3000.')
            } else {
                setSessionError(`Connection error: ${err.message}`)
            }
        } finally {
            setIsLoadingSession(false)
        }
    }

    // Text-to-Speech function
    const speakText = (text) => {
        if (!voiceEnabled || !('speechSynthesis' in window)) return

        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        // If recognition is active, remember that and stop it to avoid capturing AI speech
        try {
            // Remember if recognition existed (state may lag) and suppress incoming results
            prevListeningRef.current = Boolean(recognitionRef.current) || isListening
            suppressRecognitionRef.current = true
            if (recognitionRef.current) {
                try {
                    // Abort to immediately cancel and avoid further events
                    recognitionRef.current.abort()
                } catch (e) {
                    try { recognitionRef.current.stop() } catch (e2) { }
                }
                recognitionRef.current = null
            }
            setIsListening(false)
        } catch (e) {
            console.warn('Error while pausing recognition for TTS:', e)
        }

        const utterance = new SpeechSynthesisUtterance(text)

        // Configure voice settings
        utterance.rate = 0.9 // Slightly slower for clarity
        utterance.pitch = 1.0
        utterance.volume = 1.0

        // Get available voices and prefer a professional sounding one
        const voices = window.speechSynthesis.getVoices()
        const preferredVoice = voices.find(voice =>
            voice.name.includes('Google') ||
            voice.name.includes('Microsoft') ||
            voice.lang.startsWith('en')
        )
        if (preferredVoice) {
            utterance.voice = preferredVoice
        }

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => {
            setIsSpeaking(false)
            // Stop suppressing recognition results and restart if needed
            suppressRecognitionRef.current = false
            if (prevListeningRef.current) {
                prevListeningRef.current = false
                try {
                    startRecording()
                } catch (err) {
                    console.warn('Failed to restart recognition after TTS:', err)
                }
            }
        }
        utterance.onerror = () => {
            setIsSpeaking(false)
            suppressRecognitionRef.current = false
            // Attempt to resume recognition if needed
            if (prevListeningRef.current) {
                prevListeningRef.current = false
                try { startRecording() } catch (err) {/* ignore */ }
            }
        }

        speechSynthesisRef.current = utterance
        window.speechSynthesis.speak(utterance)
    }

    // Initialize Speech Recognition
    const initializeSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        if (!SpeechRecognition) {
            console.error('Speech recognition not supported')
            return null
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = false // Changed to false for auto-stop
        recognition.interimResults = true
        recognition.lang = 'en-IN'
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
            setIsListening(true)
            setIsRecording(true)
            // Automatically enable speaker (text-to-speech) when the user starts speaking
            setVoiceEnabled(true)
            // While speaking, disable typing by preventing key input (handled in a global listener)
        }

        recognition.onresult = (event) => {
            // If we're suppressing recognition (AI is speaking), ignore results
            if (suppressRecognitionRef.current) return
            let interimTranscript = ''
            let finalTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' '
                } else {
                    interimTranscript += transcript
                }
            }

            if (finalTranscript) {
                setInputMessage(prev => {
                    const newMessage = prev + finalTranscript
                    pendingMessageRef.current = newMessage // Store for auto-submit
                    return newMessage
                })
                setTranscript('')
            } else {
                setTranscript(interimTranscript)
            }
        }

        recognition.onerror = (event) => {
            // Suppress noisy errors when we've intentionally aborted/suppressed recognition
            const errCode = event && event.error ? event.error : null
            if (suppressRecognitionRef.current && (errCode === 'aborted' || errCode === 'no-speech')) {
                // silently ignore
                return
            }
            // For other errors, log them
            console.error('Speech recognition error:', errCode || event)
            setIsListening(false)
            setIsRecording(false)
            if (autoSubmitTimerRef.current) {
                clearTimeout(autoSubmitTimerRef.current)
            }
        }
        recognition.onend = () => {
            setIsListening(false)
            setIsRecording(false)
            setTranscript('')

            // Immediately submit after speech ends if there's content (no countdown)
            if (pendingMessageRef.current && pendingMessageRef.current.trim().length > 0) {
                try {
                    handleSendMessage()
                } catch (err) {
                    console.error('Error auto-sending after speech end:', err)
                }
                pendingMessageRef.current = ''
                setAutoSubmitCountdown(0)

                // Clear any leftover timers
                if (autoSubmitTimerRef.current) {
                    clearTimeout(autoSubmitTimerRef.current)
                    autoSubmitTimerRef.current = null
                }
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current)
                    countdownIntervalRef.current = null
                }
            }
        }

        // return the recognition instance so callers can start/stop it
        return recognition
    }

    // Stop voice recording manually
    const stopRecording = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
        }
    }

    // Toggle voice recording
    const toggleRecording = () => {
        if (isListening) {
            stopRecording()
        } else {
            startRecording()
        }
    }

    // Programmatic start for speech recognition (used for auto-start)
    const startRecording = () => {
        if (isListening) return
        const recognition = initializeSpeechRecognition()
        if (!recognition) return
        recognitionRef.current = recognition
        // Ensure suppression is off when starting recognition
        suppressRecognitionRef.current = false
        try {
            recognition.start()
        } catch (err) {
            console.warn('Speech recognition start failed:', err)
            // start failed; nothing else to do here
        }
    }

    // Initialize interview session with backend
    const initializeInterviewSession = async (sessionInfo) => {
        if (!sessionInfo || !sessionInfo.sessionId || !sessionInfo.accessToken) {
            console.error('Missing session credentials:', sessionInfo)
            return
        }

        try {
            console.log('Initializing interview session:', sessionInfo.sessionId)
            const response = await fetch(`${config.AI_BACKEND_URL}/api/sessions/initialize-interview/${sessionInfo.sessionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken: sessionInfo.accessToken })
            })

            const data = await response.json()
            if (data.success) {
                console.log('Interview session initialized successfully')
                // Update session data with any additional info from backend
                if (data.interviewData) {
                    setSessionData(prev => ({
                        ...prev,
                        interviewData: data.interviewData
                    }))
                }
            } else {
                console.error('Failed to initialize interview session:', data.error)
            }
        } catch (err) {
            console.error('Error initializing interview session:', err)
        }
    }

    const handleSendMessage = async () => {
        // Ensure we have an active interview session before sending
        if (!sessionData || !sessionData.sessionId) {
            console.error('No active interview session—cannot send message')
            const aiResponse = {
                role: 'interviewer',
                content: 'No active interview session. Please (re)start the interview.',
                timestamp: new Date().toLocaleTimeString()
            }
            setMessages(prev => [...prev, aiResponse])
            setInputMessage('')
            pendingMessageRef.current = ''
            return
        }

        if (inputMessage.trim()) {
            // Clear auto-submit timer if exists
            if (autoSubmitTimerRef.current) {
                clearTimeout(autoSubmitTimerRef.current)
                autoSubmitTimerRef.current = null
            }
            // Clear typing auto-send timers
            if (typingAutoSendTimerRef.current) {
                clearTimeout(typingAutoSendTimerRef.current)
                typingAutoSendTimerRef.current = null
            }
            if (typingAutoSendIntervalRef.current) {
                clearInterval(typingAutoSendIntervalRef.current)
                typingAutoSendIntervalRef.current = null
            }
            setTypingAutoSendCountdown(0)
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current)
                countdownIntervalRef.current = null
            }
            setAutoSubmitCountdown(0)

            const newMessage = {
                role: 'candidate',
                content: inputMessage,
                timestamp: new Date().toLocaleTimeString()
            }
            setMessages([...messages, newMessage])
            setInputMessage('')
            pendingMessageRef.current = '' // Clear pending message
            setIsTyping(true)

            try {
                // Get AI response from backend using session-based messaging
                const response = await fetch(`${config.AI_BACKEND_URL}/api/sessions/message/${sessionData.sessionId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessToken: sessionData.accessToken,
                        message: inputMessage,
                        messageType: 'answer'
                    })
                })

                if (!response.ok) {
                    // Backend returned an HTTP error (404/500/etc). Try to read body for details.
                    const text = await response.text().catch(() => null)
                    console.error('Backend error', response.status, text)
                    const aiResponse = {
                        role: 'interviewer',
                        content: `Sorry, the interview service returned an error (${response.status}).`,
                        timestamp: new Date().toLocaleTimeString()
                    }
                    setMessages(prev => [...prev, aiResponse])
                } else {
                    const data = await response.json()
                    if (data && data.success) {
                        const aiResponse = {
                            role: 'interviewer',
                            content: data.message,
                            timestamp: new Date().toLocaleTimeString()
                        }
                        setMessages(prev => [...prev, aiResponse])
                        setQuestionsAnswered(prev => prev + 1)
                    } else {
                        console.error('Error getting AI response:', data && data.error)
                        const aiResponse = {
                            role: 'interviewer',
                            content: (data && data.error) ? data.error : 'I apologize, I had trouble processing your answer. Could you please try again?',
                            timestamp: new Date().toLocaleTimeString()
                        }
                        setMessages(prev => [...prev, aiResponse])
                    }
                }
            } catch (error) {
                console.error('Error communicating with backend:', error)
                const aiResponse = {
                    role: 'interviewer',
                    content: 'Sorry, I\'m having connection issues. Please make sure the backend server is running.',
                    timestamp: new Date().toLocaleTimeString()
                }
                setMessages(prev => [...prev, aiResponse])
            } finally {
                setIsTyping(false)
            }
        }
    }

    // Cancel typing auto-send (manual cancel button)
    // (Auto-send cancel buttons removed - auto-send will proceed without manual cancel)

    const endInterview = async () => {
        setInterviewStatus('ended')
        stopVideo()
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
        }

        // End session on backend and save results
        if (sessionData) {
            try {
                // Use the correct interview end endpoint
                const response = await fetch(`${config.AI_BACKEND_URL}/api/interview/end`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sessionId: sessionData.sessionId,
                        accessToken: sessionData.accessToken
                    })
                })

                const data = await response.json()

                if (data.success) {
                    if (data.fileName) {
                        // Show success message with file details
                        alert(
                            `✅ Interview Completed!\n\n` +
                            `Candidate: ${data.summary.candidateName}\n` +
                            `Duration: ${data.summary.duration}\n` +
                            `Questions Asked: ${data.summary.questionsAsked}\n\n` +
                            `Results saved to:\n${data.fileName}\n\n` +
                            `Thank you for participating!`
                        )
                        console.log('Interview saved:', data.fileName)
                    } else {
                        alert('Interview ended successfully!')
                        console.log('Interview ended:', data.message)
                    }
                } else {
                    alert(`Error ending interview: ${data.error}`)
                }
            } catch (error) {
                console.error('Error ending interview:', error)
                alert('Interview ended. Results may not have been saved.')
            }
        }

        // Clear session data and navigate to home
        localStorage.removeItem('interviewSession')
        setSessionData(null)
        setMessages([])
        setQuestionsAnswered(0)
        setInterviewDuration(0)

        // Redirect to home or show end screen
        navigate('/')
    }

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            // Keep a reference to the raw stream for other logic
            streamRef.current = stream
            // Also set local state so UI components (VideoMonitor) re-render
            setCurrentStream(stream)
            setIsVideoEnabled(true)
        } catch (err) {
            console.error("Error accessing camera:", err)
            alert("Unable to access camera. Please grant camera permissions.")
        }
    }

    const stopVideo = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            // Clear display stream state and refs
            if (videoRef.current) {
                try { videoRef.current.srcObject = null } catch (e) { }
            }
            streamRef.current = null
            setCurrentStream(null)
            setIsVideoEnabled(false)
        }
    }

    const toggleVideo = () => {
        if (isVideoEnabled) {
            stopVideo()
        } else {
            startVideo()
        }
    }

    const toggleAudio = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsAudioEnabled(audioTrack.enabled)
            }
        }
    }

    // Retry connection function that can be called from anywhere
    const retryConnection = async () => {
        setSessionError('')
        setBackendStatus('checking')
        await loadSessionData()
    }

    // Main session loading function
    const loadSessionData = async () => {
        // Check backend health first
        const healthUrl = `${config.AI_BACKEND_URL}/api/health`
        console.log('🔍 Health check URL:', healthUrl)

        try {
            const healthResponse = await fetch(healthUrl)
            if (!healthResponse.ok) {
                console.error('❌ Health check failed with status:', healthResponse.status)
                setBackendStatus('offline')
                setSessionError('Backend server is not responding. Please start the backend server.')
                return
            }
            console.log('✅ Backend server is running')
            setBackendStatus('online')
        } catch (err) {
            console.error('Backend health check failed:', err)
            setBackendStatus('offline')
            setSessionError('Cannot connect to backend server. Please start the backend on port 3000.')
            return
        }

        // First check localStorage for existing session
        const session = localStorage.getItem('interviewSession')
        if (session) {
            const parsedSession = JSON.parse(session)
            setSessionData(parsedSession)

            // Initialize interview session with the backend
            await initializeInterviewSession(parsedSession)

            // Set initial welcome message
            const welcomeMessage = parsedSession.initialMessage ||
                `Hello ${parsedSession.candidateName || 'there'}! Welcome to your technical interview for the ${parsedSession.position || 'position'} role. I'll be asking you some questions today to understand your technical skills and experience better. Let's start with: Can you tell me about yourself and your technical background?`

            setMessages([{
                role: 'interviewer',
                content: welcomeMessage,
                timestamp: new Date().toLocaleTimeString()
            }])
            return
        }

        // Check URL parameters for candidate ID or session info
        const urlParams = new URLSearchParams(window.location.search)
        const candidateId = urlParams.get('candidateId')
        const sessionId = urlParams.get('sessionId')
        const accessToken = urlParams.get('accessToken')

        // Auto-load session if URL contains session parameters
        if (candidateId) {
            console.log('Accessing session with candidate ID:', candidateId)
            const accessUrl = `${config.AI_BACKEND_URL}/api/sessions/access-by-candidate`
            console.log('🔍 Session access URL:', accessUrl)
            try {
                const response = await fetch(accessUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        candidateId,
                        accessToken: accessToken || null
                    })
                })

                if (!response.ok) {
                    throw new Error(`Access failed: ${response.status}`)
                }

                const data = await response.json()
                if (data.success && data.session) {
                    console.log('Session accessed successfully:', data.session)

                    // Store session in localStorage
                    localStorage.setItem('interviewSession', JSON.stringify(data.session))
                    setSessionData(data.session)

                    // Initialize interview with backend
                    await initializeInterviewSession(data.session)

                    // Set initial welcome message
                    const welcomeMessage = data.session.initialMessage ||
                        `Hello ${data.session.candidateName || 'there'}! Welcome to your technical interview for the ${data.session.position || 'position'} role. I'll be asking you some questions today to understand your technical skills and experience better. Let's start with: Can you tell me about yourself and your technical background?`

                    setMessages([{
                        role: 'interviewer',
                        content: welcomeMessage,
                        timestamp: new Date().toLocaleTimeString()
                    }])
                } else {
                    console.error('Session access failed:', data.message)
                    setSessionError(data.message || 'Unable to access session')
                }
            } catch (error) {
                console.error('Error accessing session:', error)
                setSessionError('Failed to load session. Please check your access link.')
            }
        }
    }

    useEffect(() => {
        loadSessionData()
    }, [])

    // Separate effect for session-dependent initialization
    useEffect(() => {
        if (!sessionData) return

        // Auto-start video when session is available
        startVideo()

        // Interview duration timer
        const timer = setInterval(() => {
            setInterviewDuration(prev => prev + 1)
        }, 1000)

        // Load voices for speech synthesis
        if ('speechSynthesis' in window) {
            // Some browsers need this to load voices
            window.speechSynthesis.getVoices()
        }

        // Cleanup on unmount or session change
        return () => {
            stopVideo()
            clearInterval(timer)
            window.speechSynthesis.cancel()
            if (recognitionRef.current && isListening) {
                recognitionRef.current.stop()
            }
            if (autoSubmitTimerRef.current) {
                clearTimeout(autoSubmitTimerRef.current)
            }
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current)
            }
        }
    }, [sessionData])

    // Session timing tracker for scheduled sessions
    useEffect(() => {
        if (!sessionData?.isScheduled || !sessionData?.endTime) return

        const updateTimeRemaining = () => {
            const now = new Date()
            const endTime = new Date(sessionData.endTime)
            const timeLeft = Math.max(0, Math.ceil((endTime - now) / (1000 * 60))) // minutes

            setTimeRemaining(timeLeft)

            // Auto-end session when time expires
            if (timeLeft <= 0) {
                setSessionError('Your session time has expired. The interview will now end.')
                setTimeout(() => {
                    endInterview()
                }, 3000)
            }
        }

        // Update immediately
        updateTimeRemaining()

        // Update every minute
        const timingInterval = setInterval(updateTimeRemaining, 60000)

        return () => clearInterval(timingInterval)
    }, [sessionData])

    // Auto-start speech recognition when a session is available
    useEffect(() => {
        if (!sessionData) return
        try {
            startRecording()
        } catch (err) {
            console.warn('Auto-start recognition failed:', err)
        }

        // Note: cleanup (stop) on unmount is handled in the main session effect above
    }, [sessionData])

    // Keyboard shortcut: press 'm' to toggle microphone (user gesture to satisfy some browsers)
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'm' || e.key === 'M') {
                e.preventDefault()
                toggleRecording()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isListening])

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Auto-send typed messages after a short debounce (800ms)
    useEffect(() => {
        const clearTypingTimers = () => {
            if (typingAutoSendTimerRef.current) {
                clearTimeout(typingAutoSendTimerRef.current)
                typingAutoSendTimerRef.current = null
            }
            if (typingAutoSendIntervalRef.current) {
                clearInterval(typingAutoSendIntervalRef.current)
                typingAutoSendIntervalRef.current = null
            }
            setTypingAutoSendCountdown(0)
        }

        // Do not auto-send while using voice recording
        if (isListening) {
            clearTypingTimers()
            return
        }

        // If no input, nothing to send
        if (!inputMessage || !inputMessage.trim()) {
            clearTypingTimers()
            return
        }

        // Start debounce timer (800ms) and a simple 1s countdown for UI feedback
        const delayMs = 800
        const delaySec = Math.ceil(delayMs / 1000)

        // Reset any previous timers
        clearTypingTimers()
        setTypingAutoSendCountdown(delaySec)

        typingAutoSendIntervalRef.current = setInterval(() => {
            setTypingAutoSendCountdown(prev => {
                if (!prev || prev <= 1) {
                    // final tick - clear interval
                    if (typingAutoSendIntervalRef.current) {
                        clearInterval(typingAutoSendIntervalRef.current)
                        typingAutoSendIntervalRef.current = null
                    }
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        typingAutoSendTimerRef.current = setTimeout(async () => {
            // clear the interval
            if (typingAutoSendIntervalRef.current) {
                clearInterval(typingAutoSendIntervalRef.current)
                typingAutoSendIntervalRef.current = null
            }
            typingAutoSendTimerRef.current = null
            setTypingAutoSendCountdown(0)

            try {
                await handleSendMessage()
            } catch (err) {
                console.error('Error auto-sending typed message:', err)
            }
        }, delayMs)

        // Cleanup on dependency change/unmount
        return () => {
            clearTypingTimers()
        }
    }, [inputMessage, isListening])

    // Send immediately when user presses Enter (without Shift)
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                // Prevent newline insertion where a separate input is used
                e.preventDefault()
                if (isListening) return
                if (inputMessage && inputMessage.trim()) {
                    // Clear any pending debounce timers before sending
                    if (typingAutoSendTimerRef.current) {
                        clearTimeout(typingAutoSendTimerRef.current)
                        typingAutoSendTimerRef.current = null
                    }
                    if (typingAutoSendIntervalRef.current) {
                        clearInterval(typingAutoSendIntervalRef.current)
                        typingAutoSendIntervalRef.current = null
                    }
                    setTypingAutoSendCountdown(0)
                    try {
                        handleSendMessage()
                    } catch (err) {
                        console.error('Error sending message on Enter:', err)
                    }
                }
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [inputMessage, isListening])

    // When listening, prevent typing by blocking character keydowns globally
    useEffect(() => {
        const blockTyping = (e) => {
            if (!isListening) return
            // Allow control keys like Escape to stop recording, and allow function keys
            const allowed = ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Tab', 'Shift', 'Control', 'Alt', 'Meta', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
            if (allowed.includes(e.key)) return
            // If key is a single printable character, prevent it
            if (e.key.length === 1) {
                e.preventDefault()
                e.stopPropagation()
            }
        }

        document.addEventListener('keydown', blockTyping, true)
        return () => document.removeEventListener('keydown', blockTyping, true)
    }, [isListening])

    // Text-to-Speech for AI messages
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1]
            if (lastMessage.role === 'interviewer' && !isTyping) {
                // Slight delay to let the message render
                setTimeout(() => {
                    speakText(lastMessage.content)
                }, 500)
                // Detect if AI is asking for a coding test / coding exercise
                try {
                    const text = (lastMessage.content || '').toLowerCase()
                    const codingTriggers = [
                        'coding test',
                        'code challenge',
                        'coding exercise',
                        'please write code',
                        'implement',
                        'solve the problem',
                        'write a function',
                        'pair programming',
                        'open the code editor',
                        'coding task',
                        'build a solution',
                        'please implement',
                        'write code to'
                    ]

                    const triggered = codingTriggers.some(trigger => text.includes(trigger))
                    if (triggered && sessionData) {
                        // Build code editor URL with some context if available
                        const base = config.CODE_EDITOR_URL
                        const params = new URLSearchParams()
                        if (sessionData.sessionId) params.set('sessionId', sessionData.sessionId)
                        if (sessionData.candidateId) params.set('candidateId', sessionData.candidateId)
                        if (sessionData.candidateName) params.set('candidateName', sessionData.candidateName)
                        // Pass the interview session access token so code editor can fetch synchronized tasks
                        if (sessionData.accessToken) params.set('accessToken', sessionData.accessToken)
                        // If the session has a codeQuestionsUrl (generated by backend), pass it to the editor
                        if (sessionData.codeQuestionsUrl) params.set('codeQuestionsUrl', sessionData.codeQuestionsUrl)
                        const url = params.toString() ? `${base}?${params.toString()}` : base
                        setCodeEditorUrl(url)
                        // Slight delay to avoid abrupt UI change
                        setTimeout(() => setShowCodeEditor(true), 350)
                    }
                } catch (err) {
                    console.error('Error detecting coding trigger:', err)
                }
            }
        }
    }, [messages, isTyping, voiceEnabled])

    // When code editor panel opens, create a test session and notify backend + editor
    useEffect(() => {
        const notifyCodeStart = async () => {
            if (!showCodeEditor || !sessionData) return

            try {
                // 1) Get synchronized coding tasks from the current interview session
                console.log('[notifyCodeStart] Getting synchronized coding tasks for session', sessionData.sessionId)
                let codingTasks = []
                try {
                    const tasksResp = await fetch(`${config.AI_BACKEND_URL}/api/sessions/coding-tasks/${sessionData.sessionId}?token=${sessionData.accessToken}`)
                    if (tasksResp.ok) {
                        const tasksData = await tasksResp.json()
                        if (tasksData.success && tasksData.codingTasks) {
                            codingTasks = tasksData.codingTasks
                            console.log('[notifyCodeStart] Retrieved synchronized coding tasks:', codingTasks.length)
                        }
                    }
                } catch (err) {
                    console.warn('[notifyCodeStart] Failed to get synchronized coding tasks', err)
                }

                // 2) Create a dedicated test session for the code editor (fallback for compatibility)
                console.log('[notifyCodeStart] Creating test session for candidate', sessionData.candidateId)
                let testResp = null
                try {
                    const r = await fetch(`${config.AI_BACKEND_URL}/api/test/start-session`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ candidateId: sessionData.candidateId })
                    })
                    testResp = r.ok ? await r.json().catch(() => null) : null
                    console.log('[notifyCodeStart] /api/test/start-session response', r && r.status, testResp)
                } catch (err) {
                    console.warn('[notifyCodeStart] Failed to call /api/test/start-session', err)
                }

                // 2) Tell the interviewer that coding started (so it pauses)
                try {
                    const r2 = await fetch(`${config.AI_BACKEND_URL}/api/sessions/message/${sessionData.sessionId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            accessToken: sessionData.accessToken,
                            message: 'Starting coding test phase',
                            messageType: 'system'
                        })
                    })
                    console.log('[notifyCodeStart] session message status', r2 && r2.status)
                } catch (err) {
                    console.warn('[notifyCodeStart] Failed to notify session about code start', err)
                }

                // 3) Build start message for iframe — include both interview sessionId and testSessionId + candidateId + tasks
                const startMsg = {
                    type: 'startCodingTest',
                    interviewSessionId: sessionData.sessionId,
                    candidateId: sessionData.candidateId,
                    testSessionId: testResp && testResp.sessionId ? testResp.sessionId : null,
                    tasks: []
                }

                // Prioritize synchronized coding tasks from the interview session
                if (codingTasks && codingTasks.length > 0) {
                    startMsg.tasks = codingTasks
                    startMsg.synchronized = true
                    console.log('[notifyCodeStart] Using synchronized coding tasks:', codingTasks.length)
                }
                // Fallback to test session response if no synchronized tasks available
                else if (testResp) {
                    if (testResp.tasks) startMsg.tasks = testResp.tasks
                    else if (testResp.question) startMsg.tasks = [testResp.question]
                    else if (testResp.questions) startMsg.tasks = testResp.questions
                    console.log('[notifyCodeStart] Using fallback test session tasks')
                }

                // 4) Ensure iframe URL contains candidate/test context so the editor can read from window.location if needed
                try {
                    const base = config.CODE_EDITOR_URL
                    const params = new URLSearchParams()
                    if (sessionData.sessionId) params.set('interviewSessionId', sessionData.sessionId)
                    if (sessionData.candidateId) params.set('candidateId', sessionData.candidateId)
                    if (testResp && testResp.sessionId) params.set('testSessionId', testResp.sessionId)
                    const newUrl = params.toString() ? `${base}?${params.toString()}` : base
                    setCodeEditorUrl(newUrl)
                } catch (e) {
                    console.warn('Failed to build code editor URL with params', e)
                }

                // 5) Post start message to iframe (retry a few times until iframe acknowledges)
                const maxAttempts = 6
                let attempt = 0
                const editorUrl = codeEditorUrl || ''
                const origin = (() => { try { return editorUrl ? new URL(editorUrl).origin : '*' } catch (e) { return '*' } })()

                while (attempt < maxAttempts) {
                    attempt += 1
                    try {
                        if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
                            console.log(`[notifyCodeStart] posting start message attempt ${attempt}`, startMsg)
                            iframeRef.current.contentWindow.postMessage(startMsg, origin || '*')
                        } else {
                            console.log('[notifyCodeStart] iframe not ready yet, will retry')
                        }
                    } catch (e) {
                        console.warn('postMessage to iframe failed on attempt', attempt, e)
                    }

                    // Wait for a short interval to allow iframe to load and potentially ack
                    await new Promise(r => setTimeout(r, 400))

                    // Stop early if editor acknowledged
                    if (editorAcknowledged) {
                        console.log('[notifyCodeStart] editor acknowledged start')
                        break
                    }
                }

            } catch (err) {
                console.warn('Error in notifyCodeStart flow:', err)
            }
        }

        notifyCodeStart()
    }, [showCodeEditor, sessionData])

    // Listen for postMessage events from embedded code editor and forward results to backend
    useEffect(() => {
        const allowedOrigins = [
            'https://ai-code-editor-psi-two.vercel.app',
            'https://ai-code-editor-psi-two.vercel.app/'
        ]

        const handleEditorMessage = async (event) => {
            console.log('[editor->parent] message received', { origin: event.origin, data: event.data })
            if (!event || !event.data) return

            // Basic origin check: allow explicit origins or localhost-dev
            const origin = event.origin || ''
            const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')
            if (!isLocalhost && !allowedOrigins.includes(origin)) {
                // Not from allowed origin — ignore for security
                console.warn('Ignored message from untrusted origin:', origin)
                return
            }

            let data = event.data
            // If message is a JSON string, try to parse
            if (typeof data === 'string') {
                try { data = JSON.parse(data) } catch (e) { /* leave as-is */ }
            }

            // Support different shapes: { type: 'codeSubmission', payload: {...} } or raw payload containing code
            const payload = (data && (data.type === 'codeSubmission' || data.type === 'code-result' || data.action === 'submit'))
                ? (data.payload || data)
                : data

            if (!payload || (!payload.code && !payload.result)) {
                // Allow editor to send acknowledgment messages like { type: 'editorAck' }
                if (payload && payload.type && (payload.type === 'editorAck' || payload.type === 'editorReady')) {
                    console.log('[editor->parent] editor acknowledged start', payload)
                    setEditorAcknowledged(true)
                }
                return
            }

            // Ensure sessionId is present
            if (!payload.sessionId && sessionData && sessionData.sessionId) {
                payload.sessionId = sessionData.sessionId
            }

            setIsAwaitingCodeEvaluation(true)
            try {
                const resp = await fetch(`${config.AI_BACKEND_URL}/api/sessions/message/${sessionData.sessionId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        accessToken: sessionData.accessToken,
                        message: `Code submission: ${payload.code || 'Code completed'}`,
                        messageType: 'code_result',
                        codeResult: payload
                    })
                })

                const data = await resp.json()
                console.log('[parent->backend] forwarded code-result response', data)
                if (data && data.success) {
                    const aiResponse = {
                        role: 'interviewer',
                        content: data.aiResponse || data.response || 'Received coding test results.',
                        timestamp: new Date().toLocaleTimeString()
                    }
                    setMessages(prev => [...prev, aiResponse])
                } else {
                    console.error('Error from /api/interview/code-result:', data)
                }
            } catch (err) {
                console.error('Failed to forward code result to backend:', err)
            } finally {
                setIsAwaitingCodeEvaluation(false)
            }
        }

        window.addEventListener('message', handleEditorMessage)
        return () => window.removeEventListener('message', handleEditorMessage)
    }, [sessionData])

    // Format duration (seconds to MM:SS)
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    // Show candidate ID input if no session data
    if (!sessionData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                        {/* Instructions Panel */}
                        <div className="glass-panel p-8 relative overflow-hidden group rounded-3xl">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Zap size={120} />
                            </div>
                            <div className="space-y-8 relative z-10">
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-bold mb-2">Interview <span className="text-gradient-apple">Instructions</span></h3>
                                    <p className="text-white/60">Everything you need to know before starting</p>
                                </div>

                                <div className="space-y-6">
                                    <InstructionStep
                                        number="01"
                                        title="Prepare Environment"
                                        desc="Quiet space, stable internet, working microphone."
                                    />
                                    <InstructionStep
                                        number="02"
                                        title="Voice Interaction"
                                        desc="AI will speak. Respond via voice or text."
                                    />
                                    <InstructionStep
                                        number="03"
                                        title="Coding Challenges"
                                        desc="Use the integrated code editor for technical questions."
                                    />
                                    <InstructionStep
                                        number="04"
                                        title="Duration"
                                        desc="Typically 30-60 minutes."
                                    />

                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-6">
                                        <div className="flex items-start space-x-3">
                                            <Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h5 className="font-bold text-amber-500 text-sm uppercase tracking-wide">Important Notes</h5>
                                                <ul className="text-amber-200/80 text-sm space-y-1 mt-1">
                                                    <li>• Don't refresh page during interview</li>
                                                    <li>• ID provided by recruiter</li>
                                                    <li>• Camera optional but recommended</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Login Form */}
                        <div className="glass-panel p-0 overflow-hidden relative rounded-3xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                            {/* Card Header */}
                            <div className="bg-white/5 px-8 py-10 text-center border-b border-white/5 relative">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-white/20 to-white/5 p-[1px] mx-auto mb-6 shadow-2xl shadow-black/50">
                                    <div className="w-full h-full rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                                        <User size={32} className="text-white" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                                <p className="text-white/40">Enter your credentials to access the session</p>
                            </div>

                            {/* Card Body */}
                            <div className="px-8 py-8 space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="candidateId" className="block text-sm font-medium text-white/80 ml-1">
                                        Candidate ID
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <div className="p-1.5 bg-white/5 rounded-md group-focus-within:bg-white/10 transition-colors">
                                                <User size={16} className="text-white/60 group-focus-within:text-white transition-colors" />
                                            </div>
                                        </div>
                                        <input
                                            id="candidateId"
                                            type="text"
                                            value={candidateIdInput}
                                            onChange={(e) => setCandidateIdInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleCandidateIdAccess()}
                                            placeholder="Enter your candidate ID"
                                            className="w-full mac-input pl-14 text-lg"
                                            disabled={isLoadingSession}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleCandidateIdAccess}
                                    disabled={isLoadingSession || !candidateIdInput.trim()}
                                    className="w-full btn-apple-primary py-4 text-lg font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoadingSession ? (
                                        <>
                                            <RefreshCw className="animate-spin" size={20} />
                                            <span>Accessing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Start Interview</span>
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>

                                {sessionError && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 fade-in">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-red-500/20 p-1 rounded-full">
                                                <span className="text-red-500 font-bold block w-4 h-4 text-center leading-4">!</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-red-200 leading-relaxed">{sessionError}</p>
                                                {backendStatus === 'offline' && (
                                                    <button
                                                        onClick={() => window.location.reload()} // Simple retry
                                                        className="mt-2 text-xs text-red-400 hover:text-white underline underline-offset-2 transition-colors"
                                                    >
                                                        Retry Connection
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Line */}
                            <div className="px-8 pb-6 text-center border-t border-white/5 pt-4">
                                <div className="inline-flex items-center space-x-2 text-xs text-white/30 font-mono">
                                    <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                        backendStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}></div>
                                    <span className="uppercase tracking-wider">
                                        {backendStatus === 'online' ? 'System Online' :
                                            backendStatus === 'offline' ? 'System Offline' :
                                                'Connecting...'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col md:flex-row bg-background animate-fade-in relative z-10">
            {/* Left Sidebar (Video Feeds & Controls) */}
            <div className={`
                transition-all duration-300 ease-in-out border-r border-white/5
                ${showCodeEditor ? 'w-full md:w-[280px] lg:w-[320px]' : 'w-full md:w-[320px] lg:w-[380px]'}
                flex flex-col bg-surface/30 backdrop-blur-sm
            `}>
                <ModernSidebar
                    isTyping={isTyping}
                    isSpeaking={isSpeaking}
                    currentStream={currentStream}
                    isVideoEnabled={isVideoEnabled}
                    isAudioEnabled={isAudioEnabled}
                    voiceEnabled={voiceEnabled}
                    toggleVideo={toggleVideo}
                    toggleAudio={toggleAudio}
                    setVoiceEnabled={setVoiceEnabled}
                    interviewDuration={interviewDuration}
                />
            </div>

            {/* Main Content Area (Chat + optional Code Editor) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                {/* Chat Interface */}
                <div className={`
                    flex-1 flex flex-col h-full transition-all duration-300 relative
                    ${showCodeEditor ? 'md:w-[40%]' : 'w-full'}
                `}>
                    <ModernChatInterface
                        messages={messages}
                        isTyping={isTyping}
                        isListening={isListening}
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        handleSendMessage={handleSendMessage}
                        toggleRecording={toggleRecording}
                        autoSubmitCountdown={autoSubmitCountdown}
                        transcript={transcript}
                    />

                    {/* Toggle Code Editor Button (Floating or fixed in header usually, but putting here for visibility) */}
                    {!showCodeEditor && (
                        <button
                            onClick={() => setShowCodeEditor(true)}
                            className="absolute top-4 right-4 z-20 btn-secondary text-xs py-2 px-3 shadow-lg backdrop-blur-md"
                        >
                            <Code2 size={16} className="mr-2" />
                            Open Code Editor
                        </button>
                    )}
                </div>

                {/* Code Editor Panel (Conditional) */}
                {showCodeEditor && (
                    <div className="flex-1 border-l border-white/5 bg-[#1e1e1e] flex flex-col transition-all duration-300 animate-slide-in-right relative">
                        {/* Editor Header */}
                        <div className="h-10 bg-[#252526] flex items-center justify-between px-4 border-b border-black">
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <Code2 size={14} />
                                <span>main.js</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowCodeEditor(false)}
                                    className="p-1 hover:bg-white/10 rounded text-text-muted hover:text-white"
                                    title="Close Editor"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Editor Iframe */}
                        <div className="flex-1 relative">
                            {codeEditorUrl ? (
                                <iframe
                                    ref={iframeRef}
                                    src={codeEditorUrl}
                                    className="w-full h-full border-0"
                                    title="Code Editor"
                                    allow="clipboard-read; clipboard-write"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-text-muted">
                                    <Code2 size={48} className="mb-4 opacity-50" />
                                    <p>Loading Editor environment...</p>
                                </div>
                            )}
                        </div>

                        {/* Editor Status Bar */}
                        <div className="h-6 bg-[#007acc] text-white text-[10px] px-2 flex items-center justify-between">
                            <span>JavaScript</span>
                            <span>Ln 1, Col 1</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden Video Ref for permissions/stream handling if needed explicitly */}
            <video ref={videoRef} className="hidden" autoPlay playsInline muted />
        </div>
    )
}

export default InterviewPage
