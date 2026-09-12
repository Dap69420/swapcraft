import React, { useEffect } from 'react';
import { SkillListing, UserProfile } from '../types';
import { X, Star, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight, Bookmark, Sparkles, BookOpen } from 'lucide-react';
import { MOCK_REVIEWS } from '../data/mockData';
import { GeometricAvatar } from './GeometricAvatar';
import { SafeEmoji } from './SafeEmoji';

interface SkillDetailModalProps {
  listing: SkillListing | null;
  onClose: () => void;
  onOpenProposal: (listing: SkillListing) => void;
  onOpenChat: (user: UserProfile, listing: SkillListing) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  listing,
  onClose,
  onOpenProposal,
  onOpenChat,
  onToggleSave,
}) => {
  useEffect(() => {
    if (!listing) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [listing, onClose]);

  if (!listing) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={listing.title} onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xl flex flex-col relative my-auto transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="p-5 sm:p-8 bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-[var(--theme-card-dark)] hover:bg-white dark:hover:bg-white/10 text-[#7D7D76] dark:text-[#A8A7A0] hover:text-[#2D2D2A] dark:hover:text-white border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs dark:brightness-[0.85]" style={{ backgroundColor: listing.accentBg || '#E5D9B6' }}
            >
              <SafeEmoji emoji={listing.emoji} fallbackCategory={listing.category} size="2xl" />
            </div>

            <div className="space-y-1 pr-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white dark:bg-[var(--theme-card-dark)] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                  {listing.category}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white dark:bg-[var(--theme-card-dark)] text-[#7D7D76] dark:text-[#A8A7A0] font-medium border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                  {listing.format}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white dark:bg-[var(--theme-card-dark)] text-[#7D7D76] dark:text-[#A8A7A0] font-medium border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                  {listing.level}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] leading-tight">
                {listing.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1 min-h-0">
          {/* Swapper profile banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--theme-bg-light)]/70 dark:bg-[var(--theme-bg-dark)]/70 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            <div className="flex items-center gap-3">
              <GeometricAvatar avatar={listing.user.avatar} name={listing.user.name} size="lg" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] text-sm">{listing.user.name}</h4>
                  {listing.user.verified && (
                    <ShieldCheck className="w-4 h-4 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" aria-label="Verified Peer" />
                  )}
                </div>
                <p className="text-xs text-[#7D7D76] dark:text-[#A8A7A0]">{listing.user.tagline}</p>
                <div className="flex items-center gap-3 text-[11px] text-[#A3A39E] dark:text-[#878680] mt-0.5">
                  <span className="flex items-center gap-1 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] font-semibold">
                    <Star className="w-3 h-3 fill-current text-[var(--theme-accent)]" />
                    {listing.user.rating} ({listing.user.reviewCount} reviews)
                  </span>
                  <span>•</span>
                  <span>{listing.user.completedSwaps} swaps completed</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenChat(listing.user, listing)}
              className="px-3 py-1.5 bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-xl text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:opacity-80 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          </div>

          {/* What I offer */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span className="min-w-0">What I will teach you</span><span className="block normal-case font-semibold break-words line-clamp-2">{listing.offerSkill}</span>
            </h3>
            <p className="text-sm text-[#4D4D47] dark:text-[#D5D4CE] leading-relaxed bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 p-4 rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
              {listing.offerDescription}
            </p>

            {listing.offerTopics && listing.offerTopics.length > 0 && (
              <div className="space-y-2 pt-1">
                <h5 className="text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">Key Topics Covered in Exchange:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {listing.offerTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-[#4D4D47] dark:text-[#D5D4CE] bg-white dark:bg-[var(--theme-card-dark)] p-2.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* What I want in return */}
          <div className="space-y-3 p-4 rounded-2xl bg-[var(--theme-accent)]/10 dark:bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/25">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
              <span>What I am hoping to learn in return</span>
            </h3>
            <p className="text-sm font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">
              {listing.wantSkill}
            </p>
            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] leading-relaxed">
              {listing.wantDescription}
            </p>
          </div>

          {/* Logistics & Availability */}
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
              <span className="text-[10px] uppercase font-bold text-[#A3A39E] dark:text-[#878680] block mb-1">
                Session Cadence
              </span>
              <span className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] break-words min-w-0 block">{listing.sessionDuration}</span>
            </div>
            <div className="p-3 bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
              <span className="text-[10px] uppercase font-bold text-[#A3A39E] dark:text-[#878680] block mb-1">
                Availability
              </span>
              <span className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] break-words min-w-0 block">{listing.availability}</span>
            </div>
          </div>

          {/* Reviews snippet */}
          <div className="space-y-2 pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#A3A39E] dark:text-[#878680]">
                Peer Endorsements & Trust
              </h4>
              <span className="text-xs text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold">
                {listing.user.rating ? `★ ${listing.user.rating.toFixed(1)} Rating` : 'Verified Artisan'}
              </span>
            </div>

            {MOCK_REVIEWS.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs text-[#52524D] dark:text-[#C5C4BE] space-y-1">
                <p className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">Community Swapping Guarantee</p>
                <p className="text-[11px] text-[#7D7D76] dark:text-[#8E8D86]">
                  Every swap is protected by SwapCraft's direct message coordination and zero-monetary barter principles.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {MOCK_REVIEWS.slice(0, 3).map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">{rev.authorName}</span>
                      <div className="flex items-center text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]">
                        {'★'.repeat(rev.rating)}
                      </div>
                    </div>
                    <p className="text-[#7D7D76] dark:text-[#A8A7A0] italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-white dark:bg-[var(--theme-card-dark)] border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={(e) => onToggleSave(listing.id, e)}
            aria-label={listing.saved ? "Remove from wishlist" : "Save to wishlist"}
            aria-pressed={listing.saved}
            className={`px-4 py-3 rounded-2xl border transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer ${
              listing.saved
                ? 'border-[var(--theme-accent)] text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] bg-[var(--theme-accent)]/15'
                : 'border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#7D7D76] dark:text-[#A8A7A0] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${listing.saved ? 'fill-current text-[var(--theme-accent)]' : ''}`} />
            <span className="hidden sm:inline" aria-hidden="true">{listing.saved ? 'Saved' : 'Save to Wishlist'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenProposal(listing);
            }}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-[var(--theme-primary)] hover:opacity-95 text-white text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <span>Propose Skill Swap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
