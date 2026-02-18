import Layout from './components/Layout';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import InterviewSession from './components/InterviewSession.jsx'
import SessionScheduler from './components/SessionScheduler.jsx'
import HomePage from './pages/HomePage.jsx'

import InterviewPage from './pages/InterviewPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'

import SettingsPage from './pages/SettingsPage.jsx'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/results/:sessionId" element={<ResultsPage />} />
          <Route path="/results" element={<ResultsPage />} /> {/* For demo/dev */}
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/interview-session" element={<InterviewSession />} />
          <Route path="/admin/schedule" element={<SessionScheduler />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
