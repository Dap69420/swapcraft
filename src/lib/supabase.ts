import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SkillListing, UserProfile, SwapProposal, CommunityCircle, Conversation } from '../types';

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env || {};
// Accept unprefixed names (Vercel-private-friendly) with fallback to the
// legacy VITE_ names so existing deployments keep working.
const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

// ----------------------------------------------------
// DATABASE SQL SCHEMA SCRIPT (For Supabase SQL Editor)
// ----------------------------------------------------
export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor to enable persistent tables & RLS

-- 1. Profiles & Stats Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  tagline TEXT,
  location TEXT,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  completed_swaps INTEGER DEFAULT 0,
  response_time TEXT DEFAULT '< 15 mins',
  verified BOOLEAN DEFAULT true,
  member_since TEXT,
  bio TEXT,
  top_badges JSONB DEFAULT '[]'::jsonb,
  credits INTEGER DEFAULT 5,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Skill Listings Table
CREATE TABLE IF NOT EXISTS public.skill_listings (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT DEFAULT '✨',
  accent_bg TEXT DEFAULT '#5E81AC',
  offer_skill TEXT NOT NULL,
  offer_description TEXT,
  offer_topics JSONB DEFAULT '[]'::jsonb,
  want_skill TEXT NOT NULL,
  want_description TEXT,
  want_category TEXT NOT NULL,
  level TEXT DEFAULT 'All Levels',
  format TEXT DEFAULT 'Flexible',
  session_duration TEXT DEFAULT '60 min session',
  availability TEXT DEFAULT 'Weekends & Evenings',
  featured BOOLEAN DEFAULT false,
  user_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Swap Proposals Table
CREATE TABLE IF NOT EXISTS public.swap_proposals (
  id TEXT PRIMARY KEY,
  listing_id TEXT REFERENCES public.skill_listings(id) ON DELETE SET NULL,
  listing_title TEXT,
  sender_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id TEXT,
  sender_data JSONB NOT NULL,
  recipient_data JSONB NOT NULL,
  offered_skill TEXT NOT NULL,
  requested_skill TEXT NOT NULL,
  message TEXT,
  format TEXT DEFAULT 'Flexible',
  frequency TEXT DEFAULT '1 session',
  preferred_time TEXT,
  status TEXT DEFAULT 'pending',
  scheduled_date TEXT,
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Community Circles Table
CREATE TABLE IF NOT EXISTS public.community_circles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  host_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  host_data JSONB NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  attendees_count INTEGER DEFAULT 1,
  max_attendees INTEGER DEFAULT 12,
  format TEXT DEFAULT 'Online',
  description TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  attendee_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Access Policies
-- (DROP lines make the script safe to re-run)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swap_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_circles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert/update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read skill_listings" ON public.skill_listings;
DROP POLICY IF EXISTS "Allow public insert/update/delete skill_listings" ON public.skill_listings;
DROP POLICY IF EXISTS "Allow public read swap_proposals" ON public.swap_proposals;
DROP POLICY IF EXISTS "Allow public insert/update swap_proposals" ON public.swap_proposals;
DROP POLICY IF EXISTS "Allow public read community_circles" ON public.community_circles;
DROP POLICY IF EXISTS "Allow public insert/update community_circles" ON public.community_circles;

CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Allow public read skill_listings" ON public.skill_listings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete skill_listings" ON public.skill_listings FOR ALL USING (true);

CREATE POLICY "Allow public read swap_proposals" ON public.swap_proposals FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update swap_proposals" ON public.swap_proposals FOR ALL USING (true);

CREATE POLICY "Allow public read community_circles" ON public.community_circles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update community_circles" ON public.community_circles FOR ALL USING (true);

-- Enable Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.skill_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.swap_proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_circles;
`;

// ----------------------------------------------------
// DATABASE API HELPERS FOR PROFILES & STATS
// ----------------------------------------------------
export async function syncUserProfileToDb(user: UserProfile): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('profiles').upsert(
      {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        tagline: user.tagline,
        location: user.location,
        rating: user.rating,
        review_count: user.reviewCount,
        completed_swaps: user.completedSwaps,
        response_time: user.responseTime,
        verified: user.verified,
        member_since: user.memberSince,
        bio: user.bio,
        top_badges: user.topBadges,
        credits: user.credits,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.warn('Supabase profiles sync error (make sure table exists):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error syncing profile to Supabase:', err);
    return false;
  }
}

export async function fetchUserProfileFromDb(userId: string): Promise<UserProfile | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.from('profiles').select('*').eq('id', userId).single();
    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      avatar: data.avatar || 'shape:arch:sage',
      tagline: data.tagline || '',
      location: data.location || '',
      rating: Number(data.rating) || 5.0,
      reviewCount: Number(data.review_count) || 0,
      completedSwaps: Number(data.completed_swaps) || 0,
      responseTime: data.response_time || '< 15 mins',
      verified: Boolean(data.verified),
      memberSince: data.member_since || 'Today',
      bio: data.bio || '',
      topBadges: Array.isArray(data.top_badges) ? data.top_badges : [],
      credits: Number(data.credits) ?? 5,
    };
  } catch (err) {
    console.warn('Error fetching profile from Supabase:', err);
    return null;
  }
}

// ----------------------------------------------------
// DATABASE API HELPERS FOR SKILL LISTINGS
// ----------------------------------------------------
export async function fetchSkillsFromDb(): Promise<SkillListing[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('skill_listings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(48);

    if (error) {
      console.warn('Supabase fetch skills error (fallback to local):', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      emoji: row.emoji || '✨',
      accentBg: row.accent_bg || '#5E81AC',
      offerSkill: row.offer_skill,
      offerDescription: row.offer_description || '',
      offerTopics: Array.isArray(row.offer_topics) ? row.offer_topics : [],
      wantSkill: row.want_skill,
      wantDescription: row.want_description || '',
      wantCategory: row.want_category,
      level: row.level,
      format: row.format,
      sessionDuration: row.session_duration || '60 min session',
      availability: row.availability || 'Flexible',
      featured: Boolean(row.featured),
      createdAt: row.created_at,
      user: row.user_data as UserProfile,
    }));
  } catch (err) {
    console.warn('Failed to query Supabase skills:', err);
    return null;
  }
}

export async function saveSkillToDb(skill: SkillListing): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    // Ensure user profile is registered in DB first
    if (skill.user) {
      await syncUserProfileToDb(skill.user);
    }

    const { error } = await client.from('skill_listings').upsert(
      {
        id: skill.id,
        user_id: skill.user?.id || 'user-anon',
        title: skill.title,
        category: skill.category,
        emoji: skill.emoji,
        accent_bg: skill.accentBg,
        offer_skill: skill.offerSkill,
        offer_description: skill.offerDescription,
        offer_topics: skill.offerTopics,
        want_skill: skill.wantSkill,
        want_description: skill.wantDescription,
        want_category: skill.wantCategory,
        level: skill.level,
        format: skill.format,
        session_duration: skill.sessionDuration,
        availability: skill.availability,
        featured: skill.featured || false,
        user_data: skill.user,
        created_at: skill.createdAt || new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.warn('Supabase save skill error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to insert skill into Supabase:', err);
    return false;
  }
}

export async function deleteSkillFromDb(skillId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('skill_listings').delete().eq('id', skillId);
    if (error) {
      console.warn('Supabase delete skill error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete skill from Supabase:', err);
    return false;
  }
}

// ----------------------------------------------------
// DATABASE API HELPERS FOR SWAP PROPOSALS
// ----------------------------------------------------
export async function fetchProposalsFromDb(): Promise<SwapProposal[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('swap_proposals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(48);

    if (error) {
      console.warn('Supabase fetch proposals error:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row) => ({
      id: row.id,
      listingId: row.listing_id,
      listingTitle: row.listing_title || 'Skill Swap',
      sender: row.sender_data as UserProfile,
      recipient: row.recipient_data as UserProfile,
      offeredSkill: row.offered_skill,
      requestedSkill: row.requested_skill,
      message: row.message || '',
      format: row.format,
      frequency: row.frequency || '1 session',
      preferredTime: row.preferred_time || '',
      status: row.status,
      scheduledDate: row.scheduled_date,
      meetingLink: row.meeting_link,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn('Failed to fetch proposals from Supabase:', err);
    return null;
  }
}

export async function saveProposalToDb(proposal: SwapProposal): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    if (proposal.sender) await syncUserProfileToDb(proposal.sender);
    if (proposal.recipient) await syncUserProfileToDb(proposal.recipient);

    const { error } = await client.from('swap_proposals').upsert(
      {
        id: proposal.id,
        listing_id: proposal.listingId,
        listing_title: proposal.listingTitle,
        sender_id: proposal.sender?.id,
        recipient_id: proposal.recipient?.id,
        sender_data: proposal.sender,
        recipient_data: proposal.recipient,
        offered_skill: proposal.offeredSkill,
        requested_skill: proposal.requestedSkill,
        message: proposal.message,
        format: proposal.format,
        frequency: proposal.frequency,
        preferred_time: proposal.preferredTime,
        status: proposal.status,
        scheduled_date: proposal.scheduledDate,
        meeting_link: proposal.meetingLink,
        created_at: proposal.createdAt || new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.warn('Supabase save proposal error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save proposal to Supabase:', err);
    return false;
  }
}

export async function updateProposalStatusInDb(proposalId: string, status: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('swap_proposals')
      .update({ status })
      .eq('id', proposalId);

    if (error) {
      console.warn('Supabase update proposal error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to update proposal in Supabase:', err);
    return false;
  }
}

// ----------------------------------------------------
// DATABASE API HELPERS FOR COMMUNITY CIRCLES
// ----------------------------------------------------
export async function fetchCirclesFromDb(): Promise<CommunityCircle[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('community_circles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(48);

    if (error) {
      console.warn('Supabase fetch circles error:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      host: row.host_data as UserProfile,
      category: row.category,
      date: row.date,
      time: row.time,
      attendeesCount: row.attendees_count || 1,
      maxAttendees: row.max_attendees || 12,
      format: row.format,
      description: row.description || '',
      tags: Array.isArray(row.tags) ? row.tags : [],
    }));
  } catch (err) {
    console.warn('Failed to fetch circles from Supabase:', err);
    return null;
  }
}

export async function saveCircleToDb(circle: CommunityCircle): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    if (circle.host) await syncUserProfileToDb(circle.host);

    const { error } = await client.from('community_circles').upsert(
      {
        id: circle.id,
        title: circle.title,
        host_id: circle.host?.id,
        host_data: circle.host,
        category: circle.category,
        date: circle.date,
        time: circle.time,
        attendees_count: circle.attendeesCount,
        max_attendees: circle.maxAttendees,
        format: circle.format,
        description: circle.description,
        tags: circle.tags,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.warn('Supabase save circle error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save circle to Supabase:', err);
    return false;
  }
}

// ----------------------------------------------------
// AUTH UTILITIES
// ----------------------------------------------------
export async function signInWithGoogleOAuth() {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase is not configured yet. Set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) in settings or env.');
  }
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  return data;
}

export async function sendOtpToEmail(email: string) {
  const client = getSupabase();
  if (!client) {
    return { success: true, simulated: true };
  }
  const { data, error } = await client.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  return { success: true, data, simulated: false };
}

export async function verifyEmailOtpCode(email: string, token: string) {
  const client = getSupabase();
  if (!client) {
    return { user: { email, user_metadata: { name: email.split('@')[0] } }, simulated: true };
  }

  const { data, error } = await client.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error) {
    throw new Error(error.message || 'Invalid or expired verification code.');
  }
  return { user: data.user, session: data.session, simulated: false };
}

export async function signOutSupabase() {
  const client = getSupabase();
  if (client) {
    await client.auth.signOut();
  }
}
