'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Dashboard/Sidebar';

function ProjectsLayoutInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page') || '';
  const projectId = pageParam.split('/')[0] || undefined;

  return (
    /*
     * Layout structure:
     * - app/layout.tsx <main> already adds paddingTop: 102px (header offset)
     * - This wrapper fills the remaining viewport height below the header
     * - Sidebar is position:sticky inside a tall scroll container so it stays visible while content scrolls
     */
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      {/* Sidebar */}
      <Sidebar projectId={projectId} />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflowX: 'hidden',
          backgroundColor: '#F9FAFB',
          padding: '24px 32px',
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProjectsLayoutInner>{children}</ProjectsLayoutInner>
    </Suspense>
  );
}
