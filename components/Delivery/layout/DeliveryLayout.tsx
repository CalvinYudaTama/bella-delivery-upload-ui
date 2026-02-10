'use client';

import React, { ReactNode } from 'react';
import { DeliveryProvider } from '../context/DeliveryContext';
import { DeliveryContent } from '../DeliveryContent';

interface DeliveryLayoutProps {
  projectId: string;
  revisionNumber?: number | null; // Optional revision number from URL
  children?: ReactNode;
}

/**
 * Delivery Layout Component
 * 
 * This layout provides:
 * - Shared navigation tabs (Upload/Delivery)
 * - DeliveryProvider for global state management
 * - Consistent styling and structure
 * 
 * Usage:
 * <DeliveryLayout projectId="xxx" revisionNumber={0}>
 *   <DeliveryContent />
 * </DeliveryLayout>
 */
export const DeliveryLayout: React.FC<DeliveryLayoutProps> = ({ 
  projectId, 
  revisionNumber = null,
  children 
}) => {
  return (
    <DeliveryProvider projectId={projectId} revisionNumber={revisionNumber}>
      <main className="delivery-layout-main mx-auto w-full pb-10" style={{ maxWidth: '1440px', paddingTop: '0' }}>
        {/* Delivery Header with status and tabs */}
        {/* <DeliveryHeader /> */}

        {/* Delivery content */}
        {children || <DeliveryContent />}
      </main>
    </DeliveryProvider>
  );
};

