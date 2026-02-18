'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
// Header and Footer now in app/layout.tsx - no need to import here
import RevisionDropdown, { RevisionTab } from '@/components/Projects/RevisionDropdown';
// import AuthGuard from '@/components/Auth/AuthGuard';

// Dynamically import layouts to prevent SSR issues
// const UploadLayout = dynamic(
//   () => import('@/components/Upload').then((mod) => ({ default: mod.UploadLayout })),
//   { ssr: false }
// );

const DeliveryLayout = dynamic(
  () => import('@/components/Delivery').then((mod) => ({ default: mod.DeliveryLayout })),
  { ssr: false }
);

// const SubmittedLayout = dynamic(
//   () => import('@/components/Submitted').then((mod) => ({ default: mod.SubmittedLayout })),
//   { ssr: false }
// );

interface RevisionInfo {
  revisionNumber: number;
  deliveryUrl: string;
  generatedAt: string;
  imageCount: number;
}

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Parse page parameter: "xxx/upload" or "xxx/delivery"
  let pageParam = searchParams.get('page');
  
  // Parse revision parameter: "?revision=1"
  let revisionParam = searchParams.get('revision');
  
  // Clean pageParam if it contains revision parameter (edge case handling for old/database URLs)
  // Handle both formats: "xxx/delivery&revision=2" and "xxx/delivery?revision=2"
  let needsUrlNormalization = false;
  
  if (pageParam) {
    if (pageParam.includes('&revision=')) {
      const [basePage, ...rest] = pageParam.split('&revision=');
      pageParam = basePage;
      // If revisionParam is empty, try to extract from pageParam
      if (!revisionParam && rest.length > 0) {
        revisionParam = rest[0];
      }
    } else if (pageParam.includes('?revision=')) {
      // Handle incorrect format with double question marks (legacy data)
      // Auto-normalize: convert ?revision= to &revision=
      const [basePage, ...rest] = pageParam.split('?revision=');
      pageParam = basePage;
      // If revisionParam is empty, try to extract from pageParam
      if (!revisionParam && rest.length > 0) {
        revisionParam = rest[0];
        needsUrlNormalization = true; // Mark for URL normalization
      }
    }
  }
  
  // Parse revision number with validation
  let revisionNumber: number | null = null;
  if (revisionParam) {
    const parsed = parseInt(revisionParam, 10);
    if (!isNaN(parsed)) {
      revisionNumber = parsed;
    }
  }
  
  let projectId: string | null = null;
  // Always use 'delivery' view for demo (no upload/submitted)
  let view: 'delivery' | null = null;
  
  if (pageParam) {
    const parts = pageParam.split('/');
    projectId = parts[0] || null;
    // Always set to delivery for demo
    view = 'delivery';
  }
  
  // Normalize URL if incorrect format was detected (convert ?revision= to &revision=)
  useEffect(() => {
    if (needsUrlNormalization && projectId && revisionParam && view === 'delivery') {
      // Build normalized URL with correct format
      const normalizedParams = new URLSearchParams();
      normalizedParams.set('page', `${projectId}/delivery`);
      normalizedParams.set('revision', revisionParam);
      const normalizedUrl = `/projects?${normalizedParams.toString()}` as '/projects';
      
      // Replace URL without reload (client-side navigation)
      // This will trigger a re-render with the correct URL format
      router.replace(normalizedUrl);
    }
  }, [needsUrlNormalization, projectId, revisionParam, view, router]);
  
  const [revisions, setRevisions] = useState<RevisionInfo[]>([]);
  // const [isAllPhotosUploaded, setIsAllPhotosUploaded] = useState(false);
  // const [isCheckingUpload, setIsCheckingUpload] = useState(true);

  // Check if all photos are uploaded - COMMENTED OUT (only delivery needed)
  // useEffect(() => {
  //   if (projectId) {
  //     setIsCheckingUpload(true);
  //     const checkAllPhotosUploaded = async () => {
  //       try {
  //         const response = await fetch(`/api/projects/${projectId}`);
  //         const data = await response.json();
  //         
  //         if (data.error) {
  //           console.error('Failed to fetch project:', data.error);
  //           setIsAllPhotosUploaded(false);
  //           setIsCheckingUpload(false);
  //           return;
  //         }
  //         
  //         const serviceStats = data.service_stats || [];
  //         
  //         // Check if all services have completed uploads
  //         const allComplete = serviceStats.every((service: {
  //           total_jobs: number;
  //           uploaded_count: number;
  //           remaining: number;
  //         }) => {
  //           return service.uploaded_count === service.total_jobs && service.remaining === 0;
  //         });
  //         
  //         setIsAllPhotosUploaded(allComplete && serviceStats.length > 0);
  //         
  //         // Redirect to submitted page if on upload view and all photos are uploaded
  //         if (allComplete && serviceStats.length > 0 && view === 'upload') {
  //           router.push(`/projects?page=${projectId}/submitted`);
  //         }
  //       } catch (error) {
  //         console.error('Failed to check upload status:', error);
  //         setIsAllPhotosUploaded(false);
  //       } finally {
  //         setIsCheckingUpload(false);
  //       }
  //     };
  //     
  //     checkAllPhotosUploaded();
  //   } else {
  //     setIsCheckingUpload(false);
  //   }
  // }, [projectId, view, router]);

  // Protect submitted page: redirect to upload if not all photos are uploaded - COMMENTED OUT
  // useEffect(() => {
  //   if (projectId && view === 'submitted' && !isAllPhotosUploaded) {
  //     console.log('Redirecting from submitted to upload: photos not all uploaded');
  //     router.push(`/projects?page=${projectId}/upload`);
  //   }
  // }, [projectId, view, isAllPhotosUploaded, router]);

  // Protect upload page: redirect to submitted if all photos are uploaded - COMMENTED OUT
  // useEffect(() => {
  //   if (projectId && view === 'upload' && isAllPhotosUploaded) {
  //     console.log('Redirecting from upload to submitted: all photos uploaded');
  //     router.push(`/projects?page=${projectId}/submitted`);
  //   }
  // }, [projectId, view, isAllPhotosUploaded, router]);

  useEffect(() => {
    // If projectId is provided, fetch project data and revisions list
    if (projectId) {
      fetch(`/api/projects/${projectId}`)
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            // Store projectId in localStorage for SubmitButton to use
            // Check if we're in browser environment
            if (typeof window !== 'undefined') {
              localStorage.setItem('currentProjectId', projectId!);
            }
          }
        })
        .catch(error => {
          console.error('Failed to fetch project:', error);
        });
      
      // Fetch revisions list for delivery tabs
      fetch(`/api/delivery/${projectId}/revisions-list`)
        .then(response => response.json())
        .then(data => {
          if (!data.error && data.revisions) {
            setRevisions(data.revisions);
          }
        })
        .catch(error => {
          console.error('Failed to fetch revisions list:', error);
        });
    }
  }, [projectId]);

  // Render project navigation tabs
  const renderTabs = () => {
    if (!projectId) return null;
    
    interface Tab {
      label: string;
      href: string;
      isActive: boolean;
      revisionNumber?: number;
    }
    
    const tabs: Tab[] = [];
    const historyTabs: RevisionTab[] = [];
    
    // Photo Submission tab removed - no longer needed
    
    if (revisions.length > 0) {
      // Find the latest revision (highest revision number)
      const latestRevision = revisions.reduce((latest, rev) => 
        rev.revisionNumber > latest.revisionNumber ? rev : latest
      );
      
      // Calculate isActive for latest revision (always delivery for demo)
      const latestIsActive = (
        (latestRevision.revisionNumber === 0 && revisionNumber === null) ||
        (latestRevision.revisionNumber === revisionNumber)
      );
      
      // Latest revision goes to main tab (leftmost)
      if (latestRevision.revisionNumber === 0) {
        tabs.push({
          label: 'Photo Delivery',
          href: latestRevision.deliveryUrl,
          isActive: latestIsActive,
          revisionNumber: 0,
        });
      } else {
        tabs.push({
          label: `Revision ${latestRevision.revisionNumber} (Latest)`,
          href: latestRevision.deliveryUrl,
          isActive: latestIsActive,
          revisionNumber: latestRevision.revisionNumber,
        });
      }
      
      // All other revisions go to History Delivery dropdown
      revisions.forEach((rev) => {
        // Skip the latest revision (already in main tab)
        if (rev.revisionNumber === latestRevision.revisionNumber) {
          return;
        }
        
        const isActive = (
          (rev.revisionNumber === 0 && revisionNumber === null) ||
          (rev.revisionNumber === revisionNumber)
        );
        
        if (rev.revisionNumber === 0) {
          // Draft Delivery (revision 0) in dropdown
          historyTabs.push({
            label: 'Draft Delivery',
            href: rev.deliveryUrl,
            isActive,
            revisionNumber: 0,
          });
        } else {
          // Other revisions in dropdown
          historyTabs.push({
            label: `Photo Revisions ${rev.revisionNumber}`,
            href: rev.deliveryUrl,
            isActive,
            revisionNumber: rev.revisionNumber,
          });
        }
      });
      
      // Sort history tabs: Draft Delivery first, then revisions in descending order
      historyTabs.sort((a, b) => {
        if (a.revisionNumber === 0) return -1; // Draft Delivery first
        if (b.revisionNumber === 0) return 1;
        return (b.revisionNumber || 0) - (a.revisionNumber || 0); // Descending order
      });
    } else {
      // If no revisions yet, still show Delivery tab (always delivery for demo)
      tabs.push({
        label: 'Photo Delivery',
        href: `/projects?page=${projectId}/delivery`,
        isActive: true,
        revisionNumber: 0,
      });
    }
    
    // Determine current selected revision for dropdown display
    // Find the active tab in history tabs (if any)
    const currentHistoryTab = historyTabs.find(tab => tab.isActive) || 
      (historyTabs.length > 0 ? historyTabs[0] : null);
    
    // Common container styles for all tabs (active and inactive)
    const tabContainerBaseStyle: React.CSSProperties = {
      display: 'inline-flex',
      width: '180px', // Increased from 156px to accommodate "Revision X (Latest)" text
      height: '36px',
      padding: '0 var(--spacing-xs, 4px) 0 var(--spacing-xs, 4px)',
      paddingBottom: 'var(--spacing-lg, 12px)',
      justifyContent: 'flex-start', 
      alignItems: 'center',
      gap: 'var(--spacing-md, 8px)',
      position: 'relative',
      pointerEvents: 'auto',
      boxSizing: 'border-box',
    };
    
    return (
      <div className="delivery-revision-tabs-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <nav className="mt-12 flex gap-6 delivery-revision-tabs-nav" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap' }}>
          {/* Regular tabs */}
        {tabs.map((tab) => (
            <div
              key={tab.href}
              className="delivery-revision-tab-item"
              style={{
                ...tabContainerBaseStyle,
                borderBottom: tab.isActive 
                  ? '2px solid var(--Neutral-Dark900, #000B14)' 
                  : 'none',
                zIndex: tab.isActive ? 3 : 2,
              }}
            >
          <Link
            href={tab.href as '/projects'}
                style={{
                  color: 'var(--Neutral-Dark900, #000B14)',
                  fontFamily: 'var(--Font-family-font-family-body, Inter)',
                  fontSize: 'var(--Font-size-text-md, 16px)',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'var(--Line-height-text-md, 24px)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
          >
            {tab.label}
          </Link>
            </div>
        ))}
          
          {/* History Delivery dropdown menu - only show if there are history revisions */}
          {historyTabs.length > 0 && currentHistoryTab && (
            <RevisionDropdown 
              currentTab={currentHistoryTab}
              allRevisions={historyTabs}
              dropdownLabel="History Delivery"
            />
          )}
      </nav>
        {/* Status line for delivery page - always show for delivery */}
        <div
          style={{
            display: 'flex',
            height: '36px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0px',
            alignSelf: 'stretch',
            marginTop: '-44px',
            borderBottom: '1px solid var(--Colors-Border-border-secondary, #E9EAEB)',
            position: 'relative',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  };

  // Render based on view type - Only delivery view for demo
  const renderContent = () => {
    if (!projectId || !view) {
      // No project or view specified - show default/empty state
      return (
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">The page you are looking for is not found. Please contact support if you need help.</p>
          </div>
        </div>
      );
    }

    // Protect submitted page: don't render if not all photos are uploaded - COMMENTED OUT
    // Wait for check to complete before redirecting to prevent flash
    // if (view === 'submitted') {
    //   if (isCheckingUpload) {
    //     // Don't render anything while checking to prevent flash
    //     return null;
    //   }
    //   if (!isAllPhotosUploaded) {
    //     return (
    //       <div className="w-full min-h-[400px] flex items-center justify-center">
    //         <div className="text-center">
    //           <p className="text-gray-600">Redirecting to upload page...</p>
    //         </div>
    //       </div>
    //     );
    //   }
    // }
    
    // Protect upload page: don't render if all photos are uploaded - COMMENTED OUT
    // Wait for check to complete before redirecting to prevent flash
    // if (view === 'upload') {
    //   if (isCheckingUpload) {
    //     // Don't render anything while checking to prevent flash
    //     return null;
    //   }
    //   if (isAllPhotosUploaded) {
    //     return (
    //       <div className="w-full min-h-[400px] flex items-center justify-center">
    //         <div className="text-center">
    //           <p className="text-gray-600">Redirecting to submitted page...</p>
    //         </div>
    //       </div>
    //     );
    //   }
    // }

    // if (view === 'upload') {
    //   return <UploadLayout projectId={projectId} />;
    // }

    if (view === 'delivery') {
      return <DeliveryLayout projectId={projectId} revisionNumber={revisionNumber} />;
    }

    // if (view === 'submitted') {
    //   return <SubmittedLayout projectId={projectId} />;
    // }

    return null;
  };

  return (
    <div style={{ width: '100%', minHeight: '100%' }}>
      {renderContent()}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsPageContent />
    </Suspense>
  );
}
