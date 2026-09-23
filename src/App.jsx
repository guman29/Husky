import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import PetDetail from './pages/PetDetail'
import BrowsePets from './pages/BrowsePets'
import Training from './pages/Training'
import Reminders from './pages/Reminders'
import SellPet from './pages/SellPet'
import Inbox from './pages/Inbox'
import Chat from './pages/Chat'
import AppHeader from './components/AppHeader'
import './styles/index.css'

function App() {
  // undefined = still checking with Supabase, null = logged out, object = logged in
  const [session, setSession] = useState(undefined)
  const [authView, setAuthView] = useState('login') // 'login' | 'signup' | 'forgot-password'
  // True right after clicking a password-reset email link, until a new
  // password is set -- overrides the normal logged-in/out routing below.
  const [passwordRecovery, setPasswordRecovery] = useState(false)
  // 'dashboard' | 'pet-detail' | 'browse-pets' | 'training' | 'reminders' | 'sell-pet' | 'inbox' | 'chat'
  const [view, setView] = useState('dashboard')
  const [selectedPetId, setSelectedPetId] = useState(null)
  const [activeChat, setActiveChat] = useState(null) // { listingId, otherUserId, otherEmail, petType }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Fires whenever the user logs in, logs out, or their session refreshes,
    // so the UI always reflects Supabase's real auth state. Clicking a
    // password-reset email link fires a PASSWORD_RECOVERY event with a
    // valid (temporary) session already attached -- without this check,
    // that session would just drop the user straight into the Dashboard
    // instead of letting them set a new password.
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    // The auth listener above notices the session is gone and shows Login.
  }

  if (session === undefined) {
    return <p className="page">Loading…</p>
  }

  if (passwordRecovery) {
    return <ResetPassword onDone={() => setPasswordRecovery(false)} />
  }

  if (!session) {
    if (authView === 'signup') {
      return <Signup onSwitchToLogin={() => setAuthView('login')} />
    }
    if (authView === 'forgot-password') {
      return <ForgotPassword onBack={() => setAuthView('login')} />
    }
    return (
      <Login
        onSwitchToSignup={() => setAuthView('signup')}
        onForgotPassword={() => setAuthView('forgot-password')}
      />
    )
  }

  let pageContent
  if (view === 'browse-pets') {
    pageContent = (
      <BrowsePets
        userId={session.user.id}
        onMessageSeller={(listing) => {
          setActiveChat({
            listingId: listing.id,
            otherUserId: listing.seller_id,
            otherEmail: listing.seller_email,
            petType: listing.pet_type,
          })
          setView('chat')
        }}
      />
    )
  } else if (view === 'training') {
    pageContent = <Training userId={session.user.id} />
  } else if (view === 'reminders') {
    pageContent = <Reminders userId={session.user.id} />
  } else if (view === 'sell-pet') {
    pageContent = <SellPet userId={session.user.id} userEmail={session.user.email} />
  } else if (view === 'inbox') {
    pageContent = (
      <Inbox
        userId={session.user.id}
        onOpenChat={(chat) => {
          setActiveChat(chat)
          setView('chat')
        }}
      />
    )
  } else if (view === 'chat') {
    pageContent = (
      <Chat
        userId={session.user.id}
        userEmail={session.user.email}
        listingId={activeChat.listingId}
        otherUserId={activeChat.otherUserId}
        otherEmail={activeChat.otherEmail}
        petType={activeChat.petType}
        onBack={() => setView('inbox')}
      />
    )
  } else if (view === 'pet-detail') {
    pageContent = <PetDetail petId={selectedPetId} onBack={() => setView('dashboard')} />
  } else {
    pageContent = (
      <Dashboard
        userId={session.user.id}
        onSelectPet={(petId) => {
          setSelectedPetId(petId)
          setView('pet-detail')
        }}
        onBrowsePets={() => setView('browse-pets')}
      />
    )
  }

  // Drill-down views (pet-detail, chat) don't have their own nav item, but
  // should still highlight the section they live under.
  const activeNavKey = view === 'pet-detail' ? 'dashboard' : view === 'chat' ? 'inbox' : view

  return (
    <>
      <AppHeader
        active={activeNavKey}
        onDashboard={() => setView('dashboard')}
        onTraining={() => setView('training')}
        onReminders={() => setView('reminders')}
        onBrowsePets={() => setView('browse-pets')}
        onSellPet={() => setView('sell-pet')}
        onInbox={() => setView('inbox')}
        onLogout={handleLogout}
      />
      {pageContent}
    </>
  )
}

export default App
