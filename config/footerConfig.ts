/**
 * Footer Menu Configuration
 * This file contains the footer menu structure matching Shopify Footer
 */

import { FOOTER_URLS } from './url.config';

export interface FooterMenuItem {
  title: string;
  url: string;
}

export interface FooterMenuData {
  heading: string;
  menu: FooterMenuItem[];
}

/**
 * Default Footer Menus - Matching Shopify Footer Actual Content
 * Based on the actual footer screenshot
 * Note: Case Studies and Our Locations removed from footer as per user request
 */
export const DEFAULT_FOOTER_MENUS: FooterMenuData[] = [
  {
    heading: 'MENU',
    menu: [
      { title: 'Home', url: FOOTER_URLS.HOME },
      { title: 'Lookbook', url: FOOTER_URLS.LOOKBOOK },
      { title: 'Case Studies', url: FOOTER_URLS.CASE_STUDIES },
      { title: 'Contact Us', url: FOOTER_URLS.CONTACT_US }
    ]
  },
  {
    heading: 'SERVICES',
    menu: [
      { title: 'Virtual Staging Services', url: FOOTER_URLS.VIRTUAL_STAGING_SERVICES },
      { title: 'Furniture Removal & Virtual Staging', url: FOOTER_URLS.FURNITURE_REMOVAL_VIRTUAL_STAGING },
      { title: 'Virtual Renovation & Staging', url: FOOTER_URLS.VIRTUAL_RENOVATION_STAGING },
      { title: 'Virtual 3D House Tour', url: FOOTER_URLS.VIRTUAL_3D_HOUSE_TOUR },
      { title: 'Virtual Design My Room', url: FOOTER_URLS.VIRTUAL_DESIGN_MY_ROOM },
      { title: 'Floorplan Creator Services', url: FOOTER_URLS.FLOORPLAN_CREATOR_SERVICES }
    ]
  },
  {
    heading: 'RESOURCES',
    menu: [
      { title: 'Blog', url: FOOTER_URLS.BLOG },
      { title: 'FAQ', url: FOOTER_URLS.FAQ },
      { title: 'About Us', url: FOOTER_URLS.ABOUT_US }
    ]
  },
  {
    heading: 'LEGAL',
    menu: [
      { title: 'Privacy Policy', url: FOOTER_URLS.PRIVACY_POLICY },
      { title: 'Terms of Service', url: FOOTER_URLS.TERMS_OF_SERVICE }
    ]
  }
];