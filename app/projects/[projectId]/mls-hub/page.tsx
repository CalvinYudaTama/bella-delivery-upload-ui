'use client';

import React, { Suspense } from 'react';
import MLSMarketingHubContent from '@/components/MLS/MLSMarketingHubContent';

export default function MLSHubPage() {
  return (
    <Suspense fallback={null}>
      <div style={{ width: '100%', minHeight: '100%' }}>
        <MLSMarketingHubContent />
      </div>
    </Suspense>
  );
}
