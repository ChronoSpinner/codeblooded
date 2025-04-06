import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Package,
  Factory,
  XCircle
} from 'lucide-react';

// Rating component
const RatingStars = ({ rating }: { rating: number; }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" :
            i < rating ? "text-yellow-400 fill-yellow-400 opacity-50" : "text-gray-300"
            }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-500">{rating}</span>
    </div>
  );
};

const CustomerComponent = () => {
  const [activeTab, setActiveTab] = useState("sugar");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("price-asc");
  const [filterType, setFilterType] = useState("all");
  const [cart, setCart] = useState<{ id: string; qty: number; price: number; name: string; }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const productsPerPage = 6;

  // Fetch products from Firestore
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Import the getAllProductsForCustomers function
        const { getAllProductsForCustomers } = await import('@/lib/firestore');
        
        // Fetch all products
        const allProducts = await getAllProductsForCustomers();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  // Filter products based on search query, type, and sort order
  const getFilteredProducts = () => {
    if (products.length === 0) return [];
    
    // Filter by sugar/farmer type first
    const typeFiltered = products.filter(product => {
      if (activeTab === "sugar") {
        return 'type' in product;
      } else {
        return 'variety' in product;
      }
    });
    
    let filtered = typeFiltered.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ('producer' in product ? product.producer.toLowerCase() : '').includes(searchQuery.toLowerCase()) ||
        ('farmer' in product ? product.farmer.toLowerCase() : '').includes(searchQuery.toLowerCase());

      const matchesType = filterType === "all" || 
        ('type' in product ? product.type === filterType : product.variety === filterType);

      return matchesSearch && matchesType;
    });

    // Sort the filtered products
    switch (sortOrder) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Add to cart function
  const addToCart = (product: { id: string; price: number; name: string; [key: string]: any }) => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].qty += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Update quantity in cart
  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;

    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, qty: newQty } : item
    );

    setCart(updatedCart);
  };

  // Remove from cart
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);

  return (
    <div className="w-full">
      {/* Shopping Cart Flyout */}
      <div className="fixed top-24 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.qty, 0)}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Your Cart</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cart.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Your cart is empty</div>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="p-2 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">₹{item.price} × {item.qty}</div>
                      </div>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center">{item.qty}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button className="w-full">Checkout</Button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Header with Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating-desc">Best Rating</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {activeTab === "sugar" ? (
                  <>
                    <SelectItem value="white">White Sugar</SelectItem>
                    <SelectItem value="brown">Brown Sugar</SelectItem>
                    <SelectItem value="raw">Raw Sugar</SelectItem>
                    <SelectItem value="powdered">Powdered Sugar</SelectItem>
                    <SelectItem value="jaggery">Jaggery</SelectItem>
                    <SelectItem value="coconut">Coconut Sugar</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="CO-86032">CO-86032</SelectItem>
                    <SelectItem value="CO-0238">CO-0238</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Category Tabs */}
        <Tabs defaultValue="sugar" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sugar" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              <span>Processed Sugar</span>
            </TabsTrigger>
            <TabsTrigger value="sugarcane" className="flex items-center">
              <Factory className="mr-2 h-4 w-4" />
              <span>Raw Sugarcane</span>
            </TabsTrigger>
          </TabsList>

          {/* Loading and Error States */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          
          {/* Processed Sugar Products Tab */}
          <TabsContent value="sugar" className="pt-4">
            {!loading && products.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No sugar products available at the moment.</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map(product => (
                <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img
                      src={"https://th.bing.com/th/id/OIP.c7r42ZcdK0Vc3KwXfy4cpAHaHa?rs=1&pid=ImgDetMain"}
                      alt={"https://th.bing.com/th/id/OIP.c7r42ZcdK0Vc3KwXfy4cpAHaHa?rs=1&pid=ImgDetMain"}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2 bg-white text-black">
                      {'type' in product ? (product.type.charAt(0).toUpperCase() + product.type.slice(1)) : product.variety}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                    </div>
                    <div className="flex justify-between">
                      <RatingStars rating={product.rating} />
                      <Badge variant="outline" className="ml-2">
                        <Factory className="h-3 w-3 mr-1" />
                        {'producer' in product ? product.producer : product.farmer}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2 line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                      <div>Package Size:</div>
                      <div className="text-right font-medium">{'packageSize' in product ? `${product.packageSize} ${product.unit}` : `${product.quantity} ${product.unit}`}</div>
                      <div>Sugar Content:</div>
                      <div className="text-right font-medium">{'sugarContent' in product ? product.sugarContent : 'N/A'}</div>
                      <div>Origin:</div>
                      <div className="text-right font-medium">{product.origin}</div>
                      <div>Available:</div>
                      <div className="text-right font-medium">{product.quantity.toLocaleString()} {product.unit}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-2">
                    <span className="text-2xl font-bold">₹{product.price}/{product.unit}</span>
                    <Button onClick={() => addToCart(product)}>Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Raw Sugarcane Tab */}
          <TabsContent value="sugarcane" className="pt-4">
            {!loading && products.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No sugarcane listings available at the moment.</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map(product => (
                <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2 bg-white text-black">
                      {'quality' in product ? product.quality : product.type}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                    </div>
                    <div className="flex justify-between">
                      <RatingStars rating={product.rating} />
                      <Badge variant="outline" className="ml-2">
                        <Factory className="h-3 w-3 mr-1" />
                        {'farmer' in product ? product.farmer : product.producer}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2 line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                      <div>Variety:</div>
                      <div className="text-right font-medium">{'variety' in product ? product.variety : 'N/A'}</div>
                      <div>Quality:</div>
                      <div className="text-right font-medium">{'quality' in product ? product.quality : 'N/A'}</div>
                      <div>Harvest Date:</div>
                      <div className="text-right font-medium">{'harvestDate' in product ? product.harvestDate : 'N/A'}</div>
                      <div>Origin:</div>
                      <div className="text-right font-medium">{product.origin}</div>
                      <div>Available:</div>
                      <div className="text-right font-medium">{product.quantity.toLocaleString()} {product.unit}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-2">
                    <span className="text-2xl font-bold">₹{product.price}/{product.unit}</span>
                    <Button onClick={() => addToCart(product)}>Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default CustomerComponent;