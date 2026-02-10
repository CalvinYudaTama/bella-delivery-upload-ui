'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Home Page - Delivery Project Demo
 * 
 * This is a dedicated project for the delivery page functionality.
 * Redirects to the demo delivery page.
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to demo delivery page
    router.push('/projects?page=demo-project-123/delivery');
  }, [router]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to delivery page...</p>
      </div>
    </div>
  );
}
