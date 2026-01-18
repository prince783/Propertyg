import axios from "axios";

export type Property = {
  _id: string;

  propertyName?: string;
  projectName?: string;
  description?: string;

  isPublic?: boolean;
  isFeatured?: boolean;
  parentId?: string | null;
  slug: string;
  price?: string;

  minSize?: string;
  maxSize?: string;
  sizeUnit?: string;

  location?: string | string[];
  images?: { url: string }[];
};

export const propertyService = {
  // ✅ LIST PAGE (cards, featured, etc.)
  fetchProperties: async (params?: {
    category?: string;
    featured?: string;
    limit?: string;
  }): Promise<Property[]> => {
    try {
      const { category = "", featured = "false", limit = "20" } = params || {};

      const res = await axios.get(
        `/api/v0/property?category=${category}&featured=${featured}&limit=${limit}`
      );

      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (error) {
      console.error("Property Service Fetch Error:", error);
      return [];
    }
  },

  // ✅ DETAILS PAGE (slug-based, FIXES sizeUnit/minSize issue)
  fetchPropertyBySlug: async (slug: string): Promise<Property | null> => {
    try {
      const res = await axios.get(`/api/v0/property/${encodeURIComponent(slug)}`);
      return res.data?.data ?? null;
    } catch (error) {
      console.error("Property Slug Fetch Error:", error);
      return null;
    }
  },

  // ✅ SUB-PROPERTIES PAGE (fetch child properties by parent ID)
  getSubProperties: async (parentId: string): Promise<any> => {
    try {
      const res = await axios.get(`/api/v0/property?parentId=${parentId}`);
      return res.data ?? { data: [] };
    } catch (error) {
      console.error("Sub-Properties Fetch Error:", error);
      return { data: [] };
    }
  },
};
