import { COMPANY_IDS } from '@/services/brandService';

export interface BrandConfig {
  name: string;
  companyId?: number; // Optional because not all brands may have company IDs
  logo: string; // Black logo for normal display
  whiteLogo?: string; // White logo for hover overlay display
  banner?: string; // Banner image for brand page (camelCase filename in Partners_catalog_cover folder)
  // All logos are now same height, so no need for custom sizes
  // imageWidth?: number; // For ProjectBrandSelectionModal (upload page)
  // imageHeight?: number; // For ProjectBrandSelectionModal (upload page)
  // containerPadding?: number; // For ProjectBrandSelectionModal (upload page)
  // homepageLogoWidth?: number; // For BrandSelectionModal (homepage)
  // homepageLogoHeight?: number; // For BrandSelectionModal (homepage)
}

/**
 * Unified brand configuration for logo display
 * All logos are located in /brands/Furniture_partners_logo_black/
 * File names use PascalCase (e.g., EternityModern-black.png)
 * All logos are now same height, so no custom sizes needed
 * 
 * For BrandSelectionModal (homepage): uses Image component with logo
 * For ProjectBrandSelectionModal (upload page): uses Image component with logo
 * 
 * Note: Order matters for BrandSelectionModal (homepage) - listed brands appear in this order
 */
export const BRAND_CONFIGS: BrandConfig[] = [
  // 1. Rove Concepts
  {
    name: 'Rove Concepts',
    companyId: COMPANY_IDS['Rove Concepts'],
    logo: '/brands/Furniture_partners_logo_black/RoveConcepts-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/RoveConcepts-white.png',
    banner: '/brands/Partners_catalog_cover/roveCover.jpg',
  },
  // 2. Gus Modern
  {
    name: 'Gus Modern',
    companyId: COMPANY_IDS['Gus Modern'],
    logo: '/brands/Furniture_partners_logo_black/GusModernBlackLogo-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/GusModernBlackLogo-white.png',
    banner: '/brands/Partners_catalog_cover/gusCover.jpg',
  },
  // 3. Eternity Modern
  {
    name: 'Eternity Modern',
    companyId: COMPANY_IDS['Eternity Modern'],
    logo: '/brands/Furniture_partners_logo_black/EternityModern-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/EternityModern-white.png',
    banner: '/brands/Partners_catalog_cover/eternityModernCover.jpg',
  },
  // 4. Sundays
  {
    name: 'Sundays',
    companyId: COMPANY_IDS['Sundays'],
    logo: '/brands/Furniture_partners_logo_black/Sundays-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/Sundays-white.png',
    banner: '/brands/Partners_catalog_cover/sundaysCover.jpg',
  },
  // 5. Mobital
  {
    name: 'Mobital',
    companyId: COMPANY_IDS['Mobital'],
    logo: '/brands/Furniture_partners_logo_black/Mobital-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/Mobital-white.png',
    banner: '/brands/Partners_catalog_cover/mobitalCover.jpg',
  },
  // 6. Rochebobois
  {
    name: 'Rochebobois',
    companyId: COMPANY_IDS['Rochebobois'],
    logo: '/brands/Furniture_partners_logo_black/RocheBobois-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/RocheBobois-white.png',
    banner: '/brands/Partners_catalog_cover/rochebobois-cover.jpg',
  },
  // Additional brands (aligned with catalog brand list)
  {
    name: 'Article Company',
    companyId: COMPANY_IDS['Article Company'],
    logo: '/brands/Furniture_partners_logo_black/ArticleCompany-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/ArticleCompany-white.png',
    banner: '/brands/Partners_catalog_cover/articleCover.jpg',
  },
  {
    name: 'Crate & Barrel',
    companyId: COMPANY_IDS['Crate & Barrel'],
    logo: '/brands/Furniture_partners_logo_black/CrateBarrel-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/CrateBarrel-white.png',
    banner: '/brands/Partners_catalog_cover/crateCover.jpg',
  },
  {
    name: 'EQ3',
    companyId: COMPANY_IDS['EQ3'],
    logo: '/brands/Furniture_partners_logo_black/EQ3Logo-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/EQ3Logo-white.png',
    banner: '/brands/Partners_catalog_cover/eq3-cover.jpg',
  },
  {
    name: 'Hooker Furniture',
    companyId: COMPANY_IDS['Hooker Furniture'],
    logo: '/brands/Furniture_partners_logo_black/HookerFurniture-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/HookerFurniture-white.png',
    banner: '/brands/Partners_catalog_cover/hookerCover.jpg',
  },
  {
    name: 'King Living',
    companyId: COMPANY_IDS['King Living'],
    logo: '/brands/Furniture_partners_logo_black/KingLivingLogo-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/KingLivingLogo-white.png',
    banner: '/brands/Partners_catalog_cover/kingCover.jpg',
  },
  {
    name: 'MGBW',
    companyId: COMPANY_IDS['MGBW'],
    banner: '/brands/Partners_catalog_cover/mitchellCover.jpg',
    logo: '/brands/Furniture_partners_logo_black/MGBWLogo-black.png',
    whiteLogo: '/brands/Furniture_partners_logos_white/MGBWLogo-white.png',
  },
];

/**
 * Get brand config by name
 */
export const getBrandConfig = (brandName: string): BrandConfig | undefined => {
  return BRAND_CONFIGS.find(brand => brand.name === brandName);
};

/**
 * Get brand config by company ID
 */
export const getBrandConfigByCompanyId = (companyId: number): BrandConfig | undefined => {
  return BRAND_CONFIGS.find(brand => brand.companyId === companyId);
};
