import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
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
import Settings from './pages/Settings'
import PrivacyPolicy from './pages/PrivacyPolicy'
import DeleteAccountInfo from './pages/DeleteAccountInfo'
import AppHeader from './components/AppHeader'
import './styles/index.css'

// A couple of pages (privacy policy, account deletion) need to be reachable
// as plain public URLs -- Google Play requires this -- without waiting on
// Supabase or requiring a session. Husky has no router, so this is checked
// directly, ahead of all the normal logged-in/out logic below.
const PUBLIC_ROUTES = {
  '/privacy': PrivacyPolicy,
  '/delete-account': DeleteAccountInfo,
}

function App() {
  const PublicRoute = PUBLIC_ROUTES[window.location.pathname]
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

  // Modern Android renders the status bar edge-to-edge (transparent,
  // showing app content through it) rather than honoring a solid
  // setBackgroundColor -- so the only thing that actually matters here is
  // icon color. Husky's background is light everywhere (auth screens, the
  // header, every species theme), so dark icons are the correct universal
  // choice, not white. A no-op on web.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    StatusBar.setStyle({ style: Style.Light })
  }, [])

  // Husky is a single-page app with its own internal navigation state, not
  // URL-based routing -- without this, Android's hardware back button would
  // just exit the app instead of navigating back within it. Drill-down
  // views go back to their parent; top-level views go back to Dashboard;
  // Dashboard itself (the app's "home") exits, matching how native apps
  // are expected to behave.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listenerPromise = CapacitorApp.addListener('backButton', () => {
      if (passwordRecovery) return

      if (!session) {
        if (authView !== 'login') {
          setAuthView('login')
        } else {
          CapacitorApp.exitApp()
        }
        return
      }

      if (view === 'pet-detail' || view === 'chat') {
        setView(view === 'chat' ? 'inbox' : 'dashboard')
      } else if (view !== 'dashboard') {
        setView('dashboard')
      } else {
        CapacitorApp.exitApp()
      }
    })

    return () => {
      listenerPromise.then((handle) => handle.remove())
    }
  }, [session, authView, view, passwordRecovery])

  async function handleLogout() {
    await supabase.auth.signOut()
    // The auth listener above notices the session is gone and shows Login.
  }

  // Public pages render standalone, regardless of auth state -- checked
  // after the hooks above (so they still run every render, per the rules
  // of hooks) but before any of the session-gated logic below.
  if (PublicRoute) {
    return <PublicRoute />
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
  if (view === 'settings') {
    pageContent = <Settings userEmail={session.user.email} />
  } else if (view === 'browse-pets') {
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
        onSettings={() => setView('settings')}
        onLogout={handleLogout}
      />
      {pageContent}
    </>
  )
}

export default App
