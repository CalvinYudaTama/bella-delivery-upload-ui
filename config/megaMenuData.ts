/**
 * Mega Menu Content Data
 * 
 * This file contains the default content for all mega menus,
 * matching the structure and default values from Shopify Header Code.
 * 
 * Note: In production, this data should come from a CMS or API,
 * but for now we use these defaults to match the Header Code structure.
 */

import {
  SERVICES_URLS,
  LOCATION_URLS,
  LOOKBOOK_URLS,
  CASE_STUDIES_URLS,
} from './url.config';

// ============================================
// SERVICES MENU DATA
// ============================================
export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  icon?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  handle: string;
  url: string;
  services: ServiceCard[];
}

export const SERVICES_MENU_DATA: ServiceCategory[] = [
  {
    id: '1',
    title: 'Virtual Staging Services',
    handle: 'virtual-staging-services',
    url: SERVICES_URLS.VIRTUAL_STAGING,
    services: [
      {
        id: '1',
        title: 'Virtual Staging Services',
        description: 'Photo realistic digital home staging 6-12 HR turnaround',
        url: SERVICES_URLS.VIRTUAL_STAGING,
        icon: '/ServiceIconsMegamenu/virtualStaging.svg',
      },
      {
        id: '2',
        title: 'Virtual Furniture Staging Services',
        description: 'Professional Studio services with 24-48 HR turnaround',
        url: SERVICES_URLS.FURNITURE_REMOVAL,
        icon: '/ServiceIconsMegamenu/virtualDesignMyRoomAndVirtualRemoval.svg',
      },
      {
        id: '3',
        title: 'Virtual Renovation & Staging',
        description: 'Digital home upgrades and fresh staging.',
        url: SERVICES_URLS.VIRTUAL_RENOVATION,
        icon: '/ServiceIconsMegamenu/virtualRenovation.svg',
      },
      {
        id: '4',
        title: 'Virtual 3D House Tour',
        description: 'Immersive 3D virtual view of the property.',
        url: SERVICES_URLS.VIRTUAL_3D_TOUR,
        icon: '/ServiceIconsMegamenu/virtual3DHouseTour.svg',
      },
      {
        id: '5',
        title: 'Virtual Design My Room',
        description: 'Professional service with 24-48 hour turnaround',
        url: SERVICES_URLS.DESIGN_MY_ROOM,
        icon: '/ServiceIconsMegamenu/virtualDesignMyRoomAndVirtualRemoval.svg',
      },
      {
        id: '6',
        title: 'Furniture Removal & Virtual Staging',
        description: 'Remove clutter, add virtual staging.',
        url: SERVICES_URLS.FURNITURE_REMOVAL,
        icon: '/ServiceIconsMegamenu/virtualDesignMyRoomAndVirtualRemoval.svg',
      },
    ],
  },
  {
    id: '2',
    title: '3D Rendering Services',
    handle: '3d-rendering-services',
    url: SERVICES_URLS.RESIDENTIAL_3D,
    services: [
      {
        id: '6',
        title: 'Residential 3D',
        description: 'Photorealistic residential 3D renders.',
        url: SERVICES_URLS.RESIDENTIAL_3D,
        icon: '/ServiceIconsMegamenu/residential3D.svg',
      },
      {
        id: '7',
        title: 'Commercial Rendering',
        description: 'High-quality commercial visualizations.',
        url: SERVICES_URLS.COMMERCIAL_RENDERING,
        icon: '/ServiceIconsMegamenu/commercialRendering.svg',
      },
    ],
  },
  {
    id: '3',
    title: 'Floor Plan Creator Services',
    handle: 'floor-plan-creator-services',
    url: SERVICES_URLS.FLOOR_PLAN_2D_3D,
    services: [
      {
        id: '8',
        title: '2D & 3D Floor Plans',
        description: 'Professional floor plans that help buyers visualize space layout and flow with precision measurements.',
        url: SERVICES_URLS.FLOOR_PLAN_2D_3D,
        icon: '/ServiceIconsMegamenu/twoDThreeDFloorplans.svg',
      },
    ],
  },
  {
    id: '4',
    title: 'Photo Editing Services',
    handle: 'photo-editing-services',
    url: SERVICES_URLS.HDR_PHOTO_EDITING,
    services: [
      {
        id: '9',
        title: 'HDR Photo Editing',
        description: 'Professional HDR enhancement for listings.',
        url: SERVICES_URLS.HDR_PHOTO_EDITING,
        icon: '/ServiceIconsMegamenu/hdrPhotoEditing.svg',
      },
      {
        id: '10',
        title: 'Real Estate Photo Editing',
        description: 'Color correction and professional touch-ups.',
        url: SERVICES_URLS.REAL_ESTATE_PHOTO_EDITING,
        icon: '/ServiceIconsMegamenu/realEstatePhotoEditing.svg',
      },
    ],
  },
];

// ============================================
// LOCATION MENU DATA
// ============================================
export interface LocationCard {
  id: string;
  title: string;
  url: string;
  description: string;
}

// Location data from actual Header Code implementation
export const LOCATION_MENU_DATA: LocationCard[] = [
  {
    id: '1',
    title: 'Vancouver, CA',
    url: LOCATION_URLS.VANCOUVER,
    description: 'Our flagship location in beautiful Vancouver, featuring modern design and stunning mountain views.',
  },
  {
    id: '2',
    title: 'Toronto',
    url: LOCATION_URLS.TORONTO,
    description: 'Located in the financial district, our Toronto office combines elegance with functionality.',
  },
  {
    id: '3',
    title: 'Montreal',
    url: LOCATION_URLS.MONTREAL,
    description: 'A creative space in the heart of Montreal\'s artistic district, perfect for innovative projects.',
  },
  {
    id: '4',
    title: 'Los Angeles',
    url: LOCATION_URLS.LOS_ANGELES,
    description: 'Situated in downtown LA, offering premium staging services with Hollywood-quality aesthetics.',
  },
  {
    id: '5',
    title: 'Boston',
    url: LOCATION_URLS.BOSTON,
    description: 'Blending traditional charm with contemporary staging in one of America\'s oldest cities.',
  },
  {
    id: '6',
    title: 'California',
    url: LOCATION_URLS.CALIFORNIA,
    description: 'Innovative staging solutions in the tech capital, serving the Bay Area\'s unique market.',
  },
  {
    id: '7',
    title: 'Las Vegas',
    url: LOCATION_URLS.LAS_VEGAS,
    description: 'Bringing high-end staging to the entertainment capital, perfect for luxury properties.',
  },
  {
    id: '8',
    title: 'New York City',
    url: LOCATION_URLS.NEW_YORK,
    description: 'Located in Manhattan\'s heart, delivering world-class staging for urban luxury homes.',
  },
  {
    id: '9',
    title: 'Philadelphia',
    url: LOCATION_URLS.PHILADELPHIA,
    description: 'Serving historic Philadelphia with modern staging solutions for classic and contemporary homes.',
  },
  {
    id: '10',
    title: 'Florida',
    url: LOCATION_URLS.FLORIDA,
    description: 'Innovative staging solutions in the tech capital, serving the Bay Area\'s unique market.',
  },
  {
    id: '11',
    title: 'Chicago',
    url: LOCATION_URLS.CHICAGO,
    description: 'Experience our premium location with stunning skyline views and modern amenities.',
  },
  {
    id: '12',
    title: 'Atlanta',
    url: LOCATION_URLS.ATLANTA,
    description: 'Bringing sophisticated staging to the South, combining hospitality with modern design.',
  },
];

// ============================================
// LOOKBOOK MENU DATA
// ============================================
export interface LookbookFeatured {
  title: string;
  description: string;
  url: string;
  bgColor: string;
  textColor: string;
}

export interface LookbookBrand {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

export const LOOKBOOK_MENU_DATA = {
  featured: {
    title: 'Explore Lookbooks',
    description: 'Discover our curated collection of designer furniture and decor.',
    url: LOOKBOOK_URLS.HOME,
    bgColor: '#4F46E5',
    textColor: '#FFFFFF',
  },
  // Brands will be populated from BRAND_CONFIGS in specific order
  // Order: Crate & Barrel, Article Company, EQ3, Rove Concepts, Gus Modern, MGBW, Rochebobois, Hooker Furniture, Eternity Modern, Sundays, King Living, then empty card
};

// ============================================
// CASE STUDIES MENU DATA
// ============================================
export interface CaseStudy {
  id: string;
  title: string;
  url: string;
}

// Case Studies data from actual Header Code implementation
export const CASE_STUDIES_MENU_DATA: CaseStudy[] = [
  {
    id: '1',
    title: 'Realtors',
    url: CASE_STUDIES_URLS.REALTORS,
  },
  {
    id: '2',
    title: 'Home Builder',
    url: CASE_STUDIES_URLS.HOME_BUILDER,
  },
  {
    id: '3',
    title: 'Property Manager',
    url: CASE_STUDIES_URLS.PROPERTY_MANAGER,
  },
];

