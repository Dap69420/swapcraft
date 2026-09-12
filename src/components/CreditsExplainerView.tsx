import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Coins,
  Repeat,
  HeartHandshake,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  Calculator,
} from 'lucide-react';
import { GeometricAvatar } from './GeometricAvatar';

interface CreditsExplainerViewProps {
  currentUser: UserProfile;
  onNavigateDiscover: () => void;
  onPostSkill: () => void;
}

export const CreditsExplainerView: React.FC<CreditsExplainerViewProps> = ({
  currentUser,
  onNavigateDiscover,
  onPostSkill,
}) => {
  // Interactive Calculator State
  const [teachingHoursPerWeek, setTeachingHoursPerWeek] = useState<number>(2);
  const [hostCirclesPerMonth, setHostCirclesPerMonth] = useState<number>(1);

  const monthlyEarnedCredits = teachingHoursPerWeek * 4 + hostCirclesPerMonth * 3;
  const classesCanTakePerMonth = monthlyEarnedCredits;

  const mockLedger = [
    {
      id: 'tx-1',
      date: 'Aug 22, 2026',
      title: 'Completed Swap with Sunni Mahavong',
      details: 'Scratch Green Curry Paste ⇄ Menu & Card Design',
      amount: '+1.0',
      type: 'earned',
    },
    {
      id: 'tx-2',
      date: 'Aug 15, 2026',
      title: 'Community Circle Host Bonus',
      details: 'Botanical Sketching & Field Study (6 attendees)',
      amount: '+2.0',
      type: 'earned',
    },
    {
      id: 'tx-3',
      date: 'Aug 10, 2026',
      title: 'Peer Endorsement Milestone',
      details: 'Received 5x "Crystal Clear Communicator" badges',
      amount: '+1.0',
      type: 'bonus',
    },
    {
      id: 'tx-4',
      date: 'Mar 15, 2024',
      title: 'SwapCraft Welcome Grant',
      details: 'Starter credits allocated to jumpstart your exchange journey',
      amount: '+4.0',
      type: 'grant',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="bg-[var(--theme-bg-light)] dark:bg-[var(--theme-card-dark)] rounded-3xl p-6 sm:p-10 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] relative overflow-hidden transition-colors">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-full text-xs font-semibold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]">
            <Coins className="w-3.5 h-3.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
            <span>The SwapCraft Karma Bank</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] tracking-tight">
            How Knowledge Credits Work
          </h1>
          <p className="text-xs sm:text-sm text-[#52524D] dark:text-[#C5C4BE] leading-relaxed">
            SwapCraft operates on the timeless ethos of <strong>Time Banking</strong>. Every skill has equal human dignity — 1 hour of mentoring earns 1 Karma Credit, redeemable for 1 hour of learning anything else.
          </p>
        </div>

        {/* Current User Balance Widget */}
        <div className="mt-8 pt-6 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GeometricAvatar avatar={currentUser.avatar} name={currentUser.name} size="lg" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86]">
                Your Current Credit Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                  {currentUser.credits} Credits
                </span>
                <span className="text-xs text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold">
                  = {currentUser.credits} hours of private classes
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPostSkill}
              className="px-4 py-2.5 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Offer a Skill to Earn</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Tenets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-[var(--theme-primary)]/15 flex items-center justify-center text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
            1 Hour = 1 Credit
          </h3>
          <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] leading-relaxed">
            All crafts are valued on equal human footing. 60 minutes of bread fermentation guidance is worth the same as 60 minutes of React code review or conversational Spanish.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-[var(--theme-accent)]/15 flex items-center justify-center text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]">
            <Repeat className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
            Direct Swaps Use 0 Credits
          </h3>
          <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] leading-relaxed">
            When you and a neighbor swap skills directly in bilateral reciprocity (I teach you guitar, you teach me photography), no credits are deducted from either balance!
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-[var(--theme-primary)]/15 flex items-center justify-center text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
            100% Free & Demonetized
          </h3>
          <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] leading-relaxed">
            Credits cannot be bought with fiat currency or cashed out for money. This protects the warmth, authenticity, and generosity of peer co-learning.
          </p>
        </div>
      </div>

      {/* How to Earn & Spend Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* How to Earn */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)]"></span>
            <h3 className="text-lg font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              How to Earn Karma Credits
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block">
                  Teach a 1-on-1 Skill Session (+1 Credit / hr)
                </span>
                <p className="text-[#52524D] dark:text-[#C5C4BE] mt-0.5">
                  Accept a swap proposal, deliver a mentoring session, and receive credits automatically upon completion.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block">
                  Host a Community Circle (+2 to 4 Credits)
                </span>
                <p className="text-[#52524D] dark:text-[#C5C4BE] mt-0.5">
                  Gather a small group (4–12 neighbors) for a weekend micro-workshop or co-working studio.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block">
                  Peer Endorsement Streaks (+1 Bonus Credit)
                </span>
                <p className="text-[#52524D] dark:text-[#C5C4BE] mt-0.5">
                  Maintain a 4.9+ rating and collect 5 consecutive verified endorsement badges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Spend */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-accent)]"></span>
            <h3 className="text-lg font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              How to Spend Karma Credits
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block">
                  Book 1-on-1 Apprenticeships (1 Credit / hr)
                </span>
                <p className="text-[#52524D] dark:text-[#C5C4BE] mt-0.5">
                  Learn directly from experienced artisans even if they aren’t currently seeking your specific skill.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block">
                  Reserve Spots in Master Circles (1 Credit / session)
                </span>
                <p className="text-[#52524D] dark:text-[#C5C4BE] mt-0.5">
                  Gain instant entry into popular weekend masterclasses and practical hands-on studio days.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)]/60 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block">
                  Gift Credits to Beginners (1 Credit)
                </span>
                <p className="text-[#52524D] dark:text-[#C5C4BE] mt-0.5">
                  Support a newcomer in your local community who is just beginning their creative craft journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Time Bank Calculator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />
          <div>
            <h3 className="text-lg font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              Knowledge Exchange Calculator
            </h3>
            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">
              Estimate how many hours of classes you can unlock per month
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-[#1F1F1C] dark:text-[#FAF9F5] mb-1.5">
                <span>Teaching Hours Per Week</span>
                <span className="text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">{teachingHoursPerWeek} hrs / week</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={teachingHoursPerWeek}
                onChange={(e) => setTeachingHoursPerWeek(Number(e.target.value))}
                className="w-full accent-[var(--theme-primary)]"
              />
              <div className="flex justify-between text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">
                <span>0 hrs</span>
                <span>5 hrs</span>
                <span>10 hrs</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[#1F1F1C] dark:text-[#FAF9F5] mb-1.5">
                <span>Group Circles Hosted Per Month</span>
                <span className="text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]">{hostCirclesPerMonth} circles</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={hostCirclesPerMonth}
                onChange={(e) => setHostCirclesPerMonth(Number(e.target.value))}
                className="w-full accent-[var(--theme-accent)]"
              />
              <div className="flex justify-between text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">
                <span>0</span>
                <span>2</span>
                <span>4</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86] block">
                Your Monthly Knowledge Earning Potential
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold font-serif text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                  +{monthlyEarnedCredits}
                </span>
                <span className="text-sm font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">Karma Credits / mo</span>
              </div>
            </div>

            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] leading-relaxed">
              With this cadence, you can take <strong>{classesCanTakePerMonth} full hours</strong> of private sourdough, photography, code, or ceramic classes every month for <strong>$0</strong>.
            </p>

            <button
              onClick={onNavigateDiscover}
              className="w-full py-2.5 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Browse Skills to Learn Next
            </button>
          </div>
        </div>
      </div>

      {/* Karma Ledger & Activity */}
      <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              Your Personal Karma Ledger
            </h3>
            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">
              Transparent accounting of credits earned, redeemed, and endorsed
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] bg-[var(--theme-primary)]/10 px-2.5 py-1 rounded-lg">
            Net: {currentUser.credits}.0 CR
          </span>
        </div>

        <div className="divide-y divide-[#FAF9F6] dark:divide-[var(--theme-bg-dark)] text-xs">
          {mockLedger.map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">{tx.title}</span>
                  <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">• {tx.date}</span>
                </div>
                <p className="text-[11px] text-[#52524D] dark:text-[#C5C4BE]">{tx.details}</p>
              </div>

              <span className="font-mono font-bold text-sm text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] shrink-0">
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
