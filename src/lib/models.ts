// Define types for Farmer Listings
export interface FarmerListing {
  id?: string;
  variety: string;
  quantity: string;
  price: string;
  quality: 'premium' | 'standard' | 'economy';
  harvestDate: string;
  description?: string;
  status: 'completed' | 'processing' | 'pending' | 'rejected';
  farmer: string;
  farmerId: string;
  createdAt: number;
  buyer?: string;
  revenue?: number;
  location?: string;
  image?: string;
}

// Define types for Mill Products
export interface MillProduct {
  id?: string;
  productName: string;
  productType: 'raw' | 'white' | 'refined' | 'brown' | 'powdered' | 'jaggery' | 'coconut';
  quantity: string;
  price: string;
  sugarContent: string;
  packageSize: string;
  description?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'processing';
  productionDate: string;
  producer: string;
  producerId: string;
  createdAt: number;
  rawMaterial?: string;
  purity?: string;
  revenue?: number;
  image?: string;
  origin?: string;
  unit?: string;
}

// Define types for Customer Product View
export interface ProductView {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
  description: string;
  rating?: number;
  reviews?: number;
  // For sugar products
  type?: string;
  packageSize?: string;
  producer?: string;
  sugarContent?: string;
  origin?: string;
  // For sugarcane products
  variety?: string;
  quality?: string;
  harvestDate?: string;
  farmer?: string;
}