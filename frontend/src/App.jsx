import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import AppShell from './components/AppShell.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import AnalyzeWorkspace from './pages/AnalyzeWorkspace.jsx'
import History from './pages/History.jsx'
import Builder from './pages/Builder.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="analyze" element={<AnalyzeWorkspace />} />
        <Route path="history" element={<History />} />
        <Route path="builder" element={<Builder />} />
      </Route>
    </Routes>
  )
}
