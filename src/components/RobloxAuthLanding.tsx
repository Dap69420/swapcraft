import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Handshake,
  ShieldCheck,
  Coins,
  CheckCircle2,
  Users,
  Compass,
  KeyRound,
  Loader2,
  Palette,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { UserProfile, SkillListing } from '../types';
import {
  GeometricAvatar,
  SHAPE_OPTIONS,
  ShapePattern,
  ColorPalette,
  serializeAvatar,
} from './GeometricAvatar';
import {
  sendOtpToEmail,
  verifyEmailOtpCode,
} from '../lib/supabase';
/* confetti loaded dynamically to avoid main-thread cost */

interface RobloxAuthLandingProps {
  onLoginSuccess: (user: UserProfile) => void;
  onSignUpSuccess?: (user: UserProfile) => void;
  featuredSkills: SkillListing[];
  onOpenSkillDetail?: (skill: SkillListing) => void;
}

export const RobloxAuthLanding: React.FC<RobloxAuthLandingProps> = ({
  onLoginSuccess,
  onSignUpSuccess,
  featuredSkills,
  onOpenSkillDetail,
}) => {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');

  // Sign up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [offerSkill, setOfferSkill] = useState('');
  const [wantSkill, setWantSkill] = useState('');
  const [signupShape, setSignupShape] = useState<ShapePattern>('sun');
  const [signupPalette] = useState<ColorPalette>('terracotta');

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Send OTP handler
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setInfoMessage('');

    try {
      const res = await sendOtpToEmail(email.trim());
      setOtpSent(true);
      if (res.simulated) {
        setInfoMessage('Demo mode: email service not configured — enter any 6+ digit code to continue.');
      } else {
        setInfoMessage(`Verification code sent to ${email.trim()}! Please check your inbox.`);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMessage('Please enter the 8-digit code sent to your email.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await verifyEmailOtpCode(email.trim(), otpCode.trim());
      const supabaseUser = res?.user as any;
      const userName = name.trim() || supabaseUser?.user_metadata?.full_name || supabaseUser?.user_metadata?.name || email.split('@')[0] || 'Artisan';
      const userId = supabaseUser?.id ? `user-${supabaseUser.id}` : `user-${Date.now()}`;

      const newUser: UserProfile = {
        id: userId,
        name: userName,
        avatar: serializeAvatar({ shape: signupShape, palette: signupPalette }),
        tagline: offerSkill ? `${offerSkill} Practitioner` : 'Peer Swapper & Artisan',
        location: 'Community Hub',
        rating: 5.0,
        reviewCount: 0,
        completedSwaps: 0,
        responseTime: '< 15 mins',
        verified: true,
        memberSince: 'Today',
        bio: `Hi, I'm ${userName}! I'm excited to share ${offerSkill || 'skills'} and learn ${wantSkill || 'new crafts'}.`,
        topBadges: ['Email Verified', 'Artisan Swapper', 'Prompt Responder'],
        credits: 5, // Welcome credits
      };

      try {
        const { default: confetti } = await import('canvas-confetti');
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 }, disableForReducedMotion: true });
      } catch {}

      if (authMode === 'signup' && onSignUpSuccess) {
        onSignUpSuccess(newUser);
      } else {
        onLoginSuccess(newUser);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[var(--theme-bg-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] flex flex-col transition-colors">
      {/* Top Simple Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[var(--theme-bg-dark)]/90 backdrop-blur-md border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[var(--theme-primary)] rounded-xl flex items-center justify-center text-white shadow-xs">
            <Handshake className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold font-serif tracking-tight">SwapCraft</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#F3F2EE] dark:bg-[var(--theme-card-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-bold">
            <button
              onClick={() => {
                setAuthMode('signup');
                setOtpSent(false);
                setErrorMessage('');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white dark:bg-[var(--theme-primary)] text-[var(--theme-primary)] dark:text-white shadow-2xs'
                  : 'text-[#6B6A64] dark:text-[#A8A7A0]'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setAuthMode('login');
                setOtpSent(false);
                setErrorMessage('');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white dark:bg-[var(--theme-primary)] text-[var(--theme-primary)] dark:text-white shadow-2xs'
                  : 'text-[#6B6A64] dark:text-[#A8A7A0]'
              }`}
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* Hero and sign-in */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Headline and highlights */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>Zero-Money Peer Skill Exchange</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-[1.15] text-[#1F1F1C] dark:text-[#FAF9F5]">
              Learn Anything. <br />
              <span className="text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                Teach What You Love.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#52524D] dark:text-[#C5C4BE] max-w-xl leading-relaxed">
              SwapCraft is an artisanal community where skills are currency. Trade sourdough baking for React coding, guitar lessons for Italian cooking, and earn Karma credits without spending a cent.
            </p>

            {/* Value Props Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] flex items-center justify-center">
                  <Coins className="w-4 h-4 text-[var(--theme-accent)]" />
                </div>
                <h4 className="font-bold text-sm">Karma Bank</h4>
                <p className="text-xs text-[#6B6A64] dark:text-[#A8A7A0]">1 hour taught = 1 Karma credit to learn anything.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--theme-primary)]" />
                </div>
                <h4 className="font-bold text-sm">AI Matchmaker</h4>
                <p className="text-xs text-[#6B6A64] dark:text-[#A8A7A0]">Instantly pairs reciprocal skills with artisans.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="font-bold text-sm">Group Circles</h4>
                <p className="text-xs text-[#6B6A64] dark:text-[#A8A7A0]">Join live workshops and group craft exchanges.</p>
              </div>
            </div>
          </div>

          {/* Auth card */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] shadow-2xl p-6 sm:p-8 space-y-5">
              {/* Card Header */}
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] text-xs font-bold">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Get 5 Free Karma Credits on Sign Up</span>
                </div>
                <h2 className="text-2xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                  {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                </h2>
                <p className="text-xs text-[#6B6A64] dark:text-[#A8A7A0]">
                  {authMode === 'signup'
                    ? 'Enter your email to receive a login verification code'
                    : 'Sign in to access your swaps, circles & karma ledger'}
                </p>
              </div>

              {/* Error & Info Alerts */}
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {infoMessage && (
                <div className="p-3 rounded-2xl bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/30 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{infoMessage}</span>
                </div>
              )}

              {/* Continue with Google - Coming Soon */}
              <div className="relative group">
                <button
                  type="button"
                  disabled
                  aria-disabled="true" title="Google sign-in is not available yet — please use email code" className="w-full flex items-center justify-between py-3 px-4 rounded-2xl bg-[#F8F7F3] dark:bg-[var(--theme-bg-dark)] border border-[#E0DCD4] dark:border-[var(--theme-border-dark)] font-medium text-xs sm:text-sm text-[#7D7D76] dark:text-[#8E8D86] cursor-not-allowed opacity-80"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                    <Clock className="w-3 h-3" />
                    <span>Coming Soon</span>
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-[#EAE7E1] dark:bg-[var(--theme-border-dark)]" />
                <span className="text-[11px] font-semibold text-[#8E8D86] uppercase tracking-wider">
                  Sign in with email
                </span>
                <div className="flex-1 h-[1px] bg-[#EAE7E1] dark:bg-[var(--theme-border-dark)]" />
              </div>

              {/* Email Form (OTP / Verification Flow) */}
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4 text-left">
                  {authMode === 'signup' && (
                    <>
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-[#52524D] dark:text-[#C5C4BE] mb-1">
                          Full Name / Display Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Maya Chen"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs sm:text-sm text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                        />
                      </div>

                      {/* Avatar shape selector */}
                      <div>
                        <label className="block text-xs font-bold text-[#52524D] dark:text-[#C5C4BE] mb-1">
                          Choose Avatar Shape
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {SHAPE_OPTIONS.slice(0, 6).map((item) => (
                            <button
                              key={item.shape}
                              type="button"
                              onClick={() => setSignupShape(item.shape)}
                              aria-pressed={signupShape === item.shape}
                              aria-label={`Avatar shape ${item.shape}`}
                              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                                signupShape === item.shape
                                  ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 ring-1 ring-[var(--theme-primary)]'
                                  : 'border-[#EAE7E1] dark:border-[var(--theme-border-dark)] hover:border-[#D1CDC4]'
                              }`}
                            >
                              <GeometricAvatar
                                avatar={serializeAvatar({ shape: item.shape, palette: signupPalette })}
                                name="Me"
                                size="sm"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Skills Quick Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-[#52524D] dark:text-[#C5C4BE] mb-1">
                            Skill You Can Teach
                          </label>
                          <input
                            type="text"
                            value={offerSkill}
                            onChange={(e) => setOfferSkill(e.target.value)}
                            placeholder="e.g. Sourdough Baking"
                            className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#52524D] dark:text-[#C5C4BE] mb-1">
                            Skill You Want to Learn
                          </label>
                          <input
                            type="text"
                            value={wantSkill}
                            onChange={(e) => setWantSkill(e.target.value)}
                            placeholder="e.g. Italian Language"
                            className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#52524D] dark:text-[#C5C4BE] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8E8D86] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.org"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs sm:text-sm text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-2xl bg-[var(--theme-primary)] text-white font-bold text-xs sm:text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{authMode === 'signup' ? 'Send Sign-up OTP Code' : 'Send Login OTP Code'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* OTP Verification Screen */
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
                  <div className="p-3 rounded-2xl bg-[#F6F5F0] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[#8E8D86] text-[11px] block">Sent code to</span>
                      <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">{email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#52524D] dark:text-[#C5C4BE] mb-1">
                      Enter 8-Digit Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-[#8E8D86] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        maxLength={8}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="12345678" inputMode="numeric" autoComplete="one-time-code" aria-label="8-digit verification code"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-base font-mono tracking-widest text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full py-3 px-4 rounded-2xl bg-[var(--theme-primary)] text-white font-bold text-xs sm:text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Enter SwapCraft</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Toggle switch between Login / Sign up */}
              <div className="pt-2 text-center">
                {authMode === 'signup' ? (
                  <p className="text-xs text-[#6B6A64] dark:text-[#A8A7A0]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setOtpSent(false);
                        setErrorMessage('');
                      }}
                      className="font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:underline cursor-pointer"
                    >
                      Log in here
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-[#6B6A64] dark:text-[#A8A7A0]">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setOtpSent(false);
                        setErrorMessage('');
                      }}
                      className="font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:underline cursor-pointer"
                    >
                      Sign up for free (+5 CR)
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Popular Crafts in Community preview */}
        <div className="mt-16 pt-12 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif">
                Popular Community Crafts to Learn
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6A64] dark:text-[#A8A7A0]">
                Sign in or create your profile above to propose a swap with these artisans.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredSkills.slice(0, 3).map((skill) => (
              <button
                type="button"
                key={skill.id}
                onClick={() => onOpenSkillDetail?.(skill)}
                className="p-5 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-xs hover:shadow-lg hover:border-[var(--theme-primary)] transition-all cursor-pointer space-y-3.5 text-left w-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <GeometricAvatar avatar={skill.user.avatar} name={skill.user.name} size="sm" />
                    <div>
                      <h5 className="font-bold text-xs">{skill.user.name}</h5>
                      <span className="text-[10px] text-[#7D7D76]">{skill.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                    {skill.level}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm font-serif line-clamp-1">{skill.title}</h4>
                  <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] line-clamp-2 mt-1">
                    {skill.offerDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between text-[11px] font-semibold text-[var(--theme-primary)]">
                  <span className="truncate min-w-0">Wants to learn: {skill.wantSkill}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

