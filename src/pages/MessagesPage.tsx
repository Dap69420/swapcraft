import React from 'react';
import { Conversation, SkillListing, UserProfile } from '../types';
import { MessagesView } from '../components/MessagesView';

interface MessagesPageProps {
  conversations: Conversation[];
  currentUser: UserProfile;
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, text: string) => void;
  listings?: SkillListing[];
  onSelectListing?: (listing: SkillListing) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  conversations,
  currentUser,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  listings = [],
  onSelectListing,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <MessagesView
        conversations={conversations}
        currentUser={currentUser}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
        onSendMessage={onSendMessage}
        listings={listings}
        onSelectListing={onSelectListing}
      />
    </div>
  );
};
