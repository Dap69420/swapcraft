import React from 'react';
import { SkillListing, UserProfile } from '../types';
import { MatchmakerView } from '../components/MatchmakerView';

interface MatchmakerPageProps {
  listings: SkillListing[];
  currentUser: UserProfile;
  onSelectListing: (listing: SkillListing) => void;
  onProposeSwap: (listing: SkillListing) => void;
}

export const MatchmakerPage: React.FC<MatchmakerPageProps> = ({
  listings,
  currentUser,
  onSelectListing,
  onProposeSwap,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <MatchmakerView
        listings={listings}
        currentUser={currentUser}
        onSelectListing={onSelectListing}
        onProposeSwap={onProposeSwap}
      />
    </div>
  );
};
