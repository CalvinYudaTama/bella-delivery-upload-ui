/**
 * Mock Data for Delivery Page Demo
 * 
 * This file contains fake data to simulate backend API responses
 * for the delivery page frontend development.
 */

// Generate fake image URLs using placeholder services
const generateImageUrl = (id: string, width = 800, height = 600) => {
  return `https://picsum.photos/seed/${id}/${width}/${height}`;
};

// Mock project data
export const mockProjectData = {
  id: 'demo-project-123',
  name: 'Demo Project',
  service_stats: [
    {
      total_jobs: 5,
      uploaded_count: 5,
      remaining: 0,
    },
  ],
};

// Mock revisions list
export const mockRevisionsList = [
  {
    revisionNumber: 2,
    deliveryUrl: '/projects?page=demo-project-123/delivery&revision=2',
    generatedAt: new Date().toISOString(),
    imageCount: 8,
  },
  {
    revisionNumber: 1,
    deliveryUrl: '/projects?page=demo-project-123/delivery&revision=1',
    generatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    imageCount: 6,
  },
  {
    revisionNumber: 0,
    deliveryUrl: '/projects?page=demo-project-123/delivery',
    generatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    imageCount: 5,
  },
];

// Generate mock delivery images
const generateMockImages = (count: number, revisionNumber: number, baseId = 'img') => {
  return Array.from({ length: count }, (_, index) => {
    const id = `${baseId}-${revisionNumber}-${index + 1}`;
    const revisionId = `rev-${revisionNumber}-${index + 1}`;
    const now = new Date();
    const createdAt = new Date(now.getTime() - (count - index) * 3600000).toISOString(); // Staggered times
    const readyForDelivery = new Date(now.getTime() - (count - index) * 1800000).toISOString();

    return {
      id,
      revisionId,
      url: generateImageUrl(id),
      jobId: `job-${revisionNumber}-${index + 1}`,
      createdAt,
      readyForDelivery,
      revisionStatus: {
        delivered: readyForDelivery as string | null, // All images are delivered by default
        accepted: null as string | null,
        rejected: null as string | null,
        revision_requested: null as string | null,
      },
    };
  });
};

// Mock delivery data for different revisions
export const getMockDeliveryData = (projectId: string, revisionNumber: number | null = null) => {
  const revision = revisionNumber ?? 0;
  const imageCount = revision === 0 ? 5 : revision === 1 ? 6 : 8;
  
  const images = generateMockImages(imageCount, revision);
  
  // For all revisions, mark all images as delivered (so Accept/Reject buttons will show)
  images.forEach((img) => {
    img.revisionStatus.delivered = img.readyForDelivery || new Date().toISOString();
  });
  
  // For revision 1, mark some as accepted (for demo variety)
  if (revision === 1) {
    images.forEach((img, index) => {
      if (index < 2) {
        img.revisionStatus.accepted = new Date().toISOString() as string | null;
        // If accepted, still keep delivered status
      }
    });
  }
  
  // For revision 2, mark some as accepted and some as rejected (for demo variety)
  if (revision === 2) {
    images.forEach((img, index) => {
      if (index < 3) {
        img.revisionStatus.accepted = new Date().toISOString() as string | null;
      } else if (index < 5) {
        img.revisionStatus.rejected = new Date().toISOString() as string | null;
      }
    });
  }

  return {
    projectId,
    revisionNumber: revision,
    images,
    completedImages: revision > 0 ? generateMockImages(3, 0, 'completed') : [],
    statistics: {
      totalImages: imageCount,
      readyCount: imageCount,
      pendingCount: 0,
    },
    message: `Delivery data for revision ${revision}`,
  };
};
