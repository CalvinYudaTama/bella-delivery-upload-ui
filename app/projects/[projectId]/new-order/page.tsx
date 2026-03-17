'use client';

import React, { Suspense } from 'react';
import NewOrderContent from '@/components/Order/NewOrderContent';

export default function NewOrderPage() {
  return (
    <Suspense fallback={null}>
      <div style={{ width: '100%', minHeight: '100%' }}>
        <NewOrderContent />
      </div>
    </Suspense>
  );
}
