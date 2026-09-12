import React, { useState } from 'react';
import { SwapProposal, UserProfile, SkillListing } from '../types';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Check,
  Star,
  MessageSquare,
  Award,
  ArrowUpRight,
  Bookmark,
  Coins,
} from 'lucide-react';
import { GeometricAvatar } from './GeometricAvatar';
import { SafeEmoji } from './SafeEmoji';
const fireConfetti = (opts: Record<string, unknown>) => { void import('canvas-confetti').then((m) => m.default({ particleCount: 40, disableForReducedMotion: true, ...opts })); };

interface MySwapsViewProps {
  proposals: SwapProposal[];
  currentUser: UserProfile;
  savedListings: SkillListing[];
  onAcceptProposal: (proposalId: string) => void;
  onDeclineProposal: (proposalId: string) => void;
  onCompleteSwap: (proposalId: string) => void;
  onOpenReview: (proposal: SwapProposal) => void;
  onOpenChatWithUser: (user: UserProfile) => void;
  onViewListing: (listing: SkillListing) => void;
  onOpenCreditsExplainer?: () => void;
}

export const MySwapsView: React.FC<MySwapsViewProps> = ({
  proposals,
  currentUser,
  savedListings,
  onAcceptProposal,
  onDeclineProposal,
  onCompleteSwap,
  onOpenReview,
  onOpenChatWithUser,
  onViewListing,
  onOpenCreditsExplainer,
}) => {
  const [subTab, setSubTab] = useState<'pending' | 'active' | 'completed' | 'saved'>('pending');

  const pendingProposals = proposals.filter((p) => p.status === 'pending');
  const activeSwaps = proposals.filter((p) => p.status === 'accepted' || p.status === 'active');
  const completedSwaps = proposals.filter((p) => p.status === 'completed');

  const handleAcceptWithConfetti = (id: string) => {
    try {
      fireConfetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4A654E', '#B85D3B', '#385A7C'],
      });
    } catch {
      // ignore
    }
    onAcceptProposal(id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={onOpenCreditsExplainer}
          className="p-5 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xs space-y-1 transition-all hover:border-[var(--theme-primary)] dark:hover:border-[var(--theme-primary-dark)] cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7D7D76] dark:text-[#8E8D86]">
              Earned Swap Credits
            </span>
            <Coins className="w-3.5 h-3.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] group-hover:rotate-12 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              {currentUser.credits}
            </span>
            <span className="text-xs text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold">1 credit = 1 hr class</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xs space-y-1 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7D7D76] dark:text-[#8E8D86]">
            Completed Exchanges
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              {currentUser.completedSwaps}
            </span>
            <span className="text-xs text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] font-semibold">★ {currentUser.rating} average</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--theme-accent)]/10 dark:bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/25 shadow-2xs space-y-1 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]">
            Community Standing
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Award className="w-5 h-5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
            <span className="text-sm font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">Master Artisan Tier</span>
          </div>
        </div>
      </div>

      {/* Main Structural Frame */}
      <div className="bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-5 sm:p-7 space-y-6 min-h-[580px] flex flex-col">
        {/* Sub Tabs */}
        <div className="flex items-center gap-2 border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] pb-3 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setSubTab('pending')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              subTab === 'pending'
                ? 'bg-[var(--theme-primary)] text-white shadow-xs'
                : 'text-[#52524D] dark:text-[#C5C4BE] hover:bg-white dark:hover:bg-[var(--theme-bg-dark)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Proposals ({pendingProposals.length})</span>
          </button>

          <button
            onClick={() => setSubTab('active')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              subTab === 'active'
                ? 'bg-[var(--theme-primary)] text-white shadow-xs'
                : 'text-[#52524D] dark:text-[#C5C4BE] hover:bg-white dark:hover:bg-[var(--theme-bg-dark)]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Active & Scheduled ({activeSwaps.length})</span>
          </button>

          <button
            onClick={() => setSubTab('completed')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              subTab === 'completed'
                ? 'bg-[var(--theme-primary)] text-white shadow-xs'
                : 'text-[#52524D] dark:text-[#C5C4BE] hover:bg-white dark:hover:bg-[var(--theme-bg-dark)]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed History ({completedSwaps.length})</span>
          </button>

          <button
            onClick={() => setSubTab('saved')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              subTab === 'saved'
                ? 'bg-[var(--theme-primary)] text-white shadow-xs'
                : 'text-[#52524D] dark:text-[#C5C4BE] hover:bg-white dark:hover:bg-[var(--theme-bg-dark)]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Wishlist ({savedListings.length})</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 flex flex-col justify-start">
          {subTab === 'pending' && (
            <div className="space-y-4 flex-1 flex flex-col">
              {pendingProposals.length === 0 ? (
                <div className="py-20 px-6 text-center bg-white dark:bg-[var(--theme-bg-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2 flex-1 flex flex-col items-center justify-center">
                  <Clock className="w-8 h-8 text-[#8A8982] dark:text-[#8E8D86] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">No pending proposals right now</p>
                  <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">
                    Explore the discover feed or use the matchmaker to propose your next exchange!
                  </p>
                </div>
              ) : (
                pendingProposals.map((prop) => {
                  const isIncoming = prop.recipient.id === currentUser.id;
                  const partner = isIncoming ? prop.sender : prop.recipient;

                  return (
                    <div
                      key={prop.id}
                      className="bg-white dark:bg-[var(--theme-bg-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-5 sm:p-6 shadow-2xs space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <GeometricAvatar avatar={partner.avatar} name={partner.name} size="lg" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#1F1F1C] dark:text-[#FAF9F5]">{partner.name}</h4>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isIncoming
                                    ? 'bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]'
                                    : 'bg-[var(--theme-bg-light)] dark:bg-[var(--theme-card-dark)] text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]'
                                }`}
                              >
                                {isIncoming ? 'Incoming Request' : 'Sent by You'}
                              </span>
                            </div>
                            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">{partner.tagline}</p>
                          </div>
                        </div>

                        <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">{prop.createdAt}</span>
                      </div>

                      {/* Proposal Exchange Grid */}
                      <div className="p-3.5 bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-card-dark)] rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] block">
                            They Offer:
                          </span>
                          <p className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">{prop.offeredSkill}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] block">
                            In Exchange For:
                          </span>
                          <p className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">{prop.requestedSkill}</p>
                        </div>
                      </div>

                      <p className="text-xs text-[#3D3D38] dark:text-[#D5D4CE] italic bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-card-dark)] p-3 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                        "{prop.message}"
                      </p>

                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-1">
                        <span className="text-[#52524D] dark:text-[#C5C4BE]">
                          Cadence: <strong>{prop.frequency}</strong> • <strong>{prop.format}</strong>
                        </span>

                        {isIncoming ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onDeclineProposal(prop.id)}
                              className="px-3.5 py-2 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] font-semibold text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptWithConfetti(prop.id)}
                              className="px-4 py-2 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept Swap</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onOpenChatWithUser(partner)}
                            className="px-4 py-2 rounded-xl bg-[var(--theme-bg-light)] dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:opacity-80 flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat with {partner.name.split(' ')[0]}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {subTab === 'active' && (
            <div className="space-y-4 flex-1 flex flex-col">
              {activeSwaps.length === 0 ? (
                <div className="py-20 px-6 text-center bg-white dark:bg-[var(--theme-bg-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2 flex-1 flex flex-col items-center justify-center">
                  <Calendar className="w-8 h-8 text-[#8A8982] dark:text-[#8E8D86] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">No active swap sessions right now</p>
                  <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">Accept a pending proposal to start exchanging!</p>
                </div>
              ) : (
                activeSwaps.map((swap) => {
                  const partner = swap.sender.id === currentUser.id ? swap.recipient : swap.sender;

                  return (
                    <div
                      key={swap.id}
                      className="bg-white dark:bg-[var(--theme-bg-dark)] rounded-2xl border border-[var(--theme-primary)]/40 p-5 sm:p-6 shadow-2xs space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <GeometricAvatar avatar={partner.avatar} name={partner.name} size="lg" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#1F1F1C] dark:text-[#FAF9F5]">{partner.name}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                                Active Exchange
                              </span>
                            </div>
                            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">
                              {swap.offeredSkill} ⇄ {swap.requestedSkill}
                            </p>
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          {swap.scheduledDate ? (
                            <div className="px-3 py-1 bg-[var(--theme-accent)]/15 text-[#1F1F1C] dark:text-[#FAF9F5] rounded-xl font-semibold border border-[var(--theme-accent)]/30">
                              📅 Next: {swap.scheduledDate}
                            </div>
                          ) : (
                            <span className="text-[#52524D] dark:text-[#C5C4BE]">Needs scheduling</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenChatWithUser(partner)}
                            className="px-3.5 py-2 rounded-xl bg-[var(--theme-bg-light)] dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:opacity-80 flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Open Chat Room</span>
                          </button>
                        </div>

                        <button
                          onClick={() => onCompleteSwap(swap.id)}
                          className="px-4 py-2 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete Swap & Review</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {subTab === 'completed' && (
            <div className="space-y-4 flex-1 flex flex-col">
              {completedSwaps.length === 0 ? (
                <div className="py-20 px-6 text-center bg-white dark:bg-[var(--theme-bg-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2 flex-1 flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#8A8982] dark:text-[#8E8D86] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">No completed swaps yet</p>
                  <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">Complete an active swap to build your verified review history.</p>
                </div>
              ) : (
                completedSwaps.map((swap) => {
                  const partner = swap.sender.id === currentUser.id ? swap.recipient : swap.sender;

                  return (
                    <div
                      key={swap.id}
                      className="bg-white dark:bg-[var(--theme-bg-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-5 sm:p-6 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GeometricAvatar avatar={partner.avatar} name={partner.name} size="md" />
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#1F1F1C] dark:text-[#FAF9F5]">
                              Exchanged with {partner.name}
                            </h4>
                            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">
                              {swap.offeredSkill} ⇄ {swap.requestedSkill}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold border border-[var(--theme-primary)]/20">
                          ✓ Completed & Verified
                        </span>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => onOpenReview(swap)}
                          className="px-4 py-2 rounded-xl bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/30 text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5] hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
                          <span>Leave Review & Endorse Skill</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {subTab === 'saved' && (
            <div className="space-y-4 flex-1 flex flex-col">
              {savedListings.length === 0 ? (
                <div className="py-20 px-6 text-center bg-white dark:bg-[var(--theme-bg-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2 flex-1 flex flex-col items-center justify-center">
                  <Bookmark className="w-8 h-8 text-[#8A8982] dark:text-[#8E8D86] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">Your wishlist is empty</p>
                  <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">
                    Click the bookmark icon on any skill card in Discover to save it for later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedListings.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => onViewListing(listing)}
                      className="p-4 rounded-2xl bg-white dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] hover:border-[var(--theme-primary)] cursor-pointer shadow-2xs transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ backgroundColor: listing.accentBg || '#E5D9B6' }}
                        >
                          <SafeEmoji emoji={listing.emoji} fallbackCategory={listing.category} size="md" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5] line-clamp-1">{listing.title}</h4>
                          <p className="text-[11px] text-[#52524D] dark:text-[#C5C4BE]">by {listing.user.name}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#7D7D76] dark:text-[#8E8D86]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
