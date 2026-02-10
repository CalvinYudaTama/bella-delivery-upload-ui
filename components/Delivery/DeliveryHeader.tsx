'use client';

import React, { useState } from 'react';
import { useDeliveryContext } from './context/DeliveryContext';

type DeliveryTab = 'overview' | 'gallery' | 'furniture-list';

export const DeliveryHeader: React.FC = () => {
  const { state } = useDeliveryContext();
  const [activeTab, setActiveTab] = useState<DeliveryTab>('overview');

  // Format the latest update date
  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return `${month} ${day}${getDaySuffix(day)}, ${year} ${displayHours}:${displayMinutes}${ampm}`;
  };

  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Use current date as default, or from state if available
  const latestUpdate = state.latestUpdate ? new Date(state.latestUpdate) : new Date();
  const resultsOrderId = state.resultsOrderId || state.projectId || '123456789753159';

  return (
    <div className="mb-8">
      {/* Top section: Title and Status */}
      <div className="mb-6 flex items-start justify-between">
        {/* Left: Title */}
        <h1 className="text-[32px] font-bold leading-[40px] text-[#181D27]">Delivery</h1>

        {/* Right: Status Info */}
        <div className="flex flex-col items-end gap-2">
          {/* Latest Update Badge */}
          <div className="flex items-center gap-2 rounded-full bg-[#E8F5E9] px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-[#4CAF50]"></div>
            <span className="text-xs font-medium text-[#2E7D32]">
              Latest Update {formatDate(latestUpdate)}
            </span>
          </div>

          {/* Results Order ID */}
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-[#535862]">Results Order</span>
            <span className="text-base font-semibold text-[#181D27]">{resultsOrderId}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex gap-1 border-b border-gray-200">
        {[
          { id: 'overview' as DeliveryTab, label: 'Overview' },
          { id: 'gallery' as DeliveryTab, label: 'Gallery' },
          { id: 'furniture-list' as DeliveryTab, label: 'Furniture List' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-[#181D27] text-[#181D27]'
                : 'text-[#717680] hover:text-[#181D27]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

