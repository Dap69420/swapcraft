import React from 'react';
import { CommunityCircle, UserProfile, CircleDiscussionMessage } from '../types';
import { CommunityView } from '../components/CommunityView';

interface CirclesPageProps {
  circles: CommunityCircle[];
  currentUser: UserProfile;
  onToggleJoin: (circleId: string) => void;
  onHostCircle: (newCircle: CommunityCircle) => void;
  onAddDiscussionMessage?: (circleId: string, message: CircleDiscussionMessage) => void;
  onContactHost?: (host: UserProfile) => void;
  onNavigateMyPosts?: () => void;
}

export const CirclesPage: React.FC<CirclesPageProps> = ({
  circles,
  currentUser,
  onToggleJoin,
  onHostCircle,
  onAddDiscussionMessage,
  onContactHost,
  onNavigateMyPosts,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CommunityView
        circles={circles}
        currentUser={currentUser}
        onToggleJoin={onToggleJoin}
        onHostCircle={onHostCircle}
        onAddDiscussionMessage={onAddDiscussionMessage}
        onContactHost={onContactHost}
        onNavigateMyPosts={onNavigateMyPosts}
      />
    </div>
  );
};
