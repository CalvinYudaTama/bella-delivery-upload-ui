'use client';

import React, { useState } from 'react';
import { useProjectContext } from '../Upload/context/ProjectContext';
import { useCollection } from '@/contexts/CollectionContext';
import { PDFService } from '@/services/pdfService';
import { HomepageFilterService } from '@/services/homepageFilterService';

const DownloadContentButton: React.FC = () => {
  const { state } = useProjectContext();
  const { items: collectionItems } = useCollection();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleDownloadContent = async () => {
    try {
      console.log('Downloading submitted content...');
      
      // Generate PDF
      const photosWithRoomInfo = await HomepageFilterService.getPhotosWithRoomInfo(
        collectionItems.map(item => item.imageId)
      );
      
      const projectData = {
        id: `project-${Date.now()}`,
        orderId: localStorage.getItem('currentOrderId') || Date.now().toString(),
        images: state.uploadedImages,
        selectedStyles: collectionItems.map(item => {
          const photoInfo = photosWithRoomInfo.find(photo => photo.id === item.imageId);
          return {
            imageId: item.imageId,
            imageUrl: item.imageUrl,
            title: item.title,
            brandName: item.brandName || '',
            roomType: photoInfo?.room_type || '',
            roomStyle: photoInfo?.style || '',
            sku: photoInfo?.name || item.imageId.slice(-8).toUpperCase()
          };
        }),
        comment: state.comment || '',
        address: state.address || '',
        submittedAt: new Date()
      };
      
      const pdfBlob = await PDFService.generateProjectPDF(projectData);
      
      // Download PDF
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${projectData.orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Content downloaded successfully');
    } catch (error) {
      console.error('Failed to download content:', error);
      alert('Download failed: ' + (error as Error).message);
    }
  };
  
  return (
    <div style={{ marginTop: '42px' }}>
      <button
        onClick={handleDownloadContent}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          width: '300px',
          padding: '12px 32px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
          borderRadius: '6px',
          border: '1px solid #000',
          background: isHovered ? '#000' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          color: isHovered ? '#FFF' : 'var(--Copy-Dark900, #000B14)',
          fontFamily: 'Inter',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '20px',
          letterSpacing: '0.16px'
        }}
      >
        <span style={{ whiteSpace: 'nowrap' }}>Download Content Submitted</span>
        {/* Download Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path 
            d="M2 11v1.5c0 .398.158.78.439 1.061.28.281.663.439 1.061.439h9c.398 0 .78-.158 1.061-.439.281-.28.439-.663.439-1.061V11" 
            stroke={isHovered ? 'var(--neutral-0)' : 'var(--neutral-900)'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path 
            d="M4.5 7L8 10.5L11.5 7" 
            stroke={isHovered ? 'var(--neutral-0)' : 'var(--neutral-900)'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path 
            d="M8 10.5V2" 
            stroke={isHovered ? 'var(--neutral-0)' : 'var(--neutral-900)'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default DownloadContentButton;

