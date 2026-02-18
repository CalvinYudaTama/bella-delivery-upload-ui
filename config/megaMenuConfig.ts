/**
 * Mega Menu Configuration
 * Extracted from Shopify theme header-group.json
 * Contains all menu structures for Services, Lookbook, Locations, Case Studies
 */

export interface MegaMenuServiceCard {
  title: string;
  image: string;
  description: string;
  url: string;
}

export interface MegaMenuCategory {
  categoryTitle: string;
  cards: MegaMenuServiceCard[];
}

export interface MegaMenuBrandLogo {
  logo: string;
  url: string;
  name: string;
}

export interface MegaMenuLocation {
  title: string;
  text: string;
  url: string;
}

// ==================== SERVICES MEGA MENU ====================
export const SERVICES_CATEGORIES: MegaMenuCategory[] = [
  {
    categoryTitle: "Virtual Staging Services",
    cards: [
      {
        title: "Virtual Staging Services",
        image: "/mega-menu/virtual-staging.svg",
        description: "Photo realistic digital home staging 6-12 HR turnaround",
        url: "https://www.bellavirtual.com/products/virtual-staging"
      },
      {
        title: "Virtual Furniture Staging Services",
        image: "/mega-menu/furniture-staging.svg",
        description: "Professional Studio services with 24-48 HR turnaround",
        url: "https://www.bellavirtual.com/products/virtual-furniture-removal-and-replacement-service"
      },
      {
        title: "Virtual Renovation & Staging",
        image: "/mega-menu/renovation.svg",
        description: "Digital home upgrades and fresh staging.",
        url: "https://www.bellavirtual.com/products/virtual-renovation-service"
      },
      {
        title: "Virtual 3D House Tour",
        image: "/mega-menu/3d-tour.svg",
        description: "Immersive 3D virtual view of the property.",
        url: "https://www.bellavirtual.com/products/3d-virtual-tour-home-staging"
      },
      {
        title: "Virtual Design My Room",
        image: "/mega-menu/design-room.svg",
        description: "Professional service with 24-48 hour turnaround",
        url: "https://www.bellavirtual.com/products/design-my-room"
      },
      {
        title: "Furniture Removal & Virtual Staging",
        image: "/mega-menu/furniture-removal.svg",
        description: "Remove clutter, add virtual staging.",
        url: "https://www.bellavirtual.com/products/virtual-furniture-removal-and-replacement-service"
      }
    ]
  },
  {
    categoryTitle: "3D Rendering Services",
    cards: [
      {
        title: "Residential 3D",
        image: "/mega-menu/residential-3d.svg",
        description: "Photorealistic residential 3D renders.",
        url: "https://www.bellavirtual.com/products/3d-rendering-service-for-architectural-visualization"
      },
      {
        title: "Commercial Rendering",
        image: "/mega-menu/commercial-rendering.svg",
        description: "High-quality commercial visualizations.",
        url: "https://www.bellavirtual.com/products/commercial-rendering"
      }
    ]
  },
  {
    categoryTitle: "Floor Plan Creator Services",
    cards: [
      {
        title: "2D & 3D Floor Plans",
        image: "/mega-menu/floor-plans.svg",
        description: "Professional floor plans that help buyers visualize space layout and flow with precision measurements.",
        url: "https://www.bellavirtual.com/products/2d-3d-floor-plan-service"
      }
    ]
  },
  {
    categoryTitle: "Photo Editing Services",
    cards: [
      {
        title: "HDR Photo Editing",
        image: "/mega-menu/hdr-editing.svg",
        description: "Professional HDR enhancement for listings.",
        url: "https://www.bellavirtual.com/products/hdr-photo-editing"
      },
      {
        title: "Real Estate Photo Editing",
        image: "/mega-menu/photo-editing.svg",
        description: "Color correction and professional touch-ups.",
        url: "https://www.bellavirtual.com/products/real-estate-photo-editing"
      }
    ]
  }
];

// ==================== LOOKBOOK MEGA MENU ====================
export const LOOKBOOK_BRANDS: MegaMenuBrandLogo[] = [
  {
    name: "Crate & Barrel",
    logo: "/brands/crate-barrel.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/crate-&-barrel"
  },
  {
    name: "Article Company",
    logo: "/brands/article.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/article-company"
  },
  {
    name: "EQ3",
    logo: "/brands/eq3.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/eq3"
  },
  {
    name: "Rove Concepts",
    logo: "/brands/rove-concepts.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/rove-concepts"
  },
  {
    name: "Gus Modern",
    logo: "/brands/gus-modern.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/gus-modern"
  },
  {
    name: "MGBW",
    logo: "/brands/mgbw.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/mgbw"
  },
  {
    name: "Roche Bobois",
    logo: "/brands/roche-bobois.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/rochebobois"
  },
  {
    name: "Hooker Furniture",
    logo: "/brands/hooker-furniture.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/hooker-furniture"
  },
  {
    name: "Eternity Modern",
    logo: "/brands/eternity-modern.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/eternity-modern"
  },
  {
    name: "Sundays",
    logo: "/brands/sundays.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/sundays"
  },
  {
    name: "King Living",
    logo: "/brands/king-living.png",
    url: "https://lookbook.bellavirtualstaging.com/brands/king-living"
  }
];

export const LOOKBOOK_FEATURED = {
  title: "Explore Lookbooks",
  description: "Discover our curated collection of designer furniture and decor",
  url: "https://lookbook.bellavirtualstaging.com/",
  bgColor: "#4f46e5",
  textColor: "#ffffff"
};

// ==================== LOCATIONS MEGA MENU ====================
export const LOCATIONS: MegaMenuLocation[] = [
  {
    title: "Vancouver, BC",
    text: "Our flagship location in beautiful Vancouver, featuring modern design and stunning mountain views.",
    url: "https://www.bellavirtual.com/pages/vancouver"
  },
  {
    title: "Toronto, ON",
    text: "Located in the financial district, our Toronto office combines elegance with functionality.",
    url: "https://www.bellavirtual.com/pages/toronto"
  },
  {
    title: "Montreal, QC",
    text: "A creative space in the heart of Montreal's artistic district, perfect for innovative projects.",
    url: "https://www.bellavirtual.com/pages/montreal"
  },
  {
    title: "Los Angeles, CA",
    text: "Situated in downtown LA, offering premium staging services with Hollywood-quality aesthetics.",
    url: "https://www.bellavirtual.com/pages/los-angeles"
  },
  {
    title: "Boston, MA",
    text: "Blending traditional charm with contemporary staging in one of America's oldest cities.",
    url: "https://www.bellavirtual.com/pages/boston"
  },
  {
    title: "San Francisco, CA",
    text: "Innovative staging solutions in the tech capital, serving the Bay Area's unique market.",
    url: "https://www.bellavirtual.com/pages/san-francisco"
  },
  {
    title: "Las Vegas, NV",
    text: "Bringing high-end staging to the entertainment capital, perfect for luxury properties.",
    url: "https://www.bellavirtual.com/pages/las-vegas"
  },
  {
    title: "New York, NY",
    text: "Located in Manhattan's heart, delivering world-class staging for urban luxury homes.",
    url: "https://www.bellavirtual.com/pages/new-york"
  },
  {
    title: "Philadelphia, PA",
    text: "Serving historic Philadelphia with modern staging solutions for classic and contemporary homes.",
    url: "https://www.bellavirtual.com/pages/philadelphia"
  },
  {
    title: "Seattle, WA",
    text: "Innovative staging solutions in the tech capital, serving the Pacific Northwest's unique market.",
    url: "https://www.bellavirtual.com/pages/seattle"
  },
  {
    title: "Chicago, IL",
    text: "Experience our premium location with stunning skyline views and modern amenities.",
    url: "https://www.bellavirtual.com/pages/chicago"
  },
  {
    title: "Atlanta, GA",
    text: "Bringing sophisticated staging to the South, combining hospitality with modern design.",
    url: "https://www.bellavirtual.com/pages/atlanta"
  }
];

// ==================== CASE STUDIES MEGA MENU ====================
export const CASE_STUDIES = {
  title: "Case Studies",
  description: "Explore our portfolio of successful staging projects",
  url: "https://www.bellavirtual.com/pages/case-studies",
  items: [
    {
      title: "Luxury Condo Downtown",
      image: "/case-studies/condo.jpg",
      description: "Modern staging for high-end urban living",
      url: "https://www.bellavirtual.com/pages/case-study-condo"
    },
    {
      title: "Suburban Family Home",
      image: "/case-studies/family-home.jpg",
      description: "Warm and inviting staging for family buyers",
      url: "https://www.bellavirtual.com/pages/case-study-family"
    },
    {
      title: "Beachfront Property",
      image: "/case-studies/beachfront.jpg",
      description: "Coastal elegance meets modern comfort",
      url: "https://www.bellavirtual.com/pages/case-study-beach"
    }
  ]
};
