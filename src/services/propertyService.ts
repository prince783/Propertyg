import axios from "axios";
import api from "./api";

export type Property = {
  _id: string;

  builderName?: string;
  propertyName?: string;
  projectName?: string;
  description?: string;

  isPublic?: boolean;
  isFeatured?: boolean;
  parentId?: string | null;
  slug: string;
  price?: string;
  minPrice?: number | string;

  minSize?: string;
  maxSize?: string;
  sizeUnit?: string;

  location?: string | string[];
  nearby?: string[];
  amenities?: string[];
  projectHighlights?: string[];
  status?: string[];
  mapLocation?: { lat: number; lng: number };
  images?: { url: string }[] | string[];
};

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/api/v0";

export const propertyService = {
  // ✅ LIST PAGE (cards, featured, etc.)
  fetchProperties: async (params?: {
    category?: string;
    featured?: string;
    limit?: string;
  }): Promise<Property[]> => {
    try {
      const { category = "", featured = "false", limit = "12" } = params || {};

      const res = await api.get(
        `/public/property?featured=${featured}&limit=${limit}`,
      );

      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (error) {
      console.error("Property Service Fetch Error:", error);
      return [];
    }
  },

  // ✅ DETAILS PAGE (slug-based, FIXES sizeUnit/minSize issue)
  fetchPropertyBySlug: async (
    slug: string,
    withChildren = false,
  ): Promise<Property | null> => {
    if (!slug) return null;

    try {
      const res = await axios.get(`${BACKEND_URL}/public/property`, {
        params: {
          slug,
          withChildren,
        },
      });

      return res.data?.success ? res.data.data : null;
    } catch (error) {
      console.error("Website Slug Fetch Error:", error);
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
