import React from 'react';
import { UserProfile, SkillListing } from '../types';
import { ProfileView } from '../components/ProfileView';

interface ProfilePageProps {
  currentUser: UserProfile;
  userListings: SkillListing[];
  onUpdateUser: (updated: UserProfile) => void;
  onOpenCreditsExplainer: () => void;
  onOpenAuthModal: () => void;
  onPostSkill: () => void;
  onNavigateMyPosts?: () => void;
  onSignOut?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  userListings,
  onUpdateUser,
  onOpenCreditsExplainer,
  onOpenAuthModal,
  onPostSkill,
  onNavigateMyPosts,
  onSignOut,
}) => {
  return (
    <div className="animate-in fade-in duration-300">
      <ProfileView
        currentUser={currentUser}
        userListings={userListings}
        onUpdateUser={onUpdateUser}
        onOpenCreditsExplainer={onOpenCreditsExplainer}
        onOpenAuthModal={onOpenAuthModal}
        onPostSkill={onPostSkill}
        onNavigateMyPosts={onNavigateMyPosts}
        onSignOut={onSignOut}
      />
    </div>
  );
};
