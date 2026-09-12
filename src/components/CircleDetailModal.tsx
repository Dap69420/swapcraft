import React, { useState } from 'react';
import { CommunityCircle, UserProfile, CircleDiscussionMessage } from '../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Check,
  Send,
  Download,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { GeometricAvatar } from './GeometricAvatar';

interface CircleDetailModalProps {
  circle: CommunityCircle;
  currentUser: UserProfile;
  onClose: () => void;
  onToggleJoin: (circleId: string) => void;
  onAddDiscussionMessage?: (circleId: string, message: CircleDiscussionMessage) => void;
  onContactHost?: (host: UserProfile) => void;
}

export const CircleDetailModal: React.FC<CircleDetailModalProps> = ({
  circle,
  currentUser,
  onClose,
  onToggleJoin,
  onAddDiscussionMessage,
  onContactHost,
}) => {
  const [discussionInput, setDiscussionInput] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'discussion' | 'attendees'>('details');

  const isHost = circle.host.id === currentUser.id || circle.host.name === currentUser.name;
  const isJoined = circle.joined;
  const spotsLeft = Math.max(0, circle.maxAttendees - circle.attendeesCount);
  const isFull = spotsLeft === 0 && !isJoined;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;

    const newMsg: CircleDiscussionMessage = {
      id: `msg-${Date.now()}`,
      circleId: circle.id,
      author: currentUser,
      text: discussionInput.trim(),
      timestamp: 'Just now',
    };

    if (onAddDiscussionMessage) {
      onAddDiscussionMessage(circle.id, newMsg);
    }
    setDiscussionInput('');
  };

  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`SwapCraft Circle: ${circle.title}`);
    const details = encodeURIComponent(
      `${circle.description}\n\nHost: ${circle.host.name}\nFormat: ${circle.format} (${circle.locationOrLink || 'TBD'})`
    );
    const location = encodeURIComponent(circle.locationOrLink || `${circle.format} Session`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] border border-[var(--theme-primary)]/20">
                {circle.category}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] text-[#52524D] dark:text-[#C5C4BE] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center gap-1">
                {circle.format === 'Online' ? <Video className="w-3 h-3 text-blue-500" /> : <MapPin className="w-3 h-3 text-amber-500" />}
                {circle.format}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] leading-tight">
              {circle.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7D7D76] hover:text-[#1F1F1C] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[var(--theme-bg-light)]/40 dark:bg-[var(--theme-bg-dark)]/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-[var(--theme-primary)] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]'
                : 'border-transparent text-[#52524D] dark:text-[#8E8D86] hover:text-[#1F1F1C]'
            }`}
          >
            Circle Details
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'discussion'
                ? 'border-[var(--theme-primary)] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]'
                : 'border-transparent text-[#52524D] dark:text-[#8E8D86] hover:text-[#1F1F1C]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discussion ({circle.discussion?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('attendees')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'attendees'
                ? 'border-[var(--theme-primary)] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]'
                : 'border-transparent text-[#52524D] dark:text-[#8E8D86] hover:text-[#1F1F1C]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Attendees ({circle.attendeesCount})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Host profile preview */}
              <div className="p-4 rounded-2xl bg-[var(--theme-bg-light)]/70 dark:bg-[var(--theme-bg-dark)]/70 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <GeometricAvatar avatar={circle.host.avatar} name={circle.host.name} size="md" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-[#1F1F1C] dark:text-[#FAF9F5]">{circle.host.name}</h4>
                      {isHost && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                          You (Host)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">{circle.host.tagline}</p>
                  </div>
                </div>

                {!isHost && onContactHost && (
                  <button
                    onClick={() => onContactHost(circle.host)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Message Host
                  </button>
                )}
              </div>

              {/* Time & Venue schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-white dark:bg-[var(--theme-bg-dark)] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[var(--theme-primary)]" />
                    Date & Schedule
                  </span>
                  <p className="text-sm font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">{circle.date}</p>
                  <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {circle.time}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-white dark:bg-[var(--theme-bg-dark)] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86] flex items-center gap-1">
                    {circle.format === 'Online' ? <Video className="w-3 h-3 text-blue-500" /> : <MapPin className="w-3 h-3 text-amber-500" />}
                    Location & Access
                  </span>
                  <p className="text-sm font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">
                    {circle.locationOrLink || (circle.format === 'Online' ? 'Google Meet / Zoom' : 'Local Community Studio')}
                  </p>
                  {circle.format === 'Online' && circle.locationOrLink?.startsWith('http') && (
                    <a
                      href={circle.locationOrLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Join Call Room</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86]">About This Circle</h4>
                <p className="text-sm text-[#3D3D3A] dark:text-[#D5D4CE] leading-relaxed whitespace-pre-line">
                  {circle.description}
                </p>
              </div>

              {/* Materials / Preparation */}
              {circle.materials && circle.materials.length > 0 && (
                <div className="space-y-2 p-4 rounded-2xl bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                  <h4 className="text-xs uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                    Recommended Materials & What to Bring
                  </h4>
                  <ul className="space-y-1.5 pt-1">
                    {circle.materials.map((m, idx) => (
                      <li key={idx} className="text-xs text-[#52524D] dark:text-[#C5C4BE] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {circle.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] text-[#52524D] dark:text-[#C5C4BE] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'discussion' && (
            <div className="space-y-4">
              <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">
                Ask questions about tools, preparations, or coordinate arrival with your fellow attendees and host.
              </p>

              <div className="space-y-3 min-h-[160px]">
                {(!circle.discussion || circle.discussion.length === 0) ? (
                  <div className="py-8 text-center text-xs text-[#7D7D76] dark:text-[#8E8D86]">
                    No messages yet. Be the first to say hi or ask a question!
                  </div>
                ) : (
                  circle.discussion.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">
                          <GeometricAvatar avatar={msg.author.avatar} name={msg.author.name} size="xs" />
                          <span>{msg.author.name}</span>
                          {msg.author.id === circle.host.id && (
                            <span className="text-[9px] px-1.5 py-[3px] rounded bg-[var(--theme-primary)]/15 text-[var(--theme-primary)]">
                              Host
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#3D3D3A] dark:text-[#D5D4CE] pl-7">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Post comment form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                <input
                  type="text"
                  value={discussionInput}
                  onChange={(e) => setDiscussionInput(e.target.value)}
                  placeholder="Post a message to the circle..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-white dark:bg-[var(--theme-bg-dark)] text-xs text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                />
                <button
                  type="submit"
                  disabled={!discussionInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold disabled:opacity-40 hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'attendees' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#52524D] dark:text-[#C5C4BE]">
                <span>
                  <strong>{circle.attendeesCount}</strong> of {circle.maxAttendees} spots reserved
                </span>
                <span className="font-semibold text-[var(--theme-primary)]">
                  {spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Full capacity'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] overflow-hidden">
                <div
                  className="h-full bg-[var(--theme-primary)] transition-all duration-300"
                  style={{ width: `${Math.min(100, (circle.attendeesCount / circle.maxAttendees) * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Host card */}
                <div className="p-3 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[var(--theme-bg-light)]/40 dark:bg-[var(--theme-bg-dark)]/40 flex items-center gap-3">
                  <GeometricAvatar avatar={circle.host.avatar} name={circle.host.name} size="sm" />
                  <div className="text-xs">
                    <div className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">{circle.host.name}</div>
                    <span className="text-[10px] text-[var(--theme-primary)] font-semibold">Verified Workshop Host</span>
                  </div>
                </div>

                {/* Other attendees */}
                {circle.attendees?.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-white dark:bg-[var(--theme-card-dark)] flex items-center gap-3"
                  >
                    <GeometricAvatar avatar={att.avatar} name={att.name} size="sm" />
                    <div className="text-xs">
                      <div className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">{att.name}</div>
                      <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">{att.tagline || 'Community Artisan'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[var(--theme-bg-light)]/30 dark:bg-[var(--theme-bg-dark)]/30 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-[#52524D] dark:text-[#C5C4BE]">
            <Users className="w-4 h-4 text-[var(--theme-primary)]" />
            <span>
              <strong>{spotsLeft}</strong> spots left
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {isJoined && (
              <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-white dark:bg-[var(--theme-card-dark)] text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Google Calendar</span>
              </a>
            )}

            {!isHost && (
              <button
                onClick={() => onToggleJoin(circle.id)}
                disabled={isFull && !isJoined}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  isJoined
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50'
                    : isFull
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[var(--theme-primary)] hover:opacity-95 text-white'
                }`}
              >
                {isJoined ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Cancel RSVP</span>
                  </>
                ) : isFull ? (
                  <span>Circle Full</span>
                ) : (
                  <span>RSVP & Join Circle</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
