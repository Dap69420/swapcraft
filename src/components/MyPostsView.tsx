import React, { useState } from 'react';
import { SkillListing, CommunityCircle, SwapProposal, UserProfile } from '../types';
import {
  Layers,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  MessageSquare,
  Trash2,
  Edit3,
  ExternalLink,
  Send,
  AlertCircle,
  Repeat,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { GeometricAvatar } from './GeometricAvatar';
import { SafeEmoji } from './SafeEmoji';
import { CircleDetailModal } from './CircleDetailModal';

interface MyPostsViewProps {
  currentUser: UserProfile;
  myListings: SkillListing[];
  myCircles: CommunityCircle[];
  mySentProposals: SwapProposal[];
  onSelectListing: (listing: SkillListing) => void;
  onPostSkill: () => void;
  onHostCircle: () => void;
  onDeleteListing: (listingId: string) => void;
  onUpdateListing: (updatedListing: SkillListing) => void;
  onCancelCircle: (circleId: string) => void;
  onCancelProposal: (proposalId: string) => void;
  onOpenChatWithUser: (user: UserProfile, listing?: SkillListing) => void;
}

export const MyPostsView: React.FC<MyPostsViewProps> = ({
  currentUser,
  myListings,
  myCircles,
  mySentProposals,
  onSelectListing,
  onPostSkill,
  onHostCircle,
  onDeleteListing,
  onUpdateListing,
  onCancelCircle,
  onCancelProposal,
  onOpenChatWithUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'skills' | 'circles' | 'proposals'>('skills');
  const [selectedCircleHub, setSelectedCircleHub] = useState<CommunityCircle | null>(null);

  // Edit Listing State
  const [editingListing, setEditingListing] = useState<SkillListing | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editOfferDesc, setEditOfferDesc] = useState('');
  const [editWantSkill, setEditWantSkill] = useState('');
  const [editWantDesc, setEditWantDesc] = useState('');

  const handleStartEdit = (listing: SkillListing) => {
    setEditingListing(listing);
    setEditTitle(listing.title);
    setEditOfferDesc(listing.offerDescription);
    setEditWantSkill(listing.wantSkill);
    setEditWantDesc(listing.wantDescription);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    const updated: SkillListing = {
      ...editingListing,
      title: editTitle.trim(),
      offerDescription: editOfferDesc.trim(),
      wantSkill: editWantSkill.trim(),
      wantDescription: editWantDesc.trim(),
    };

    onUpdateListing(updated);
    setEditingListing(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl p-6 sm:p-8 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-full text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
            <Layers className="w-3.5 h-3.5" />
            <span>Author Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
            My Published Posts & Offerings
          </h1>
          <p className="text-xs sm:text-sm text-[#52524D] dark:text-[#C5C4BE] max-w-xl">
            Here are all craft listings, micro-workshop circles, and outgoing swap proposals initiated by you.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={onHostCircle}
            className="px-4 py-2.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5] hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
            <span>Host Circle</span>
          </button>
          <button
            onClick={onPostSkill}
            className="px-5 py-2.5 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Skill</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'skills'
              ? 'bg-[var(--theme-primary)] text-white shadow-2xs'
              : 'text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>My Published Skills ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('circles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'circles'
              ? 'bg-[var(--theme-primary)] text-white shadow-2xs'
              : 'text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>My Hosted Circles ({myCircles.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('proposals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'proposals'
              ? 'bg-[var(--theme-primary)] text-white shadow-2xs'
              : 'text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>My Sent Proposals ({mySentProposals.length})</span>
        </button>
      </div>

      {/* TAB 1: MY PUBLISHED SKILLS */}
      {activeSubTab === 'skills' && (
        <div className="space-y-4">
          {myListings.length === 0 ? (
            <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">
                No skills published yet
              </h3>
              <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] max-w-sm mx-auto">
                Offer what you know best (pottery, code, languages, sourdough) and swap with artisans near you.
              </p>
              <button
                onClick={onPostSkill}
                className="px-5 py-2.5 bg-[var(--theme-primary)] text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Your First Skill</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-2xl bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-center">
                          <SafeEmoji fallbackCategory={listing.category} size="lg" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                              {listing.category}
                            </span>
                            <span className="text-[10px] font-semibold text-[#7D7D76] dark:text-[#8E8D86]">
                              {listing.level}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm sm:text-base text-[#1F1F1C] dark:text-[#FAF9F5] mt-1 line-clamp-1">
                            {listing.title}
                          </h3>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                        Live on SwapCraft
                      </span>
                    </div>

                    {/* Offer vs Want Summary */}
                    <div className="p-3 bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] block">
                          You Teach:
                        </span>
                        <p className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] line-clamp-1">
                          {listing.offerSkill}
                        </p>
                        <p className="text-[11px] text-[#52524D] dark:text-[#C5C4BE] line-clamp-2 mt-0.5">
                          {listing.offerDescription}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                        <span className="text-[10px] uppercase font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] block">
                          You Seek:
                        </span>
                        <p className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] line-clamp-1">
                          {listing.wantSkill}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                    <button
                      onClick={() => onSelectListing(listing)}
                      className="text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Public Listing</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(listing)}
                        className="p-2 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        title="Edit Skill Listing"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove "${listing.title}"?`)) {
                            onDeleteListing(listing.id);
                          }
                        }}
                        className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY HOSTED CIRCLES */}
      {activeSubTab === 'circles' && (
        <div className="space-y-4">
          {myCircles.length === 0 ? (
            <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">
                No hosted circles yet
              </h3>
              <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] max-w-sm mx-auto">
                Host a weekend micro-workshop or co-working jam. You choose the format, date, and max spots.
              </p>
              <button
                onClick={onHostCircle}
                className="px-5 py-2.5 bg-[var(--theme-primary)] text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Host a Circle</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myCircles.map((circle) => (
                <div
                  key={circle.id}
                  className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                            {circle.category}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] text-[#52524D] dark:text-[#C5C4BE] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center gap-1">
                            {circle.format === 'Online' ? <Video className="w-3 h-3 text-blue-500" /> : <MapPin className="w-3 h-3 text-amber-500" />}
                            {circle.format}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-[#1F1F1C] dark:text-[#FAF9F5] mt-1.5 leading-snug">
                          {circle.title}
                        </h3>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                        Host Controls
                      </span>
                    </div>

                    <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] line-clamp-2">
                      {circle.description}
                    </p>

                    {/* Schedule & Attendance */}
                    <div className="p-3 bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-[#52524D] dark:text-[#C5C4BE]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[var(--theme-primary)]" />
                          {circle.date} ({circle.time})
                        </span>
                        <span className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">
                          {circle.attendeesCount}/{circle.maxAttendees} RSVP'd
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-[var(--theme-primary)]"
                          style={{ width: `${Math.min(100, (circle.attendeesCount / circle.maxAttendees) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                    <button
                      onClick={() => setSelectedCircleHub(circle)}
                      className="px-4 py-2 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-95 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open Workshop Hub</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to cancel the circle "${circle.title}"?`)) {
                          onCancelCircle(circle.id);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel Circle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY OUTGOING SWAP PROPOSALS */}
      {activeSubTab === 'proposals' && (
        <div className="space-y-4">
          {mySentProposals.length === 0 ? (
            <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)]">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">
                No outgoing swap proposals
              </h3>
              <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] max-w-sm mx-auto">
                Discover crafts you want to learn and send a barter proposal to swap your skills!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mySentProposals.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white dark:bg-[var(--theme-card-dark)] rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <GeometricAvatar avatar={prop.recipient.avatar} name={prop.recipient.name} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#1F1F1C] dark:text-[#FAF9F5]">{prop.recipient.name}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              prop.status === 'accepted'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : prop.status === 'completed'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            }`}
                          >
                            {prop.status === 'accepted' ? 'Accepted & Scheduled' : prop.status === 'completed' ? 'Completed' : 'Pending Response'}
                          </span>
                        </div>
                        <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">{prop.recipient.tagline}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">{prop.createdAt}</span>
                  </div>

                  {/* Proposal details */}
                  <div className="p-3 bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] block">
                        You Offered:
                      </span>
                      <p className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">{prop.offeredSkill}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] block">
                        You Requested in Return:
                      </span>
                      <p className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">{prop.requestedSkill}</p>
                    </div>
                  </div>

                  {prop.message && (
                    <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] italic bg-black/2 dark:bg-white/2 p-2.5 rounded-xl">
                      "{prop.message}"
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => onOpenChatWithUser(prop.recipient)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message {prop.recipient.name.split(' ')[0]}</span>
                    </button>

                    {prop.status === 'pending' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Withdraw this swap request?')) {
                            onCancelProposal(prop.id);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Withdraw Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xl space-y-4 my-auto">
            <h3 className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              Edit Skill Offering
            </h3>
            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">Listing Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">What You Teach (Description)</label>
                <textarea
                  rows={3}
                  value={editOfferDesc}
                  onChange={(e) => setEditOfferDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] resize-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">Skill You Seek in Return</label>
                <input
                  type="text"
                  value={editWantSkill}
                  onChange={(e) => setEditWantSkill(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">Seek Description</label>
                <textarea
                  rows={2}
                  value={editWantDesc}
                  onChange={(e) => setEditWantDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="px-4 py-2 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--theme-primary)] text-white font-bold hover:opacity-95 cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Circle Hub Modal */}
      {selectedCircleHub && (
        <CircleDetailModal
          circle={selectedCircleHub}
          currentUser={currentUser}
          onClose={() => setSelectedCircleHub(null)}
          onToggleJoin={() => {}}
          onContactHost={(host) => onOpenChatWithUser(host)}
        />
      )}
    </div>
  );
};
