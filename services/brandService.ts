// import { supabase } from '@/lib/supabase'
// import type { PhotoEntity } from '@/types/database'
// import { HomepageFilterService } from './homepageFilterService' // COMMENTED OUT: Not needed for delivery page demo

// Company ID mapping
export const COMPANY_IDS = {
  'Bella Staging': 1,
  'Rove Concepts': 2,
  'Eternity Modern': 3,
  'Gus Modern': 4,
  'Sundays': 5,
  'Rochebobois': 6,
  'Mobital': 7,
  // Extended brands for catalog / lookbook
  'Article Company': 8,
  'EQ3': 9,
  'Hooker Furniture': 10,
  'MGBW': 11,              // Mitchell Gold + Bob Williams
  'King Living': 12,
  'Crate & Barrel': 13,
} as const;

export type CompanyName = keyof typeof COMPANY_IDS;

// Brand name to URL slug mapping
export const BRAND_SLUGS = {
  'Bella Staging': 'bella-staging',
  'Rove Concepts': 'rove-concepts',
  'Eternity Modern': 'eternity-modern',
  'Gus Modern': 'gus-modern',
  'Sundays': 'sundays',
  'Rochebobois': 'rochebobois',
  'Mobital': 'mobital',
  // Slugs aligned with header lookbook links and /brands/[brand] routes
  'Article Company': 'article-company',
  'EQ3': 'eq3',
  'Hooker Furniture': 'hooker-furniture',
  'MGBW': 'mgbw',
  'King Living': 'king-living',
  // Use a safe canonical slug (avoid "&" which can be problematic in some routing/proxies)
  'Crate & Barrel': 'crate-and-barrel',
} as const;

// Legacy slugs we still accept (backward compatibility / old links)
const LEGACY_BRAND_SLUGS: Record<string, CompanyName> = {
  'crate-&-barrel': 'Crate & Barrel',
  'crate-%26-barrel': 'Crate & Barrel',
} as const;

// Brand name to promotion mapping
// Keys must exactly match COMPANY_IDS keys (case-sensitive, including spaces and special characters)
export const BRAND_PROMOTION = {
  'Rove Concepts': 'up to 35%',
  'Eternity Modern': 'up to 20%',
  'Gus Modern': 'up to 30%',
  'Sundays': 'up to 15%',
  'Rochebobois': 'up to 20%',
  'Mobital': 'up to 40%',
  // Extended brands for catalog / lookbook
  'Article Company': '5-15%',
  'EQ3': 'up to 20%',
  'Hooker Furniture': 'up to 60%',
  'MGBW': '40-60%',              // Mitchell Gold + Bob Williams
  'King Living': 'up to 20%',
  'Crate & Barrel': '15-20%'
} as const;

export interface PromotionItem {
  brand: string;
  room: string;
  discount: string;
}

// Convert brand name to URL slug
export const getBrandSlug = (brandName: string): string => {
  return BRAND_SLUGS[brandName as CompanyName] || brandName.toLowerCase().replace(/\s+/g, '-');
};

// Convert URL slug to brand name
export const getBrandNameFromSlug = (slug: string): string | null => {
  // Normalize the slug: decode URL encoding and handle both encoded (%26) and raw (&) characters
  let normalizedSlug = slug;
  
  try {
    // Decode URL encoding (e.g., %26 -> &)
    normalizedSlug = decodeURIComponent(slug);
  } catch {
    // If decoding fails, use original slug
    normalizedSlug = slug;
  }
  
  // Try exact match first
  let entry = Object.entries(BRAND_SLUGS).find(([, urlSlug]) => urlSlug === normalizedSlug);
  
  // If no exact match, try with original slug (in case it wasn't encoded)
  if (!entry) {
    entry = Object.entries(BRAND_SLUGS).find(([, urlSlug]) => urlSlug === slug);
  }

  // Legacy support (e.g. "crate-&-barrel")
  if (!entry) {
    const legacyKey = (normalizedSlug || slug).toLowerCase();
    const legacyBrandName = LEGACY_BRAND_SLUGS[legacyKey];
    if (legacyBrandName) {
      return legacyBrandName;
    }
  }
  
  return entry ? entry[0] : null;
};

// Convert URL slug directly to company ID
export const getCompanyIdFromSlug = (slug: string): number | null => {
  const brandName = getBrandNameFromSlug(slug);
  if (!brandName) return null;
  return brandService.getCompanyId(brandName);
};

export const brandService = {
  
  // Fetch all products by company_id 
  // async getProductsByCompany(companyId: number, limit: number = 20, offset: number = 0): Promise<PhotoEntity[]> {
  //   console.log(`Fetching products for company_id: ${companyId}...`)
    
  //   try {
  //     const { data, error } = await supabase
  //       .from('photos_entities')                    
  //       .select('*')
  //       .not('src', 'is', null)  // only fetch photos with src URLs
  //       .eq('company_id', companyId)
  //       .range(offset, offset + limit - 1)        // database-level pagination
      
  //     if (error) {
  //       console.error('Error fetching products by company:', error)
  //       throw error
  //     }
      
  //     console.log('Fetched products count:', data?.length || 0)
  //     return data || []
  //   } catch (err) {
  //     console.error('Database connection error:', err)
  //     console.error('Returning empty array as fallback')
  //     return []
  //   }
  // },

  // Get products and count in a single operation to reduce concurrent requests - COMMENTED OUT for demo
  // async getProductsAndCountByCompany(companyId: number, limit: number = 20, offset: number = 0) {
  //   try {
  //     // Use Promise.all to execute both queries in parallel but reduce network overhead
  //     const [productsResult, countResult] = await Promise.all([
  //       supabase
  //         .from('photos_entities')
  //         .select('*')
  //         .not('src', 'is', null)
  //         .eq('company_id', companyId)
  //         .range(offset, offset + limit - 1),
  //       
  //       supabase
  //         .from('photos_entities')
  //         .select('*', { count: 'exact', head: true })
  //         .not('src', 'is', null)
  //         .eq('company_id', companyId)
  //     ]);

  //     if (productsResult.error) {
  //       throw productsResult.error
  //     }
  //     
  //     if (countResult.error) {
  //       throw countResult.error
  //     }

  //     const products = productsResult.data || []
  //     const count = countResult.count || 0
  //     
  //     return {
  //       products,
  //       count
  //     }
  //   } catch {
  //     return { products: [], count: 0 }
  //   }
  // },

  // Fetch single product by UUID - COMMENTED OUT for demo
  // async getProduct(uuid: string): Promise<PhotoEntity | null> {
  //   try {
  //     const { data, error } = await supabase
  //       .from('photos_entities')
  //       .select('*')
  //       .not('src', 'is', null)
  //       .eq('id', uuid)
  //       .limit(1)
  //     
  //     if (error) {
  //       throw error
  //     }
  //     
  //     const product = (data as PhotoEntity[])?.[0] || null
  //     return product
  //     
  //   } catch {
  //     return null
  //   }
  // },

  // Get product count for pagination - COMMENTED OUT for demo
  // async getProductsCount(companyId?: number): Promise<number> {
  //   try {
  //     let query = supabase
  //       .from('photos_entities')
  //       .select('*', { count: 'exact', head: true })
  //       .not('src', 'is', null)
  //     
  //     if (companyId) {
  //       query = query.eq('company_id', companyId)
  //     }
  //     
  //     const { count, error } = await query
  //     
  //     if (error) {
  //       throw error
  //     }
  //     return count || 0
  //   } catch {
  //     return 0
  //   }
  // },

  // Helper: Get company ID by name
  getCompanyId(companyName: string): number | null {
    return COMPANY_IDS[companyName as CompanyName] || null
  },

  // Helper: Get company name by ID
  getCompanyName(companyId: number): string | null {
    for (const [name, id] of Object.entries(COMPANY_IDS)) {
      if (id === companyId) return name
    }
    return null
  },

  // Get promotion items by project ID
  async getPromotionItemsByProject(projectId: string): Promise<PromotionItem[]> {
    try {
      // 1. Query project_wishlist to get all sku (photo_ids)
      const { data: wishlistItems, error: wishlistError } = await supabase
        .from('project_wishlist')
        .select('sku')
        .eq('project_id', projectId);

      if (wishlistError) {
        throw wishlistError;
      }

      if (!wishlistItems || wishlistItems.length === 0) {
        return [];
      }

      // Extract photo IDs (sku field contains photo_id)
      const photoIds = wishlistItems
        .map((item: { sku: string }) => item.sku)
        .filter(Boolean)
        .filter((id): id is string => typeof id === 'string' && id.length > 0) as string[];

      if (photoIds.length === 0) {
        return [];
      }

      // 2. Get photos with room info using HomepageFilterService
      let photosWithRoomInfo;
      try {
        photosWithRoomInfo = await HomepageFilterService.getPhotosWithRoomInfo(photoIds);
      } catch {
        // Return empty array instead of throwing to prevent breaking the UI
        return [];
      }

      if (photosWithRoomInfo.length === 0) {
        return [];
      }

      // 3. Group by company_id and collect room_types
      const brandMap = new Map<number, {
        brandName: string;
        roomTypes: Set<string>;
        discount: string;
      }>();

      for (const photo of photosWithRoomInfo) {
        // Skip if company_id is null
        if (!photo.company_id) {
          continue;
        }

        const companyId = photo.company_id;
        
        // Get brand name
        const brandName = brandService.getCompanyName(companyId);
        if (!brandName) {
          continue;
        }

        // Get discount from BRAND_PROMOTION mapping
        const discount = BRAND_PROMOTION[brandName as keyof typeof BRAND_PROMOTION] || '';

        // Initialize brand entry if not exists
        if (!brandMap.has(companyId)) {
          brandMap.set(companyId, {
            brandName,
            roomTypes: new Set<string>(),
            discount
          });
        }

        // Add room_type if exists (if null, skip - will show empty string)
        if (photo.room_type) {
          brandMap.get(companyId)!.roomTypes.add(photo.room_type);
        }
      }

      // 4. Convert map to PromotionItem array, excluding "Bella Staging"
      const promotionItems: PromotionItem[] = Array.from(brandMap.values())
        .filter(brandData => brandData.brandName !== 'Bella Staging') // Exclude Bella Staging
        .map(brandData => ({
          brand: brandData.brandName,
          room: Array.from(brandData.roomTypes).join(' / ') || '', // Join multiple room types with '/', or empty string if none
          discount: brandData.discount
        }));

      return promotionItems;

    } catch {
      return [];
    }
  }
} 