import React from 'react';
import { SkillListing, CommunityCircle, SwapProposal, UserProfile } from '../types';
import { MyPostsView } from '../components/MyPostsView';

interface MyPostsPageProps {
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

export const MyPostsPage: React.FC<MyPostsPageProps> = (props) => {
  return (
    <div className="animate-in fade-in duration-300">
      <MyPostsView {...props} />
    </div>
  );
};
