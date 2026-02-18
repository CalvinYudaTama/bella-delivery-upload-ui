'use client';

import React from 'react';
import { useParams } from 'next/navigation';

// TODO (Riley): Replace this placeholder with the AI Delivery Revision layout/component
export default function RevisionPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: '12px',
    }}>
      <p style={{ color: '#6B7280', fontFamily: 'Inter', fontSize: '16px' }}>
        AI Delivery Revision — Coming Soon
      </p>
      <p style={{ color: '#9CA3AF', fontFamily: 'Inter', fontSize: '13px' }}>
        Project ID: {projectId}
      </p>
    </div>
  );
}
