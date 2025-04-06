import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc, updateDoc, serverTimestamp, Timestamp, DocumentData } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import { FarmerListing, MillProduct, ProductView } from './models';

// Collection names
const FARMER_LISTINGS_COLLECTION = 'farmerListings';
const MILL_PRODUCTS_COLLECTION = 'millProducts';

// Farmer Listing Functions

/**
 * Upload a new farmer listing to Firestore
 */
export async function uploadFarmerListing(listing: Omit<FarmerListing, 'id' | 'farmerId' | 'farmer' | 'createdAt' | 'status'>): Promise<string> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User must be logged in to create a listing');
    
    const listingData: Omit<FarmerListing, 'id'> = {
      ...listing,
      farmerId: currentUser.uid,
      farmer: currentUser.displayName || 'Unknown Farmer',
      createdAt: Date.now(),
      status: 'pending'
    };
    
    const docRef = await addDoc(collection(db, FARMER_LISTINGS_COLLECTION), listingData);
    return docRef.id;
  } catch (error) {
    console.error('Error uploading farmer listing:', error);
    throw error;
  }
}

/**
 * Get all farmer listings for the current user
 */
export async function getFarmerListings(): Promise<FarmerListing[]> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User must be logged in to view listings');
    
    const q = query(
      collection(db, FARMER_LISTINGS_COLLECTION),
      where('farmerId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<FarmerListing, 'id'>
    }));
  } catch (error) {
    console.error('Error getting farmer listings:', error);
    throw error;
  }
}

/**
 * Get all available farmer listings for customers
 */
export async function getAvailableFarmerListings(): Promise<FarmerListing[]> {
  try {
    const q = query(
      collection(db, FARMER_LISTINGS_COLLECTION),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<FarmerListing, 'id'>
    }));
  } catch (error) {
    console.error('Error getting available farmer listings:', error);
    throw error;
  }
}

/**
 * Update the status of a farmer listing
 */
export async function updateFarmerListingStatus(
  listingId: string, 
  status: FarmerListing['status'],
  buyerInfo?: { buyer: string, revenue: number }
): Promise<void> {
  try {
    const listingRef = doc(db, FARMER_LISTINGS_COLLECTION, listingId);
    
    const updateData: Partial<FarmerListing> = { status };
    if (buyerInfo) {
      updateData.buyer = buyerInfo.buyer;
      updateData.revenue = buyerInfo.revenue;
    }
    
    await updateDoc(listingRef, updateData);
  } catch (error) {
    console.error('Error updating farmer listing status:', error);
    throw error;
  }
}

// Mill Product Functions

/**
 * Upload a new mill product to Firestore
 */
export async function uploadMillProduct(product: Omit<MillProduct, 'id' | 'producerId' | 'producer' | 'createdAt' | 'status'>): Promise<string> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User must be logged in to create a product');
    
    const productData: Omit<MillProduct, 'id'> = {
      ...product,
      producerId: currentUser.uid,
      producer: currentUser.displayName || 'Unknown Mill',
      createdAt: Date.now(),
      status: 'in-stock'
    };
    
    const docRef = await addDoc(collection(db, MILL_PRODUCTS_COLLECTION), productData);
    return docRef.id;
  } catch (error) {
    console.error('Error uploading mill product:', error);
    throw error;
  }
}

/**
 * Get all mill products for the current user
 */
export async function getMillProducts(): Promise<MillProduct[]> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User must be logged in to view products');
    
    const q = query(
      collection(db, MILL_PRODUCTS_COLLECTION),
      where('producerId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<MillProduct, 'id'>
    }));
  } catch (error) {
    console.error('Error getting mill products:', error);
    throw error;
  }
}

/**
 * Get all available mill products for customers
 */
export async function getAvailableMillProducts(): Promise<MillProduct[]> {
  try {
    const q = query(
      collection(db, MILL_PRODUCTS_COLLECTION),
      where('status', 'in', ['in-stock', 'low-stock']),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<MillProduct, 'id'>
    }));
  } catch (error) {
    console.error('Error getting available mill products:', error);
    throw error;
  }
}

/**
 * Update the status of a mill product
 */
export async function updateMillProductStatus(
  productId: string, 
  status: MillProduct['status'],
  updateData?: Partial<MillProduct>
): Promise<void> {
  try {
    const productRef = doc(db, MILL_PRODUCTS_COLLECTION, productId);
    
    const data: Partial<MillProduct> = { status, ...updateData };
    await updateDoc(productRef, data);
  } catch (error) {
    console.error('Error updating mill product status:', error);
    throw error;
  }
}

// Customer View Functions

/**
 * Convert Firestore documents to customer-friendly product views
 */
export function convertToProductView(items: (FarmerListing | MillProduct)[]): ProductView[] {
  return items.map(item => {
    if ('variety' in item) {
      // This is a farmer listing
      const farmerListing = item as FarmerListing;
      return {
        id: farmerListing.id || '',
        name: `${farmerListing.quality} ${farmerListing.variety} Sugarcane`,
        price: parseInt(farmerListing.price.replace(/[^0-9]/g, '')),
        quantity: parseInt(farmerListing.quantity.replace(/[^0-9]/g, '')),
        unit: 'ton',
        description: farmerListing.description || `High-quality ${farmerListing.variety} sugarcane available for purchase.`,
        variety: farmerListing.variety,
        quality: farmerListing.quality,
        harvestDate: farmerListing.harvestDate,
        farmer: farmerListing.farmer,
        image: farmerListing.image || 'https://images.unsplash.com/photo-1627207785566-00a505799891?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
        origin: farmerListing.location,
        rating: 4.5, // Default rating
        reviews: Math.floor(Math.random() * 50) + 10 // Random number of reviews
      };
    } else {
      // This is a mill product
      const millProduct = item as MillProduct;
      return {
        id: millProduct.id || '',
        name: millProduct.productName,
        price: parseInt(millProduct.price.replace(/[^0-9]/g, '')),
        quantity: parseInt(millProduct.quantity.replace(/[^0-9]/g, '')),
        unit: millProduct.unit || 'kg',
        description: millProduct.description || `High-quality ${millProduct.productType} sugar.`,
        type: millProduct.productType,
        packageSize: millProduct.packageSize,
        producer: millProduct.producer,
        sugarContent: millProduct.sugarContent,
        origin: millProduct.origin,
        image: millProduct.image || 'https://images.unsplash.com/photo-1581268497091-31132809fef6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
        rating: 4.7, // Default rating
        reviews: Math.floor(Math.random() * 100) + 20 // Random number of reviews
      };
    }
  });
}

/**
 * Get all available products for customers (both farmer listings and mill products)
 */
export async function getAllProductsForCustomers(): Promise<ProductView[]> {
  try {
    // Get farmer listings
    const farmerListings = await getAvailableFarmerListings();
    
    // Get mill products
    const millProducts = await getAvailableMillProducts();
    
    // Convert to product views
    return convertToProductView([...farmerListings, ...millProducts]);
  } catch (error) {
    console.error('Error getting all products for customers:', error);
    throw error;
  }
}