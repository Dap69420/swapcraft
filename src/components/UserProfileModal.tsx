import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, ShieldCheck, Star, Award } from 'lucide-react';
import { GeometricAvatar } from './GeometricAvatar';

interface UserProfileModalProps {
  user: UserProfile;
  isCurrentUser: boolean;
  onClose: () => void;
  onUpdateBio?: (updatedBio: string, updatedTagline: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isCurrentUser,
  onClose,
  onUpdateBio,
}) => {
  const [bio, setBio] = useState(user.bio);
  const [tagline, setTagline] = useState(user.tagline);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (onUpdateBio) {
      onUpdateBio(bio, tagline);
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xl space-y-5 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <GeometricAvatar avatar={user.avatar} name={user.name} size="xl" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">{user.name}</h3>
                {user.verified && <ShieldCheck className="w-4 h-4 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />}
              </div>
              <p className="text-xs text-[#7D7D76] dark:text-[#8E8D86]">{user.location}</p>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="flex items-center gap-1 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] font-semibold">
                  <Star className="w-3.5 h-3.5 fill-[var(--theme-accent)] text-[var(--theme-accent)]" />
                  {user.rating} ({user.reviewCount} reviews)
                </span>
                <span>•</span>
                <span className="text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold">
                  {user.completedSwaps} Swaps Completed
                </span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-[#7D7D76] dark:text-[#8E8D86] hover:text-[#1F1F1C] dark:hover:text-white rounded-full hover:bg-[var(--theme-bg-light)]/40 dark:hover:bg-[var(--theme-bg-dark)] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Credits & Standing */}
        <div className="p-3.5 bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86] block">
              Skill Bank Balance
            </span>
            <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] text-sm">{user.credits} Karma Credits</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[var(--theme-bg-light)] dark:bg-[var(--theme-card-dark)] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold text-[11px] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            Response time: {user.responseTime}
          </span>
        </div>

        {/* Bio */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-bold uppercase tracking-wider text-[#7D7D76] dark:text-[#8E8D86] block">
              About / Bio
            </label>
            {isCurrentUser && (
              <button
                type="button"
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="text-[11px] font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:underline cursor-pointer"
              >
                {isEditing ? 'Save Bio' : 'Edit Bio'}
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] text-xs font-semibold"
                placeholder="Tagline"
              />
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] text-xs leading-relaxed resize-none"
              />
            </div>
          ) : (
            <p className="text-[#3D3D38] dark:text-[#D5D4CE] leading-relaxed bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] p-3.5 rounded-2xl border border-[#EAE7E1]/60 dark:border-[var(--theme-border-dark)]">
              {user.bio}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="space-y-2 text-xs">
          <label className="font-bold uppercase tracking-wider text-[#7D7D76] dark:text-[#8E8D86] block">
            Community Endorsements
          </label>
          <div className="flex flex-wrap gap-1.5">
            {user.topBadges.map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-1 rounded-xl bg-[var(--theme-accent)]/10 dark:bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/25 text-[#1F1F1C] dark:text-[#FAF9F5] font-semibold flex items-center gap-1"
              >
                <Award className="w-3 h-3 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-95 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
