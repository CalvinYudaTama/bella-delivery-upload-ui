'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import LatestRevisionContent from '@/components/Delivery/LatestRevisionContent';

function DeliveryPageContent() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <div style={{ width: '100%', minHeight: '100%' }}>
      {/* TODO (Riley): pass real orderId, inProgressImages, completedImages from API */}
      <LatestRevisionContent projectId={projectId} />
    </div>
  );
}

export default function DeliveryPage() {
  return (
    <Suspense fallback={null}>
      <DeliveryPageContent />
    </Suspense>
  );
}
