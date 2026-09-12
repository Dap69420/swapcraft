import React, { useState } from 'react';
import { SkillListing, SwapFormat, SwapProposal, UserProfile } from '../types';
import { X, Send, Sparkles } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { SafeEmoji } from './SafeEmoji';
const fireConfetti = (opts: Record<string, unknown>) => { void import('canvas-confetti').then((m) => m.default({ particleCount: 40, disableForReducedMotion: true, ...opts })); };

interface ProposalModalProps {
  listing: SkillListing | null;
  currentUser: UserProfile;
  onClose: () => void;
  onSubmitProposal: (proposal: SwapProposal) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  listing,
  currentUser,
  onClose,
  onSubmitProposal,
}) => {
  if (!listing) return null;

  const [offeredSkill, setOfferedSkill] = useState('UI/UX Design & Botanical Illustration');
  const [customOffer, setCustomOffer] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<SwapFormat>(listing.format || 'Flexible');
  const [frequency, setFrequency] = useState('1 session (75 mins)');
  const [preferredTime, setPreferredTime] = useState('Flexible weekday evenings or weekends');
  const [message, setMessage] = useState(
    `Hi ${listing.user.name.split(' ')[0]}! I would love to learn ${listing.offerSkill} from you. In exchange, I can share ${offeredSkill} and help you with practical exercises.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MY_PRESET_OFFERS = [
    'UI/UX Design & Botanical Illustration',
    'Figma Prototyping & Design Systems',
    'Notion Dashboard & Productivity Setup',
    'Custom Skill (Write your own)',
  ];

  const handleOfferChange = (offer: string) => {
    setOfferedSkill(offer);
    if (offer !== 'Custom Skill (Write your own)') {
      setMessage(
        `Hi ${listing.user.name.split(' ')[0]}! I would love to learn ${listing.offerSkill} from you. In exchange, I can share ${offer} and help you with hands-on practice.`
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalOffer =
      offeredSkill === 'Custom Skill (Write your own)' && customOffer
        ? customOffer
        : offeredSkill;

    const newProposal: SwapProposal = {
      id: `prop-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      sender: currentUser,
      recipient: listing.user,
      offeredSkill: finalOffer,
      requestedSkill: listing.offerSkill,
      message,
      format: selectedFormat,
      frequency,
      preferredTime,
      status: 'pending',
      createdAt: 'Just now',
    };

    try {
      fireConfetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4A654E', '#B85D3B', '#385A7C'],
      });
    } catch {
      // ignore
    }

    onSubmitProposal(newProposal);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xl flex flex-col relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-[var(--theme-card-dark)] hover:bg-white text-[#7D7D76] dark:text-[#C5C4BE] hover:text-[#1F1F1C] dark:hover:text-white border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[var(--theme-primary)] text-white flex items-center justify-center text-sm font-bold shadow-2xs">
              ⇄
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                SwapCraft Exchange Proposal
              </span>
              <h2 className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                Propose Swap with {listing.user.name}
              </h2>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-[var(--theme-card-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs flex items-center justify-between mt-3">
            <div>
              <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86] uppercase font-bold block">
                You will learn:
              </span>
              <span className="font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] text-sm">
                {listing.offerSkill}
              </span>
            </div>
            <SafeEmoji emoji={listing.emoji} fallbackCategory={listing.category} size="xl" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* What will you offer */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1C] dark:text-[#FAF9F5] block">
              1. What skill will you teach {listing.user.name.split(' ')[0]}?
            </label>

            <div className="space-y-1.5">
              {MY_PRESET_OFFERS.map((preset) => (
                <label
                  key={preset}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-colors ${
                    offeredSkill === preset
                      ? 'border-[var(--theme-primary)] dark:border-[var(--theme-primary-dark)] bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] font-semibold'
                      : 'border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[var(--theme-bg-light)]/40 dark:bg-[var(--theme-card-dark)] text-[#52524D] dark:text-[#C5C4BE] hover:bg-white dark:hover:bg-[var(--theme-bg-dark)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="presetOffer"
                    checked={offeredSkill === preset}
                    onChange={() => handleOfferChange(preset)}
                    className="text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                  />
                  <span>{preset}</span>
                </label>
              ))}
            </div>

            {offeredSkill === 'Custom Skill (Write your own)' && (
              <input
                type="text"
                value={customOffer}
                onChange={(e) => setCustomOffer(e.target.value)}
                placeholder="E.g. Sourdough bread starter coaching, French conversation..."
                className="w-full mt-2 px-3 py-2 text-xs rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                required
              />
            )}
          </div>

          {/* Format and cadence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <CustomSelect
                label="2. Exchange Format"
                value={selectedFormat}
                onChange={(val) => setSelectedFormat(val as SwapFormat)}
                options={[
                  { value: 'Flexible', label: 'Flexible (Online or In-Person)' },
                  { value: 'In-Person', label: 'In-Person Meetup (Portland area)' },
                  { value: 'Online', label: 'Online Video (Live Room)' },
                ]}
              />
            </div>

            <div>
              <CustomSelect
                label="3. Proposed Cadence"
                value={frequency}
                onChange={(val) => setFrequency(val)}
                options={[
                  { value: '1 session (75 mins)', label: '1 Session (75 mins)' },
                  { value: '2 sessions (60 mins each)', label: '2 Sessions (60 mins each)' },
                  { value: 'Weekly (3 weeks)', label: 'Weekly (3 weeks)' },
                  { value: 'Ongoing monthly exchange', label: 'Ongoing monthly exchange' },
                ]}
              />
            </div>
          </div>

          {/* Personal message */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1C] dark:text-[#FAF9F5] block">
              4. Introductory Note & Learning Goals
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] leading-relaxed resize-none"
              placeholder="Introduce yourself and outline your learning goals..."
              required
            />
          </div>

          {/* Zero-fee pledge note */}
          <div className="p-3 rounded-2xl bg-[var(--theme-accent)]/10 dark:bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/25 text-[11px] text-[#1F1F1C] dark:text-[#FAF9F5] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] shrink-0" />
            <span>
              SwapCraft Knowledge Pledge: Both parties invest equal learning time. Pure knowledge exchange.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-95 transition-all shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Swap Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
