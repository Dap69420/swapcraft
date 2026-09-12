import React, { useState } from 'react';
import { SwapProposal, Review } from '../types';
import { X, Star, Award } from 'lucide-react';
const fireConfetti = (opts: Record<string, unknown>) => { void import('canvas-confetti').then((m) => m.default({ particleCount: 40, disableForReducedMotion: true, ...opts })); };

interface ReviewModalProps {
  proposal: SwapProposal | null;
  onClose: () => void;
  onSubmitReview: (review: Review) => void;
}

const AVAILABLE_ENDORSEMENTS = [
  'Patient Mentor',
  'Deep Domain Knowledge',
  'Clear & Articulate',
  'Hands-on Practical',
  'Warm & Encouraging',
  'Punctual & Prepared',
  'Generous with Resources',
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  proposal,
  onClose,
  onSubmitReview,
}) => {
  if (!proposal) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedEndorsements, setSelectedEndorsements] = useState<string[]>([
    'Patient Mentor',
    'Deep Domain Knowledge',
  ]);

  const partner = proposal.recipient;

  const toggleEndorsement = (tag: string) => {
    if (selectedEndorsements.includes(tag)) {
      setSelectedEndorsements(selectedEndorsements.filter((t) => t !== tag));
    } else {
      setSelectedEndorsements([...selectedEndorsements, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      authorName: 'Alex Morgan',
      authorAvatar: 'geometric:sun:forest',
      rating,
      date: 'Just now',
      comment: comment || 'Fantastic knowledge swap! Invaluable practical insights.',
      skillLearned: proposal.requestedSkill,
      endorsements: selectedEndorsements,
    };

    try {
      fireConfetti({
        particleCount: 50,
        spread: 60,
        colors: ['#4A654E', '#B85D3B', '#385A7C'],
      });
    } catch {
      // ignore
    }

    onSubmitReview(newRev);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xl space-y-5 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
              SwapCraft Peer Endorsement & Karma
            </span>
            <h3 className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              Review Exchange with {partner.name}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#7D7D76] dark:text-[#8E8D86] hover:text-[#1F1F1C] dark:hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star rating */}
          <div className="space-y-1.5 text-center py-2 bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            <span className="text-[11px] font-bold text-[#7D7D76] dark:text-[#8E8D86]">Overall Learning Experience</span>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-[var(--theme-accent)] text-[var(--theme-accent)]'
                        : 'text-[#EAE7E1] dark:text-[var(--theme-border-dark)]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Endorsement badges */}
          <div className="space-y-2">
            <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block">
              Skill Endorsement Badges (Click to award)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_ENDORSEMENTS.map((badge) => {
                const isSelected = selectedEndorsements.includes(badge);
                return (
                  <button
                    type="button"
                    key={badge}
                    onClick={() => toggleEndorsement(badge)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--theme-primary)]/15 border-[var(--theme-primary)] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]'
                        : 'bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#C5C4BE] hover:bg-white dark:hover:bg-[var(--theme-card-dark)]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {badge}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block">
              Testimonial / What did you accomplish?
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="E.g. Sunni was incredibly patient and taught me the authentic aroma extraction technique..."
              className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] resize-none focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#C5C4BE] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--theme-primary)] text-white font-bold hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Submit & Grant Karma Credit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
