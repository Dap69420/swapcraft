import React, { useState } from 'react';
import { UserProfile, SkillListing } from '../types';
import {
  Star,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  Award,
  Edit3,
  Plus,
  Trash2,
  HeartHandshake,
  Check,
  Palette,
  LogOut,
  FileText,
} from 'lucide-react';
import { GeometricAvatar } from './GeometricAvatar';
import { PfpChooserModal } from './PfpChooserModal';
import { MOCK_REVIEWS } from '../data/mockData';

interface ProfileViewProps {
  currentUser: UserProfile;
  userListings: SkillListing[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onOpenCreditsExplainer: () => void;
  onOpenAuthModal?: () => void;
  onPostSkill: () => void;
  onNavigateMyPosts?: () => void;
  onSignOut?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  userListings: _userListings,
  onUpdateUser,
  onOpenCreditsExplainer,
  onOpenAuthModal: _onOpenAuthModal,
  onPostSkill,
  onNavigateMyPosts,
  onSignOut,
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio);
  const [taglineInput, setTaglineInput] = useState(currentUser.tagline);
  const [locationInput, setLocationInput] = useState(currentUser.location);
  const [showPfpChooser, setShowPfpChooser] = useState(false);
  
  // Custom skills tags
  const [teachingTags, setTeachingTags] = useState<string[]>([
    'UI/UX Prototyping',
    'Botanical Line Illustration',
    'Design Systems in Figma',
    'Notion Workflow Architecture',
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  const [learningWishlist, setLearningWishlist] = useState<string[]>([
    'Espresso Extraction & Steaming',
    'Conversational Italian Idioms',
    'Handbuilt Stoneware Pottery',
    'Sourdough Hydration & Scoring',
  ]);
  const [newWishInput, setNewWishInput] = useState('');

  const handleSaveProfile = () => {
    onUpdateUser({
      ...currentUser,
      bio: bioInput,
      tagline: taglineInput,
      location: locationInput,
    });
    setIsEditingBio(false);
  };

  const handleAddTeachingTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    setTeachingTags([...teachingTags, newTagInput.trim()]);
    setNewTagInput('');
  };

  const handleRemoveTeachingTag = (tag: string) => {
    setTeachingTags(teachingTags.filter((t) => t !== tag));
  };

  const handleAddWishTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishInput.trim()) return;
    setLearningWishlist([...learningWishlist, newWishInput.trim()]);
    setNewWishInput('');
  };

  const handleRemoveWishTag = (tag: string) => {
    setLearningWishlist(learningWishlist.filter((t) => t !== tag));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Profile Banner / Header Card */}
      <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-6 sm:p-8 relative overflow-hidden shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          {/* Avatar & Core Bio */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative group shrink-0">
              <GeometricAvatar
                avatar={currentUser.avatar}
                name={currentUser.name}
                size="2xl"
                className="border-4 border-white dark:border-[var(--theme-card-dark)] shadow-md cursor-pointer group-hover:opacity-90 transition-opacity"
              />
              <button
                type="button"
                onClick={() => setShowPfpChooser(true)}
                title="Change Geometric PFP"
                className="absolute bottom-0 right-0 p-1.5 bg-[var(--theme-primary)] hover:opacity-95 text-white rounded-full shadow-md transition-colors cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                  {currentUser.name}
                </h1>
                {currentUser.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Peer</span>
                  </span>
                )}
              </div>

              {isEditingBio ? (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={taglineInput}
                    onChange={(e) => setTaglineInput(e.target.value)}
                    placeholder="Short tagline (e.g. UI Designer & Botanical Artist)"
                    className="w-full text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] font-medium"
                  />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="City, Neighborhood"
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] text-[#1F1F1C] dark:text-[#FAF9F5]"
                  />
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                    {currentUser.tagline}
                  </p>
                  <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
                    <span>{currentUser.location}</span>
                    <span>•</span>
                    <span>Member since {currentUser.memberSince}</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={() => setShowPfpChooser(true)}
              className="px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:opacity-80 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Change PFP</span>
            </button>

            {isEditingBio ? (
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingBio(true)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] hover:bg-[var(--theme-bg-light)]/40 dark:hover:bg-[var(--theme-card-dark)] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#7D7D76] dark:text-[#8E8D86]" />
                <span>Edit Info</span>
              </button>
            )}

            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                title="Log Out (View Sign-in Page)"
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
          <div
            onClick={onOpenCreditsExplainer}
            className="p-3 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] cursor-pointer hover:border-[var(--theme-primary)] transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86]">
                Karma Balance
              </span>
              <Coins className="w-3.5 h-3.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] mt-1">
              {currentUser.credits} Credits
            </p>
            <span className="text-[10px] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold flex items-center gap-1">
              <span>View Karma Bank</span>
              <span>→</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86]">
                Peer Rating
              </span>
              <Star className="w-3.5 h-3.5 fill-[var(--theme-accent)] text-[var(--theme-accent)]" />
            </div>
            <p className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] mt-1">
              {currentUser.rating}{' '}
              <span className="text-xs text-[#7D7D76] dark:text-[#8E8D86] font-normal">
                ({currentUser.reviewCount})
              </span>
            </p>
            <span className="text-[10px] text-[#52524D] dark:text-[#C5C4BE]">100% positive</span>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86]">
                Swaps Completed
              </span>
              <HeartHandshake className="w-3.5 h-3.5 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />
            </div>
            <p className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] mt-1">
              {currentUser.completedSwaps}
            </p>
            <span className="text-[10px] text-[#52524D] dark:text-[#C5C4BE]">Reciprocal trades</span>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86]">
                Response Pace
              </span>
              <Clock className="w-3.5 h-3.5 text-[#7D7D76] dark:text-[#8E8D86]" />
            </div>
            <p className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] mt-1">
              {currentUser.responseTime}
            </p>
            <span className="text-[10px] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">Very responsive</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* About Bio Section */}
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-6 space-y-3 shadow-2xs">
            <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              About & Teaching Philosophy
            </h3>
            {isEditingBio ? (
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={4}
                className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:ring-1 focus:ring-[var(--theme-primary)]"
              />
            ) : (
              <p className="text-xs sm:text-sm text-[#52524D] dark:text-[#C5C4BE] leading-relaxed">
                {currentUser.bio}
              </p>
            )}
          </div>

          {/* Skills Offered / Teaching Topics */}
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)]"></span>
                <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                  What You Offer & Teach
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {onNavigateMyPosts && (
                  <button
                    type="button"
                    onClick={onNavigateMyPosts}
                    className="text-xs font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>My Posts & Circles</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onPostSkill}
                  className="text-xs font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Listing</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {teachingTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] flex items-center gap-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeachingTag(tag)}
                    className="text-[#7D7D76] hover:text-[#B2533E] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddTeachingTag} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="Add craft topic (e.g. Wireframing, Line Drawing)..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] text-[#1F1F1C] dark:text-[#FAF9F5]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--theme-primary)] hover:opacity-95 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>

          {/* Learning Wishlist */}
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-accent)]"></span>
              <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                What You Want to Learn (Wishlist)
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {learningWishlist.map((wish) => (
                <span
                  key={wish}
                  className="px-3 py-1.5 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] flex items-center gap-2"
                >
                  <span>{wish}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWishTag(wish)}
                    className="text-[#7D7D76] hover:text-[#B2533E] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddWishTag} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newWishInput}
                onChange={(e) => setNewWishInput(e.target.value)}
                placeholder="Add wishlist goal (e.g. Sourdough scoring, Ableton vocal chains)..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] text-[#1F1F1C] dark:text-[#FAF9F5]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--theme-accent)] text-white text-xs font-bold rounded-xl hover:opacity-90 cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (1 col) - Badges & Endorsements */}
        <div className="space-y-6">
          {/* Top Badges */}
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
              <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                Peer Badges
              </h3>
            </div>

            <div className="space-y-2.5">
              {currentUser.topBadges.map((badge, idx) => (
                <div
                  key={badge}
                  className="p-3 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">{badge}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                    {12 - idx * 3}x
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews Received */}
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                Peer Reviews ({currentUser.reviewCount || 0})
              </h3>
              <span className="text-xs text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] font-bold">
                ★ {currentUser.rating.toFixed(1)}
              </span>
            </div>

            {MOCK_REVIEWS.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-dashed border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-center text-xs text-[#7D7D76] dark:text-[#8E8D86]">
                No reviews yet. Complete your first swap session to receive peer endorsements and reviews!
              </div>
            ) : (
              <div className="space-y-3">
                {MOCK_REVIEWS.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GeometricAvatar avatar={rev.authorAvatar} name={rev.authorName} size="xs" />
                        <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">
                          {rev.authorName}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">{rev.date}</span>
                    </div>
                    <p className="text-[11px] text-[#52524D] dark:text-[#C5C4BE] italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PFP Chooser Modal */}
      {showPfpChooser && (
        <PfpChooserModal
          currentAvatar={currentUser.avatar}
          onClose={() => setShowPfpChooser(false)}
          onSaveAvatar={(newAvatarStr) => {
            onUpdateUser({
              ...currentUser,
              avatar: newAvatarStr,
            });
          }}
        />
      )}
    </div>
  );
};
