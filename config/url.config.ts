/**
 * URL Configuration
 * Centralized URL management for the entire project
 */

// ============================================
// BASE DOMAINS
// ============================================
export const DOMAINS = {
  BELLA_STAGING: 'https://www.bellavirtual.com',
  BELLA_LOOKBOOK: 'https://lookbook.bellavirtualstaging.com',
} as const;

// ============================================
// HEADER MEGA MENU URLs
// ============================================

// Our Location URLs
export const LOCATION_URLS = {
  VANCOUVER: `${DOMAINS.BELLA_STAGING}/pages/virtual-staging-in-vancouver`,
  TORONTO: `${DOMAINS.BELLA_STAGING}/pages/virtual-staging-in-toronto`,
  MONTREAL: `${DOMAINS.BELLA_STAGING}/pages/virtual-staging-in-montreal`,
  LOS_ANGELES: `${DOMAINS.BELLA_STAGING}/pages/virtual-staging-in-los-angeles`,
  BOSTON: `${DOMAINS.BELLA_STAGING}/pages/virtual-home-staging-boston-ma`,
  CALIFORNIA: `${DOMAINS.BELLA_STAGING}/pages/virtual-home-staging-in-california`,
  LAS_VEGAS: `${DOMAINS.BELLA_STAGING}/pages/virtual-staging-in-las-vegas-nv`,
  NEW_YORK: `${DOMAINS.BELLA_STAGING}/pages/virtual-staging-in-new-york-city`,
  PHILADELPHIA: `${DOMAINS.BELLA_STAGING}/pages/virtual-staging-in-philadelphia`,
  FLORIDA: `${DOMAINS.BELLA_STAGING}/pages/virtual-staging-in-florida`,
  CHICAGO: `${DOMAINS.BELLA_STAGING}/pages/virtual-staging-in-chicago`,
  ATLANTA: `${DOMAINS.BELLA_STAGING}/pages/virtual-staging-in-atlanta`,
} as const;

// Case Studies URLs
export const CASE_STUDIES_URLS = {
  REALTORS: `${DOMAINS.BELLA_STAGING}/pages/case-studies-realtors`,
  HOME_BUILDER: `${DOMAINS.BELLA_STAGING}/pages/case-studies-home-builder`,
  PROPERTY_MANAGER: `${DOMAINS.BELLA_STAGING}/pages/case-studies-property-manager`,
} as const;

// Lookbook URLs
export const LOOKBOOK_URLS = {
  HOME: `${DOMAINS.BELLA_LOOKBOOK}/`,
  ROVE_CONCEPTS: `${DOMAINS.BELLA_LOOKBOOK}/brands/rove-concepts`,
  GUS_MODERN: `${DOMAINS.BELLA_LOOKBOOK}/brands/gus-modern`,
  SUNDAYS: `${DOMAINS.BELLA_LOOKBOOK}/brands/sundays`,
  MOBITAL: `${DOMAINS.BELLA_LOOKBOOK}/brands/mobital`,
  ARTICLE_COMPANY: `${DOMAINS.BELLA_LOOKBOOK}/brands/article-company`,
  EQ3: `${DOMAINS.BELLA_LOOKBOOK}/brands/eq3`,
  HOOKER_FURNITURE: `${DOMAINS.BELLA_LOOKBOOK}/brands/hooker-furniture`,
  MGBW: `${DOMAINS.BELLA_LOOKBOOK}/brands/mgbw`,
  ETERNITY_MODERN: `${DOMAINS.BELLA_LOOKBOOK}/brands/eternity-modern`,
  KING_LIVING: `${DOMAINS.BELLA_LOOKBOOK}/brands/king-living`,
  // Canonical slug (legacy "crate-&-barrel" is redirected/accepted)
  CRATE_BARREL: `${DOMAINS.BELLA_LOOKBOOK}/brands/crate-and-barrel`,
  ROCHEBOBOIS: `${DOMAINS.BELLA_LOOKBOOK}/brands/rochebobois`,
  CONTACT_US: `${DOMAINS.BELLA_STAGING}/pages/contact-us`,
} as const;

// Our Services URLs
export const SERVICES_URLS = {
  VIRTUAL_STAGING: `${DOMAINS.BELLA_STAGING}/products/virtual-staging`,
  FURNITURE_REMOVAL: `${DOMAINS.BELLA_STAGING}/products/virtual-furniture-removal-and-replacement-service`,
  VIRTUAL_RENOVATION: `${DOMAINS.BELLA_STAGING}/products/virtual-renovation-service`,
  VIRTUAL_3D_TOUR: `${DOMAINS.BELLA_STAGING}/products/3d-virtual-tour-home-staging`,
  DESIGN_MY_ROOM: `${DOMAINS.BELLA_STAGING}/products/design-my-room`,
  RESIDENTIAL_3D: `${DOMAINS.BELLA_STAGING}/products/3d-rendering-service-for-architectural-visualization`,
  COMMERCIAL_RENDERING: `${DOMAINS.BELLA_STAGING}/products/commercial-rendering`,
  FLOOR_PLAN_2D_3D: `${DOMAINS.BELLA_STAGING}/products/2d-3d-floor-plan-service`,
  HDR_PHOTO_EDITING: `${DOMAINS.BELLA_STAGING}/products/hdr-photo-editing`,
  REAL_ESTATE_PHOTO_EDITING: `${DOMAINS.BELLA_STAGING}/products/real-estate-photo-editing`,
  ABOUT_US: `${DOMAINS.BELLA_STAGING}/pages/about-us`,
} as const;

// ============================================
// FOOTER URLs
// ============================================

export const FOOTER_URLS = {
  HOME: `${DOMAINS.BELLA_STAGING}/`,
  LOOKBOOK: `${DOMAINS.BELLA_LOOKBOOK}/`,
  CASE_STUDIES: `${DOMAINS.BELLA_STAGING}/pages/case-studies-realtors`, // Link to first case study
  VIRTUAL_STAGING_SERVICES: `${DOMAINS.BELLA_STAGING}/products/virtual-staging`,
  FURNITURE_REMOVAL_VIRTUAL_STAGING: `${DOMAINS.BELLA_STAGING}/products/virtual-furniture-removal-and-replacement-service`,
  VIRTUAL_RENOVATION_STAGING: `${DOMAINS.BELLA_STAGING}/products/virtual-renovation-service`,
  VIRTUAL_3D_HOUSE_TOUR: `${DOMAINS.BELLA_STAGING}/products/3d-virtual-tour-home-staging`,
  VIRTUAL_DESIGN_MY_ROOM: `${DOMAINS.BELLA_STAGING}/products/virtual-staging-design-my-room`,
  FLOORPLAN_CREATOR_SERVICES: `${DOMAINS.BELLA_STAGING}/products/2d-3d-floor-plan-service`,
  BLOG: `${DOMAINS.BELLA_STAGING}/blogs/news`,
  FAQ: `${DOMAINS.BELLA_STAGING}/pages/faq`,
  ABOUT_US: `${DOMAINS.BELLA_STAGING}/pages/about-us`,
  CONTACT_US: `${DOMAINS.BELLA_STAGING}/pages/contact-us`,
  PRIVACY_POLICY: `${DOMAINS.BELLA_STAGING}/pages/privacy-policy`,
  TERMS_OF_SERVICE: `${DOMAINS.BELLA_STAGING}/pages/terms-of-service`,
} as const;

// ============================================
// HEADER RELATED URLs
// ============================================
export const HEADER_URLS = {
  HOME: `${DOMAINS.BELLA_STAGING}/`,
} as const;

// ============================================
// PROJECT PAGES URLs
// ============================================

export const PROJECT_URLS = {
  ACCOUNT: `${DOMAINS.BELLA_STAGING}/account`,
  CONTACT_US: `${DOMAINS.BELLA_STAGING}/pages/contact-us`,
} as const;

