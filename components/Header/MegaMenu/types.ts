/**
 * Types for Mega Menu components
 */

export interface ServiceCategory {
  id: string;
  title: string;
  handle: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  image?: string;
}

export interface ServicesMenuData {
  categories: ServiceCategory[];
  services: Record<string, ServiceCard[]>; // category handle -> cards
}
