import { useEffect, useState } from 'react'
import Masthead from './components/Masthead.jsx'
import GateDisplay from './components/GateDisplay.jsx'
import CheckIn from './components/CheckIn.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'

function useHashRoute() {
  const read = () => (window.location.hash.replace(/^#\/?/, '') || 'gate')
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => setRoute(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export default function App() {
  const route = useHashRoute()

  // The check-in page is what a student's phone opens — full-bleed, no admin nav.
  if (route === 'checkin') {
    return (<><Masthead /><main className="shell shell-narrow"><CheckIn /></main></>)
  }

  return (
    <>
      <Masthead />
      <nav className="nav" aria-label="Primary">
        <div className="nav-in">
          <button aria-current={route === 'gate' ? 'page' : undefined} onClick={() => { window.location.hash = '#/gate' }}>Gate</button>
          <button aria-current={route === 'admin' ? 'page' : undefined} onClick={() => { window.location.hash = '#/admin' }}>Admin dashboard</button>
        </div>
      </nav>
      <main className="shell">
        {route === 'admin' ? <AdminDashboard /> : <GateDisplay />}
      </main>
    </>
  )
}
