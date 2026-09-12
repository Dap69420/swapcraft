import React, { useState } from 'react';
import { CommunityCircle, SkillCategory, UserProfile, SwapFormat, CircleDiscussionMessage } from '../types';
import { Users, Calendar, Plus, Check, Clock, MapPin, Video, MessageSquare, ArrowRight } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { GeometricAvatar } from './GeometricAvatar';
import { CircleDetailModal } from './CircleDetailModal';
const fireConfetti = (opts: Record<string, unknown>) => { void import('canvas-confetti').then((m) => m.default({ particleCount: 40, disableForReducedMotion: true, ...opts })); };

interface CommunityViewProps {
  circles: CommunityCircle[];
  currentUser: UserProfile;
  onToggleJoin: (circleId: string) => void;
  onHostCircle: (newCircle: CommunityCircle) => void;
  onAddDiscussionMessage?: (circleId: string, message: CircleDiscussionMessage) => void;
  onContactHost?: (host: UserProfile) => void;
  onNavigateMyPosts?: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  circles,
  currentUser,
  onToggleJoin,
  onHostCircle,
  onAddDiscussionMessage,
  onContactHost,
  onNavigateMyPosts,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<SwapFormat | 'All'>('All');
  const [selectedCircleForDetail, setSelectedCircleForDetail] = useState<CommunityCircle | null>(null);

  // Host modal state
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SkillCategory>('Visual Arts');
  const [newFormat, setNewFormat] = useState<SwapFormat>('In-Person');
  const [newDate, setNewDate] = useState('Saturday, 2:00 PM');
  const [newTime, setNewTime] = useState('2:00 PM - 4:00 PM');
  const [newLocationOrLink, setNewLocationOrLink] = useState('');
  const [newMaterials, setNewMaterials] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newMax, setNewMax] = useState(10);

  const ALL_TAGS = ['All', 'Hands-on', 'Baking', 'React', 'Pottery', 'Outdoor Studio', 'Live Code', 'All Levels'];

  // Exclude current user's hosted circles from discovery feed
  const discoverCircles = circles.filter(
    (c) => c.host.id !== currentUser.id && c.host.name !== currentUser.name
  );

  const myHostedCount = circles.filter(
    (c) => c.host.id === currentUser.id || c.host.name === currentUser.name
  ).length;

  const filteredCircles = discoverCircles.filter((c) => {
    if (selectedTag !== 'All' && !c.tags.includes(selectedTag)) return false;
    if (selectedFormat !== 'All' && c.format !== selectedFormat) return false;
    return true;
  });

  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const materialsArray = newMaterials
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const createdCircle: CommunityCircle = {
      id: `circle-${Date.now()}`,
      title: newTitle.trim(),
      host: currentUser,
      category: newCategory,
      date: newDate.trim(),
      time: newTime.trim(),
      attendeesCount: 1,
      maxAttendees: newMax,
      format: newFormat,
      locationOrLink: newLocationOrLink.trim() || (newFormat === 'Online' ? 'https://meet.google.com' : 'Community Studio'),
      materials: materialsArray.length > 0 ? materialsArray : ['Bring your enthusiasm & questions'],
      description: newDescription.trim(),
      tags: ['Community Hosted', 'Hands-on', 'All Levels'],
      joined: true,
      attendees: [currentUser],
      discussion: [
        {
          id: `msg-${Date.now()}`,
          circleId: `circle-${Date.now()}`,
          author: currentUser,
          text: `Welcome everyone! Excited to host this ${newFormat.toLowerCase()} session. Feel free to ask questions here!`,
          timestamp: 'Just now',
        },
      ],
    };

    try {
      fireConfetti({
        particleCount: 40,
        spread: 60,
        colors: ['#4A654E', '#B85D3B', '#385A7C'],
      });
    } catch {
      // ignore
    }

    onHostCircle(createdCircle);
    setIsHostModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewLocationOrLink('');
    setNewMaterials('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-[var(--theme-bg-light)] dark:bg-[var(--theme-card-dark)] rounded-3xl p-6 sm:p-8 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden transition-colors">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-full text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
            <Users className="w-3.5 h-3.5" />
            <span>Community Knowledge Circles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
            Micro-Workshops & Group Swaps
          </h2>
          <p className="text-xs sm:text-sm text-[#52524D] dark:text-[#C5C4BE]">
            Join 4–12 fellow artisans for intimate weekend co-learning circles. Always non-monetary, hands-on, and focused on genuine craft exchange.
          </p>

          {myHostedCount > 0 && onNavigateMyPosts && (
            <div className="pt-1">
              <button
                onClick={onNavigateMyPosts}
                className="text-xs font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>You are hosting {myHostedCount} {myHostedCount === 1 ? 'circle' : 'circles'} — Manage in My Posts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsHostModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[var(--theme-primary)] hover:opacity-95 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Host a Swap Circle</span>
        </button>
      </div>

      {/* Filter Bar: Format & Tags */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[var(--theme-primary)] text-white shadow-2xs'
                  : 'bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-1 rounded-xl">
          <button
            onClick={() => setSelectedFormat('All')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedFormat === 'All'
                ? 'bg-[var(--theme-primary)] text-white'
                : 'text-[#52524D] dark:text-[#C5C4BE]'
            }`}
          >
            All Formats
          </button>
          <button
            onClick={() => setSelectedFormat('In-Person')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              selectedFormat === 'In-Person'
                ? 'bg-[var(--theme-primary)] text-white'
                : 'text-[#52524D] dark:text-[#C5C4BE]'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>In-Person</span>
          </button>
          <button
            onClick={() => setSelectedFormat('Online')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              selectedFormat === 'Online'
                ? 'bg-[var(--theme-primary)] text-white'
                : 'text-[#52524D] dark:text-[#C5C4BE]'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>Online</span>
          </button>
        </div>
      </div>

      {/* Circles Grid */}
      {filteredCircles.length === 0 ? (
        <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)]">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">
            No workshop circles found
          </h3>
          <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] max-w-sm mx-auto">
            {myHostedCount > 0
              ? `You have published ${myHostedCount} circle(s), which are managed under My Posts. No other peer circles match this filter.`
              : 'Gather fellow swappers together by hosting a group craft circle, open jam, or hands-on session.'}
          </p>
          <button
            onClick={() => setIsHostModalOpen(true)}
            className="px-5 py-2.5 bg-[var(--theme-primary)] text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Host a Circle</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCircles.map((circle) => {
            const spotsRemaining = Math.max(0, circle.maxAttendees - circle.attendeesCount);
            const isFull = spotsRemaining === 0 && !circle.joined;

            return (
              <div
                key={circle.id}
                onClick={() => setSelectedCircleForDetail(circle)}
                className="swap-card-elevated rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 border border-[var(--theme-primary)]/25 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                        {circle.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] text-[#52524D] dark:text-[#C5C4BE] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center gap-1">
                        {circle.format === 'Online' ? <Video className="w-3 h-3 text-blue-500" /> : <MapPin className="w-3 h-3 text-amber-500" />}
                        {circle.format}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#52524D] dark:text-[#C5C4BE]">
                      <Users className="w-3.5 h-3.5 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />
                      <span>
                        <strong className="text-[#1F1F1C] dark:text-[#FAF9F5]">{circle.attendeesCount}</strong>/{circle.maxAttendees} spots
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] mb-2 leading-snug group-hover:text-[var(--theme-primary)] transition-colors">
                    {circle.title}
                  </h3>
                  <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] leading-relaxed mb-4 line-clamp-2">
                    {circle.description}
                  </p>

                  {/* Host & Date info */}
                  <div className="p-3 bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <GeometricAvatar avatar={circle.host.avatar} name={circle.host.name} size="xs" />
                      <span className="text-[#1F1F1C] dark:text-[#FAF9F5]">
                        Hosted by <strong>{circle.host.name}</strong>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#52524D] dark:text-[#C5C4BE] pt-1 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />
                        {circle.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
                        {circle.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#EAE7E1]/60 dark:border-[var(--theme-border-dark)]/60">
                  <div className="flex items-center gap-2 text-xs text-[#7D7D76] dark:text-[#8E8D86]">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{circle.discussion?.length || 0} posts</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedCircleForDetail(circle)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      View Hub
                    </button>

                    <button
                      onClick={() => onToggleJoin(circle.id)}
                      disabled={isFull && !circle.joined}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                        circle.joined
                          ? 'bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] border border-[var(--theme-primary)]/30'
                          : isFull
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-[var(--theme-primary)] hover:opacity-95 text-white'
                      }`}
                    >
                      {circle.joined ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>RSVP'd ✓</span>
                        </>
                      ) : isFull ? (
                        <span>Full</span>
                      ) : (
                        <span>RSVP</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Circle Detail Modal */}
      {selectedCircleForDetail && (
        <CircleDetailModal
          circle={selectedCircleForDetail}
          currentUser={currentUser}
          onClose={() => setSelectedCircleForDetail(null)}
          onToggleJoin={(id) => {
            onToggleJoin(id);
            setSelectedCircleForDetail((prev) =>
              prev && prev.id === id
                ? {
                    ...prev,
                    joined: !prev.joined,
                    attendeesCount: prev.joined ? prev.attendeesCount - 1 : prev.attendeesCount + 1,
                  }
                : prev
            );
          }}
          onAddDiscussionMessage={(circleId, msg) => {
            if (onAddDiscussionMessage) {
              onAddDiscussionMessage(circleId, msg);
            }
            setSelectedCircleForDetail((prev) =>
              prev && prev.id === circleId
                ? {
                    ...prev,
                    discussion: [...(prev.discussion || []), msg],
                  }
                : prev
            );
          }}
          onContactHost={onContactHost}
        />
      )}

      {/* Host Circle Modal */}
      {isHostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xl space-y-4 my-auto">
            <h3 className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              Host a Community Circle
            </h3>
            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">
              Create an open micro-workshop session for local swappers to practice together. Your circle will be managed in your "My Posts" dashboard.
            </p>

            <form onSubmit={handleHostSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                  Circle Topic / Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g. Sunday Morning Fermentation & Wild Yeast Baking Jam"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <CustomSelect
                    label="Category"
                    value={newCategory}
                    onChange={(val) => setNewCategory(val as SkillCategory)}
                    options={[
                      { value: 'Visual Arts', label: 'Visual Arts' },
                      { value: 'Culinary Arts', label: 'Culinary Arts' },
                      { value: 'Technology', label: 'Technology' },
                      { value: 'Crafts & DIY', label: 'Crafts & DIY' },
                      { value: 'Music & Audio', label: 'Music & Audio' },
                      { value: 'Wellness & Fitness', label: 'Wellness & Garden' },
                    ]}
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as SwapFormat)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] font-medium"
                  >
                    <option value="In-Person">In-Person Workshop</option>
                    <option value="Online">Online Video Jam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">Max Spots</label>
                  <input
                    type="number"
                    value={newMax}
                    onChange={(e) => setNewMax(Number(e.target.value))}
                    min={2}
                    max={30}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                  {newFormat === 'Online' ? 'Meeting URL (Google Meet / Zoom)' : 'Location / Studio Address'}
                </label>
                <input
                  type="text"
                  value={newLocationOrLink}
                  onChange={(e) => setNewLocationOrLink(e.target.value)}
                  placeholder={newFormat === 'Online' ? 'https://meet.google.com/xyz-abc' : '142 Elm Street, Community Art Lab'}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                  What Attendees Should Bring (comma separated)
                </label>
                <input
                  type="text"
                  value={newMaterials}
                  onChange={(e) => setNewMaterials(e.target.value)}
                  placeholder="E.g. Mason jar, 1 cup flour, Kitchen towel"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">Description & Workshop Plan</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What will we build or practice together? What experience level is expected?"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHostModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--theme-primary)] text-white font-bold hover:opacity-95 cursor-pointer shadow-xs"
                >
                  Publish Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
