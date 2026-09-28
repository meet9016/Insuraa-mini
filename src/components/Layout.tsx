import React, { useState, useEffect } from 'react';
import Header from './Header';
import SubscriptionModal from './subscription/SubscriptionModal';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const justLoggedIn = sessionStorage.getItem('insuraa_just_logged_in');
      const shown = sessionStorage.getItem('insuraa_subscription_shown');

      if (justLoggedIn || !shown) {
        if (justLoggedIn) {
          sessionStorage.removeItem('insuraa_just_logged_in');
        }
        const timer = setTimeout(() => {
          setIsSubscriptionOpen(true);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleCloseSubscription = () => {
    setIsSubscriptionOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('insuraa_subscription_shown', 'true');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans w-full">
      <Header onOpenSubscription={() => setIsSubscriptionOpen(true)} />
      <main className="flex-1 w-full px-4 md:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Subscription Pricing Modal (Auto shows on login & accessible via Upgrade button) */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={handleCloseSubscription}
        onSelectPlan={(planId) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('insuraa_subscription_shown', 'true');
            localStorage.setItem('insuraa_user_plan', planId);
          }
        }}
      />
    </div>
  );
}
