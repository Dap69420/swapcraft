import React, { useState, useMemo, useEffect, useRef, useDeferredValue, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  SkillListing,
  SkillCategory,
  SwapFormat,
  ExperienceLevel,
  SwapProposal,
  Conversation,
  CommunityCircle,
  CircleDiscussionMessage,
  UserProfile,
  Review,
  AppNotification,
} from './types';
import {
  CURRENT_USER,
  INITIAL_SKILLS,
  INITIAL_PROPOSALS,
  INITIAL_CONVERSATIONS,
  INITIAL_COMMUNITIES,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { Navbar, NavTab } from './components/Navbar';
import { SkillDetailModal } from './components/SkillDetailModal';
import { ProposalModal } from './components/ProposalModal';
import { PostSkillModal } from './components/PostSkillModal';
import { AuthModal } from './components/AuthModal';
import { ReviewModal } from './components/ReviewModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Toast, ToastMessage } from './components/Toast';
import { ColorThemeId, DEFAULT_THEME_ID } from './data/themes';
import { PageTransition } from './components/magicui/PageTransition';
import { AIChatProvider } from './context/AIChatContext';
import {
  signOutSupabase,
  fetchSkillsFromDb,
  saveSkillToDb,
  fetchProposalsFromDb,
  saveProposalToDb,
  updateProposalStatusInDb,
  fetchCirclesFromDb,
  saveCircleToDb,
  fetchUserProfileFromDb,
  syncUserProfileToDb,
  getSupabase,
  isSupabaseConfigured,
} from './lib/supabase';

// Modular Pages (lazy-split to keep initial bundle small)
const DiscoverPage = lazy(() => import('./pages/DiscoverPage').then((m) => ({ default: m.DiscoverPage })));
const MatchmakerPage = lazy(() => import('./pages/MatchmakerPage').then((m) => ({ default: m.MatchmakerPage })));
const CirclesPage = lazy(() => import('./pages/CirclesPage').then((m) => ({ default: m.CirclesPage })));
const SwapsPage = lazy(() => import('./pages/SwapsPage').then((m) => ({ default: m.SwapsPage })));
const MessagesPage = lazy(() => import('./pages/MessagesPage').then((m) => ({ default: m.MessagesPage })));
const CreditsPage = lazy(() => import('./pages/CreditsPage').then((m) => ({ default: m.CreditsPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const MyPostsPage = lazy(() => import('./pages/MyPostsPage').then((m) => ({ default: m.MyPostsPage })));
const AIChatBot = lazy(() => import('./components/AIChatBot').then((m) => ({ default: m.AIChatBot })));
const RobloxAuthLanding = lazy(() => import('./components/RobloxAuthLanding').then((m) => ({ default: m.RobloxAuthLanding })));
const PageFallback = () => (<div className="flex items-center justify-center py-16 text-sm text-[#7D7D76] dark:text-[#A8A7A0]" aria-live="polite">Loading…</div>);

const CATEGORIES: SkillCategory[] = [
  'All',
  'Technology',
  'Culinary Arts',
  'Visual Arts',
  'Languages',
  'Wellness & Fitness',
  'Music & Audio',
  'Crafts & DIY',
  'Business & Writing',
];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Map route to active nav tab
  const activeTab: NavTab = useMemo(() => {
    const path = location.pathname.replace(/^\//, '').toLowerCase();
    if (path === '' || path === 'discover') return 'discover';
    if (path === 'matchmaker') return 'matchmaker';
    if (path === 'circles' || path === 'community') return 'community';
    if (path === 'my-posts' || path === 'posts') return 'my-posts';
    if (path === 'swaps' || path === 'my-swaps') return 'my-swaps';
    if (path === 'messages') return 'messages';
    if (path === 'credits') return 'credits';
    if (path === 'profile') return 'profile';
    return 'discover';
  }, [location.pathname]);

  const handleTabChange = (tab: NavTab) => {
    switch (tab) {
      case 'discover':
        navigate('/discover');
        break;
      case 'matchmaker':
        navigate('/matchmaker');
        break;
      case 'community':
        navigate('/circles');
        break;
      case 'my-posts':
        navigate('/my-posts');
        break;
      case 'my-swaps':
        navigate('/swaps');
        break;
      case 'messages':
        navigate('/messages');
        break;
      case 'credits':
        navigate('/credits');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/discover');
    }
  };

  // Theme Light/Dark Mode (Light mode default)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('swapcraft_theme');
      if (savedTheme === 'dark') return true;
      if (savedTheme === 'light') return false;
    }
    return false; // Default to Light Mode
  });

  // Color Palette Themes (Botanical Sage, Warm Terracotta, Nordic Indigo, Golden Ochre, Heather Plum)
  const [currentTheme, setCurrentTheme] = useState<ColorThemeId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swapcraft_color_theme');
      if (
        saved &&
        ['sage', 'terracotta', 'indigo', 'amber', 'amethyst'].includes(saved)
      ) {
        return saved as ColorThemeId;
      }
    }
    return DEFAULT_THEME_ID;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('swapcraft_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('swapcraft_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('swapcraft_color_theme', currentTheme);
  }, [currentTheme]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Helper to load persisted real user profile from localStorage
  const getInitialUser = (): UserProfile => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('swapcraft_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.id && parsed.name) {
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to parse saved user:', e);
        }
      }
    }
    return {
      id: `user-${Date.now()}`,
      name: 'Artisan',
      avatar: 'shape:sun:terracotta',
      tagline: 'Peer Swapper & Artisan',
      location: 'Community Hub',
      rating: 5.0,
      reviewCount: 0,
      completedSwaps: 0,
      responseTime: '< 15 mins',
      verified: true,
      memberSince: 'Today',
      bio: 'Excited to exchange crafts, knowledge, and creative skills!',
      topBadges: ['Email Verified', 'New Artisan'],
      credits: 5,
    };
  };

  // Core App State: Authenticated only if explicitly marked true AND has saved user data
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('swapcraft_authenticated');
      const savedUser = localStorage.getItem('swapcraft_user');
      return savedAuth === 'true' && savedUser !== null;
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(getInitialUser);
  const [listings, setListings] = useState<SkillListing[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swapcraft_listings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to parse saved listings:', e);
        }
      }
    }
    return INITIAL_SKILLS;
  });

  const [proposals, setProposals] = useState<SwapProposal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swapcraft_proposals');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved proposals:', e);
        }
      }
    }
    return INITIAL_PROPOSALS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swapcraft_conversations');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved conversations:', e);
        }
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string>('conv-ai');

  const [circles, setCircles] = useState<CommunityCircle[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swapcraft_circles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to parse saved circles:', e);
        }
      }
    }
    return INITIAL_COMMUNITIES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swapcraft_notifications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved notifications:', e);
        }
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Automatically persist user profile changes whenever currentUser or authentication state updates
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      localStorage.setItem('swapcraft_user', JSON.stringify(currentUser));
      localStorage.setItem('swapcraft_authenticated', 'true');
    }
  }, [currentUser, isAuthenticated]);

  // Persist real data collections (debounced to avoid JSON churn on every keystroke/stream)
  const persistTimer = useRef<number | null>(null);
  const persistDebounced = (key: string, value: unknown) => {
    if (persistTimer.current) window.clearTimeout(persistTimer.current);
    persistTimer.current = window.setTimeout(() => {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }, 800);
  };
  const persistSnapshot = useRef({ listings, proposals, conversations, circles, notifications });
  persistSnapshot.current = { listings, proposals, conversations, circles, notifications };
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const s = persistSnapshot.current;
        localStorage.setItem('swapcraft_listings', JSON.stringify(s.listings));
        localStorage.setItem('swapcraft_proposals', JSON.stringify(s.proposals));
        localStorage.setItem('swapcraft_conversations', JSON.stringify(s.conversations));
        localStorage.setItem('swapcraft_circles', JSON.stringify(s.circles));
        localStorage.setItem('swapcraft_notifications', JSON.stringify(s.notifications));
      } catch {}
    }, 800);
    return () => window.clearTimeout(id);
  }, [listings, proposals, conversations, circles, notifications]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('All');
  const [selectedFormat, setSelectedFormat] = useState<SwapFormat | 'All'>('All');
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | 'All'>('All');
  const [onlySaved, setOnlySaved] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'recent' | 'rating'>('featured');

  // Modals & DB State
  const [selectedListing, setSelectedListing] = useState<SkillListing | null>(null);
  const [proposalListing, setProposalListing] = useState<SkillListing | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reviewProposal, setReviewProposal] = useState<SwapProposal | null>(null);
  const [profileModalUser, setProfileModalUser] = useState<UserProfile | null>(null);
  const [isDbSyncing, setIsDbSyncing] = useState(false);

  // Database Synchronizer for Supabase
  const refreshFromDatabase = async () => {
    if (!isSupabaseConfigured()) return;
    setIsDbSyncing(true);
    try {
      const [remoteSkills, remoteProposals, remoteCircles] = await Promise.all([
        fetchSkillsFromDb(),
        fetchProposalsFromDb(),
        fetchCirclesFromDb(),
      ]);

      if (remoteSkills && remoteSkills.length > 0) {
        setListings(remoteSkills);
      }
      if (remoteProposals && remoteProposals.length > 0) {
        setProposals(remoteProposals);
      }
      if (remoteCircles && remoteCircles.length > 0) {
        setCircles(remoteCircles);
      }
      if (currentUser?.id) {
        const remoteUser = await fetchUserProfileFromDb(currentUser.id);
        if (remoteUser) {
          setCurrentUser((prev) => ({ ...prev, ...remoteUser }));
        }
      }
    } catch (err) {
      console.warn('Database initial sync warning:', err);
    } finally {
      setIsDbSyncing(false);
    }
  };

  // Initial Supabase Sync and Realtime Listeners (debounced, abort-safe)
  useEffect(() => {
    const ac = new AbortController();
    if (!ac.signal.aborted) refreshFromDatabase();

    const client = getSupabase();
    if (!client) return () => ac.abort();

    // Sync initial profile stats to database
    if (currentUser?.id) {
      syncUserProfileToDb(currentUser).catch(console.warn);
    }

    // Subscribe to Postgres database changes in real time (debounced to avoid fetch storms)
    let rtTimer: number | null = null;
    const schedule = (fn: () => void) => { if (rtTimer) window.clearTimeout(rtTimer); rtTimer = window.setTimeout(fn, 1000); };
    const channel = client
      .channel('swapcraft-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skill_listings' }, () => {
        schedule(async () => { if (ac.signal.aborted) return; const updatedSkills = await fetchSkillsFromDb(); if (updatedSkills) setListings(updatedSkills); });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'swap_proposals' }, () => {
        schedule(async () => { if (ac.signal.aborted) return; const updatedProps = await fetchProposalsFromDb(); if (updatedProps) setProposals(updatedProps); });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_circles' }, () => {
        schedule(async () => { if (ac.signal.aborted) return; const updatedCircles = await fetchCirclesFromDb(); if (updatedCircles) setCircles(updatedCircles); });
      })
      .subscribe();

    return () => {
      ac.abort();
      if (rtTimer) window.clearTimeout(rtTimer);
      client.removeChannel(channel);
    };
  }, []);

  // Notifications handlers
  const handleMarkNotifAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Marked all notifications as read');
  };

  const handleClearNotifs = () => {
    setNotifications([]);
    addToast('Cleared all notifications');
  };

  const handleSignOut = () => {
    signOutSupabase().catch(() => {});
    setIsAuthenticated(false);
    localStorage.setItem('swapcraft_authenticated', 'false');
    localStorage.removeItem('swapcraft_user');
    addToast('Signed out of SwapCraft');
  };

  const handleAuthSuccess = (user: UserProfile, isNewUser = false) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('swapcraft_authenticated', 'true');
    localStorage.setItem('swapcraft_user', JSON.stringify(user));
    addToast(
      isNewUser
        ? `Welcome to SwapCraft, ${user.name}! +5 Welcome Credits unlocked.`
        : `Signed in as ${user.name}`
    );
  };

  // Helper toast notification
  const addToast = (text: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, text, type: 'success' }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const peerListings = listings.filter(
      (item) => item.user.id !== currentUser.id && item.user.name !== currentUser.name
    );
    const counts: Record<string, number> = { All: peerListings.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = peerListings.filter((item) => item.category === cat).length;
      }
    });
    return counts;
  }, [listings, currentUser]);

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Exclude current user's own listings from discovery/swap suggestions
        if (item.user.id === currentUser.id || item.user.name === currentUser.name) {
          return false;
        }
        // Category
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }
        // Format
        if (selectedFormat !== 'All' && item.format !== selectedFormat) {
          return false;
        }
        // Level
        if (selectedLevel !== 'All' && item.level !== selectedLevel) {
          return false;
        }
        // Saved wishlist filter
        if (onlySaved && !item.saved) {
          return false;
        }
        // Text Search (deferred to keep typing smooth)
        if (deferredQuery.trim()) {
          const q = deferredQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchOffer = item.offerSkill.toLowerCase().includes(q);
          const matchOfferDesc = item.offerDescription.toLowerCase().includes(q);
          const matchWant = item.wantSkill.toLowerCase().includes(q);
          const matchWantDesc = item.wantDescription.toLowerCase().includes(q);
          const matchUser = item.user.name.toLowerCase().includes(q);
          const matchTagline = item.user.tagline.toLowerCase().includes(q);
          const matchTopics = item.offerTopics.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchOffer && !matchOfferDesc && !matchWant && !matchWantDesc && !matchUser && !matchTagline && !matchTopics) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return b.id.localeCompare(a.id);
        }
        if (sortBy === 'rating') {
          return b.user.rating - a.user.rating;
        }
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [listings, currentUser, selectedCategory, selectedFormat, selectedLevel, onlySaved, deferredQuery, sortBy]);

  // Actions
  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newSaved = !item.saved;
          addToast(newSaved ? 'Saved to your Wishlist!' : 'Removed from Wishlist.');
          return { ...item, saved: newSaved };
        }
        return item;
      })
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedFormat('All');
    setSelectedLevel('All');
    setSearchQuery('');
    setOnlySaved(false);
    setSortBy('featured');
    addToast('Filters reset to default.');
  };

  const handlePostSkill = (newListing: SkillListing) => {
    setListings([newListing, ...listings]);
    setIsPostModalOpen(false);
    saveSkillToDb(newListing).catch(console.warn);
    addToast('Your skill listing is now live in the community!');
  };

  const handleSubmitProposal = (newProposal: SwapProposal) => {
    setProposals([newProposal, ...proposals]);
    setProposalListing(null);
    saveProposalToDb(newProposal).catch(console.warn);
    addToast(`Proposal sent to ${newProposal.recipient.name}!`);
  };

  const handleAcceptProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'accepted' as const, scheduledDate: 'Tomorrow at 3:00 PM' } : p))
    );
    updateProposalStatusInDb(proposalId, 'accepted').catch(console.warn);
    addToast('Proposal accepted! Swap session created.');
  };

  const handleDeclineProposal = (proposalId: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== proposalId));
    updateProposalStatusInDb(proposalId, 'declined').catch(console.warn);
    addToast('Proposal declined.');
  };

  const handleCompleteSwap = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'completed' as const } : p))
    );
    updateProposalStatusInDb(proposalId, 'completed').catch(console.warn);
    const updatedUser = {
      ...currentUser,
      credits: currentUser.credits + 1,
      completedSwaps: currentUser.completedSwaps + 1,
    };
    setCurrentUser(updatedUser);
    syncUserProfileToDb(updatedUser).catch(console.warn);
    addToast('Swap marked complete! +1 Karma Credit earned.');
  };

  const handleSubmitReview = (_review: Review) => {
    setReviewProposal(null);
    addToast('Review & badge endorsement published to their profile!');
  };

  const handleQuickChat = (targetUser: UserProfile, contextListing?: SkillListing) => {
    let existingConv = conversations.find((c) => c.participant.id === targetUser.id);
    if (!existingConv) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        participant: targetUser,
        lastMessage: 'Started conversation',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        listingContext: contextListing ? { id: contextListing.id, title: contextListing.title } : undefined,
        messages: [
          {
            id: `m-${Date.now()}`,
            senderId: currentUser.id,
            text: `Hi ${targetUser.name.split(' ')[0]}! I'd love to coordinate a knowledge swap session with you.`,
            timestamp: 'Just now',
          },
        ],
      };
      setConversations([newConv, ...conversations]);
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(existingConv.id);
    }
    setSelectedListing(null);
    navigate('/messages');
  };

  const handleSendMessage = (convId: string, text: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  const handleToggleJoinCircle = (circleId: string) => {
    setCircles((prev) =>
      prev.map((c) => {
        if (c.id === circleId) {
          const isJoined = c.joined;
          addToast(isJoined ? `Left ${c.title}` : `RSVP confirmed for ${c.title}!`);
          const updatedCircle = {
            ...c,
            joined: !isJoined,
            attendeesCount: isJoined ? c.attendeesCount - 1 : c.attendeesCount + 1,
          };
          saveCircleToDb(updatedCircle).catch(console.warn);
          return updatedCircle;
        }
        return c;
      })
    );
  };

  const handleHostCircle = (newCircle?: CommunityCircle) => {
    if (newCircle) {
      setCircles((prev) => [newCircle, ...prev]);
      saveCircleToDb(newCircle).catch(console.warn);
      addToast(`Created workshop circle: ${newCircle.title}!`);
    } else {
      setIsPostModalOpen(true);
    }
  };

  // User-authored posts and circles filtering (so user doesn't see their own in suggestions/discovery)
  const myListings = useMemo(() => {
    return listings.filter(
      (l) => l.user.id === currentUser.id || l.user.name === currentUser.name
    );
  }, [listings, currentUser]);

  const myHostedCircles = useMemo(() => {
    return circles.filter(
      (c) => c.host.id === currentUser.id || c.host.name === currentUser.name
    );
  }, [circles, currentUser]);

  const mySentProposals = useMemo(() => {
    return proposals.filter(
      (p) => p.sender.id === currentUser.id || p.sender.name === currentUser.name
    );
  }, [proposals, currentUser]);

  const myPostsCount = myListings.length + myHostedCircles.length;

  const discoverCircles = useMemo(() => {
    return circles.filter(
      (c) => c.host.id !== currentUser.id && c.host.name !== currentUser.name
    );
  }, [circles, currentUser]);

  const handleDeleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    addToast('Skill offering removed from SwapCraft.');
  };

  const handleUpdateListing = (updated: SkillListing) => {
    setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    addToast('Skill offering updated.');
  };

  const handleCancelCircle = (id: string) => {
    setCircles((prev) => prev.filter((c) => c.id !== id));
    addToast('Workshop circle canceled.');
  };

  const handleCancelProposal = (id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    addToast('Swap proposal withdrawn.');
  };

  const handleAddCircleDiscussionMessage = (circleId: string, message: CircleDiscussionMessage) => {
    setCircles((prev) =>
      prev.map((c) =>
        c.id === circleId
          ? {
              ...c,
              discussion: [...(c.discussion || []), message],
            }
          : c
      )
    );
    addToast('Message posted to Circle hub.');
  };

  const pendingProposalsCount = proposals.filter(
    (p) => p.status === 'pending' && p.recipient.id === currentUser.id
  ).length;

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <AIChatProvider
      currentUser={currentUser}
      listings={listings}
      onOpenPostSkillModal={() => setIsPostModalOpen(true)}
      onSelectListing={(l) => setSelectedListing(l)}
      onFilterCategory={(cat) => {
        setSelectedCategory(cat as SkillCategory);
        navigate('/discover');
      }}
      onAddListing={handlePostSkill}
      addToast={addToast}
    >
      <div className="min-h-screen flex flex-col bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] transition-colors duration-200 selection:bg-[var(--theme-primary)] selection:text-white">
        {!isAuthenticated ? (
          /* Landing for signed-out visitors */
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<PageFallback />}><RobloxAuthLanding
              onLoginSuccess={(user) => handleAuthSuccess(user, false)}
              onSignUpSuccess={(user) => handleAuthSuccess(user, true)}
              onOpenSkillDetail={(l) => setSelectedListing(l)}
              featuredSkills={listings.slice(0, 6)}
            /></Suspense>
          </div>
        ) : (
          /* App layout for signed-in users */
          <>
            {/* Top Navbar with Fluid Navigation, Notifications, & Theming */}
            <Navbar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              currentUser={currentUser}
              pendingCount={pendingProposalsCount}
              unreadCount={totalUnreadMessages}
              myPostsCount={myPostsCount}
              notifications={notifications}
              onMarkNotifAsRead={handleMarkNotifAsRead}
              onMarkAllNotifsAsRead={handleMarkAllNotifsAsRead}
              onClearNotifs={handleClearNotifs}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              currentTheme={currentTheme}
              onSelectTheme={setCurrentTheme}
              onPostSkillClick={() => setIsPostModalOpen(true)}
              onProfileClick={() => navigate('/profile')}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onSignOut={handleSignOut}
            />

            {/* Main Multi-Page Route Container with Page Animations */}
            <main className="flex-1 flex flex-col">
              <PageTransition pageKey={location.pathname}>
                <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <DiscoverPage
                        listings={listings}
                        filteredListings={filteredListings}
                        currentUser={currentUser}
                        activeProposals={proposals.filter((p) => p.status === 'pending' || p.status === 'accepted')}
                        trendingCircles={discoverCircles}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedFormat={selectedFormat}
                        setSelectedFormat={setSelectedFormat}
                        selectedLevel={selectedLevel}
                        setSelectedLevel={setSelectedLevel}
                        onlySaved={onlySaved}
                        setOnlySaved={setOnlySaved}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        categories={CATEGORIES}
                        categoryCounts={categoryCounts}
                        onSelectListing={(l) => setSelectedListing(l)}
                        onQuickPropose={(l) => setProposalListing(l)}
                        onQuickChat={(u, l) => handleQuickChat(u, l)}
                        onToggleSave={handleToggleSave}
                        onResetFilters={handleResetFilters}
                        onPostSkill={() => setIsPostModalOpen(true)}
                        onOpenMatchmaker={() => navigate('/matchmaker')}
                        onViewSwapper={(u) => setProfileModalUser(u)}
                        onNavigateCircles={() => navigate('/circles')}
                        onNavigateCredits={() => navigate('/credits')}
                        onNavigateProfile={() => navigate('/profile')}
                        onNavigateSwaps={() => navigate('/swaps')}
                      />
                    }
                  />
                  <Route
                    path="/discover"
                    element={
                      <DiscoverPage
                        listings={listings}
                        filteredListings={filteredListings}
                        currentUser={currentUser}
                        activeProposals={proposals.filter((p) => p.status === 'pending' || p.status === 'accepted')}
                        trendingCircles={discoverCircles}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedFormat={selectedFormat}
                        setSelectedFormat={setSelectedFormat}
                        selectedLevel={selectedLevel}
                        setSelectedLevel={setSelectedLevel}
                        onlySaved={onlySaved}
                        setOnlySaved={setOnlySaved}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        categories={CATEGORIES}
                        categoryCounts={categoryCounts}
                        onSelectListing={(l) => setSelectedListing(l)}
                        onQuickPropose={(l) => setProposalListing(l)}
                        onQuickChat={(u, l) => handleQuickChat(u, l)}
                        onToggleSave={handleToggleSave}
                        onResetFilters={handleResetFilters}
                        onPostSkill={() => setIsPostModalOpen(true)}
                        onOpenMatchmaker={() => navigate('/matchmaker')}
                        onViewSwapper={(u) => setProfileModalUser(u)}
                        onNavigateCircles={() => navigate('/circles')}
                        onNavigateCredits={() => navigate('/credits')}
                        onNavigateProfile={() => navigate('/profile')}
                        onNavigateSwaps={() => navigate('/swaps')}
                      />
                    }
                  />
                  <Route
                    path="/matchmaker"
                    element={
                      <MatchmakerPage
                        listings={listings}
                        currentUser={currentUser}
                        onSelectListing={(l) => setSelectedListing(l)}
                        onProposeSwap={(l) => setProposalListing(l)}
                      />
                    }
                  />
                  <Route
                    path="/circles"
                    element={
                      <CirclesPage
                        circles={circles}
                        currentUser={currentUser}
                        onToggleJoin={handleToggleJoinCircle}
                        onHostCircle={handleHostCircle}
                        onAddDiscussionMessage={handleAddCircleDiscussionMessage}
                        onContactHost={(u) => handleQuickChat(u)}
                        onNavigateMyPosts={() => navigate('/my-posts')}
                      />
                    }
                  />
                  <Route
                    path="/community"
                    element={<Navigate to="/circles" replace />}
                  />
                  <Route
                    path="/my-posts"
                    element={
                      <MyPostsPage
                        currentUser={currentUser}
                        myListings={myListings}
                        myCircles={myHostedCircles}
                        mySentProposals={mySentProposals}
                        onSelectListing={(l) => setSelectedListing(l)}
                        onPostSkill={() => setIsPostModalOpen(true)}
                        onHostCircle={() => navigate('/circles')}
                        onDeleteListing={handleDeleteListing}
                        onUpdateListing={handleUpdateListing}
                        onCancelCircle={handleCancelCircle}
                        onCancelProposal={handleCancelProposal}
                        onOpenChatWithUser={(u, l) => handleQuickChat(u, l)}
                      />
                    }
                  />
                  <Route
                    path="/posts"
                    element={<Navigate to="/my-posts" replace />}
                  />
                  <Route
                    path="/swaps"
                    element={
                      <SwapsPage
                        proposals={proposals}
                        currentUser={currentUser}
                        savedListings={listings.filter((l) => l.saved)}
                        onAcceptProposal={handleAcceptProposal}
                        onDeclineProposal={handleDeclineProposal}
                        onCompleteSwap={handleCompleteSwap}
                        onOpenReview={(p) => setReviewProposal(p)}
                        onOpenChatWithUser={(u) => handleQuickChat(u)}
                        onViewListing={(l) => setSelectedListing(l)}
                        onOpenCreditsExplainer={() => navigate('/credits')}
                      />
                    }
                  />
                  <Route
                    path="/my-swaps"
                    element={<Navigate to="/swaps" replace />}
                  />
                  <Route
                    path="/messages"
                    element={
                      <MessagesPage
                        conversations={conversations}
                        currentUser={currentUser}
                        activeConversationId={activeConversationId}
                        onSelectConversation={setActiveConversationId}
                        onSendMessage={handleSendMessage}
                        listings={listings}
                        onSelectListing={(l) => setSelectedListing(l)}
                      />
                    }
                  />
                  <Route
                    path="/credits"
                    element={
                      <CreditsPage
                        currentUser={currentUser}
                        onNavigateDiscover={() => navigate('/discover')}
                        onPostSkill={() => setIsPostModalOpen(true)}
                      />
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProfilePage
                        currentUser={currentUser}
                        userListings={listings.filter((l) => l.user.id === currentUser.id)}
                        onUpdateUser={(updated) => {
                          setCurrentUser(updated);
                          syncUserProfileToDb(updated).catch(console.warn);
                          addToast('Profile updated successfully!');
                        }}
                        onOpenCreditsExplainer={() => navigate('/credits')}
                        onOpenAuthModal={() => setIsAuthModalOpen(true)}
                        onPostSkill={() => setIsPostModalOpen(true)}
                        onNavigateMyPosts={() => navigate('/my-posts')}
                        onSignOut={handleSignOut}
                      />
                    }
                  />
                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/discover" replace />} />
                </Routes>
                </Suspense>
              </PageTransition>
            </main>

            {/* Global AI Chatbot Helper in Corner */}
            <Suspense fallback={null}><AIChatBot
              listings={listings}
              onSelectListing={(l) => setSelectedListing(l)}
              onQuickPropose={(l) => setProposalListing(l)}
              onQuickMessage={(l) => handleQuickChat(l.user, l)}
            /></Suspense>
          </>
        )}

        {/* Modals & Drawers */}
        {selectedListing && (
          <SkillDetailModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
            onOpenProposal={(l) => setProposalListing(l)}
            onOpenChat={(u, l) => handleQuickChat(u, l)}
            onToggleSave={handleToggleSave}
          />
        )}

        {proposalListing && (
          <ProposalModal
            listing={proposalListing}
            currentUser={currentUser}
            onClose={() => setProposalListing(null)}
            onSubmitProposal={handleSubmitProposal}
          />
        )}

        {isPostModalOpen && (
          <PostSkillModal
            currentUser={currentUser}
            categories={CATEGORIES}
            onClose={() => setIsPostModalOpen(false)}
            onPostSkill={handlePostSkill}
          />
        )}

        {/* Login & Sign Up & Switch Account Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={currentUser}
          onLoginSuccess={(user) => {
            handleAuthSuccess(user, false);
            setIsAuthModalOpen(false);
          }}
        />

        {reviewProposal && (
          <ReviewModal
            proposal={reviewProposal}
            onClose={() => setReviewProposal(null)}
            onSubmitReview={handleSubmitReview}
          />
        )}

        {profileModalUser && (
          <UserProfileModal
            user={profileModalUser}
            isCurrentUser={profileModalUser.id === currentUser.id}
            onClose={() => setProfileModalUser(null)}
            onUpdateBio={(updatedBio, updatedTagline) => {
              const updatedUser = {
                ...currentUser,
                bio: updatedBio,
                tagline: updatedTagline,
              };
              setCurrentUser(updatedUser);
              syncUserProfileToDb(updatedUser).catch(console.warn);
              addToast('Profile bio updated successfully.');
            }}
          />
        )}

        {/* Toast Notifications */}
        <Toast toasts={toasts} onDismiss={removeToast} />
      </div>
    </AIChatProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
