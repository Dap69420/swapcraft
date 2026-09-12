import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Handshake,
  Coins,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AppNotification, NotificationType } from '../types';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNavigateAction?: (tab: string, payload?: any) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNavigateAction,
}) => {
  const [filter, setFilter] = useState<'all' | 'swaps' | 'circles' | 'credits'>('all');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.category === filter;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'swap_proposal':
      case 'swap_accepted':
        return <Handshake className="w-4 h-4 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />;
      case 'credit_earned':
        return <Coins className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />;
      case 'circle_reminder':
        return <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'review_received':
        return <Star className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-[var(--theme-primary)]" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    onMarkAsRead(notif.id);
    if (notif.actionTab && onNavigateAction) {
      onNavigateAction(notif.actionTab, notif.actionPayload);
      onClose();
    }
  };

  return (
    <div
      ref={popoverRef}
      className="absolute top-14 right-2 sm:right-6 z-50 w-84 sm:w-96 bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xl p-4 sm:p-5 text-[#20201D] dark:text-[#F5F5F0] animate-in fade-in slide-in-from-top-3 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-[#1F1F1C] dark:text-[#FAF9F5]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-[3px] rounded-full bg-[var(--theme-accent)] text-white text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7D7D76] dark:text-[#A8A7A0]">
              Activity, swap updates & community alerts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              title="Mark all as read"
              className="p-1.5 rounded-lg text-xs text-[#52524D] dark:text-[#C5C4BE] hover:text-[var(--theme-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D7D76] dark:text-[#A8A7A0] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 my-3 p-1 rounded-xl bg-[#F6F5F0] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold">
        {(['all', 'swaps', 'circles', 'credits'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-medium capitalize transition-all cursor-pointer ${
              filter === tab
                ? 'bg-white dark:bg-[var(--theme-card-dark)] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold shadow-2xs'
                : 'text-[#6B6A64] dark:text-[#8E8D86] hover:text-black dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto space-y-2 pr-1 -mr-1">
        {filteredNotifications.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)]">
              <Bell className="w-5 h-5 opacity-60" />
            </div>
            <p className="text-xs font-semibold text-[#52524D] dark:text-[#C5C4BE]">
              No notifications right now
            </p>
            <p className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">
              When someone proposes a swap or joins your circle, it will appear here.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 text-left ${
                notif.read
                  ? 'bg-white dark:bg-[var(--theme-bg-dark)]/50 border-[#EAE7E1] dark:border-[var(--theme-border-dark)] hover:border-[var(--theme-primary)]/50 opacity-80 hover:opacity-100'
                  : 'bg-[var(--theme-primary)]/5 dark:bg-[var(--theme-primary)]/10 border-[var(--theme-primary)]/30 shadow-2xs'
              }`}
            >
              <div className="p-2 rounded-xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shrink-0 mt-0.5">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5] truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86] shrink-0 font-medium">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-[#52524D] dark:text-[#C5C4BE] mt-0.5 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>

                {notif.actionLabel && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:underline">
                    <span>{notif.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)] shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="mt-3 pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between text-[11px] text-[#7D7D76] dark:text-[#8E8D86]">
          <span>{notifications.length} total alerts</span>
          <button
            onClick={onClearAll}
            className="hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear list</span>
          </button>
        </div>
      )}
    </div>
  );
};
