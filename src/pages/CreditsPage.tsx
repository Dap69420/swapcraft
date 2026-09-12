import React from 'react';
import { UserProfile } from '../types';
import { CreditsExplainerView } from '../components/CreditsExplainerView';

interface CreditsPageProps {
  currentUser: UserProfile;
  onNavigateDiscover: () => void;
  onPostSkill: () => void;
}

export const CreditsPage: React.FC<CreditsPageProps> = ({
  currentUser,
  onNavigateDiscover,
  onPostSkill,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <CreditsExplainerView
        currentUser={currentUser}
        onNavigateDiscover={onNavigateDiscover}
        onPostSkill={onPostSkill}
      />
    </div>
  );
};
