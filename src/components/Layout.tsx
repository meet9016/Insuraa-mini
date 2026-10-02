import React, { useState, useEffect } from 'react';
import Header from './Header';
import SubscriptionModal from './subscription/SubscriptionModal';
import SubscriptionHistoryModal from './subscription/SubscriptionHistoryModal';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkSubscriptionPopup = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) return;

        const res = await api.post(endPointApi.AUTH.SUBSCRIPTION_POPUP);
        const rawData = res.data?.data ?? res.data?.result ?? res.data;
        const popupData = rawData?.data ?? rawData;

        if (popupData) {
          const expired =
            popupData.is_expired === 1 ||
            popupData.is_expired === '1' ||
            popupData.is_expired === true ||
            popupData.is_expired === 'true';

          const showPopup =
            popupData.show_popup === true ||
            popupData.show_popup === 'true' ||
            popupData.show_popup === 1 ||
            popupData.show_popup === '1';

          if (expired) {
            // Condition 1: is_expired: 1 -> Popup shows & CANNOT be closed
            setIsExpired(true);
            setIsSubscriptionOpen(true);
          } else if (showPopup) {
            // Condition 2: show_popup: true, is_expired: 0 -> Popup shows & CAN be closed
            setIsExpired(false);
            setIsSubscriptionOpen(true);
          } else {
            // Condition 3: show_popup: false, is_expired: 0 -> Do NOT show popup
            setIsExpired(false);
            setIsSubscriptionOpen(false);
          }
        } else {
          setIsExpired(false);
          setIsSubscriptionOpen(false);
        }
      } catch (err) {
        console.error('Error checking subscription popup:', err);
        setIsExpired(false);
        setIsSubscriptionOpen(false);
      }
    };

    checkSubscriptionPopup();
  }, []);

  const handleCloseSubscription = () => {
    if (isExpired) return;
    setIsSubscriptionOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('insuraa_subscription_shown', 'true');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans w-full">
      <Header
        onOpenSubscription={() => {
          setIsExpired(false);
          setIsSubscriptionOpen(true);
        }}
        onOpenSubscriptionHistory={() => setIsHistoryOpen(true)}
      />
      <main className="flex-1 w-full px-3 md:px-4 lg:px-6 py-5 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Subscription Pricing Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        isExpired={isExpired}
        onClose={handleCloseSubscription}
        onSelectPlan={(planId) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('insuraa_subscription_shown', 'true');
            localStorage.setItem('insuraa_user_plan', planId);
          }
        }}
      />

      {/* Subscription History Modal */}
      <SubscriptionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}
