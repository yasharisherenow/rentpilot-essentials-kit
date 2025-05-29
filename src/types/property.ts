
export type Property = {
  id: string;
  title: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  monthly_rent: number;
  bedrooms?: number;
  bathrooms?: number;
  is_available: boolean;
  unit_count?: number;
  created_at: string;
  landlord_id: string;
  property_type?: string;
  square_feet?: number;
  amenities?: string[];
  description?: string;
  available_date?: string;
  updated_at?: string;
};
