import React from 'react';
import { SwapProposal, UserProfile, SkillListing } from '../types';
import { MySwapsView } from '../components/MySwapsView';

interface SwapsPageProps {
  proposals: SwapProposal[];
  currentUser: UserProfile;
  savedListings: SkillListing[];
  onAcceptProposal: (proposalId: string) => void;
  onDeclineProposal: (proposalId: string) => void;
  onCompleteSwap: (proposalId: string) => void;
  onOpenReview: (proposal: SwapProposal) => void;
  onOpenChatWithUser: (user: UserProfile) => void;
  onViewListing: (listing: SkillListing) => void;
  onOpenCreditsExplainer?: () => void;
}

export const SwapsPage: React.FC<SwapsPageProps> = ({
  proposals,
  currentUser,
  savedListings,
  onAcceptProposal,
  onDeclineProposal,
  onCompleteSwap,
  onOpenReview,
  onOpenChatWithUser,
  onViewListing,
  onOpenCreditsExplainer,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <MySwapsView
        proposals={proposals}
        currentUser={currentUser}
        savedListings={savedListings}
        onAcceptProposal={onAcceptProposal}
        onDeclineProposal={onDeclineProposal}
        onCompleteSwap={onCompleteSwap}
        onOpenReview={onOpenReview}
        onOpenChatWithUser={onOpenChatWithUser}
        onViewListing={onViewListing}
        onOpenCreditsExplainer={onOpenCreditsExplainer}
      />
    </div>
  );
};
