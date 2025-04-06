import React, { useState, useEffect } from 'react';
import { MillProduct } from '@/lib/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ClipboardList,
  DollarSign,
  Loader,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  TrendingUp,
  Droplet,
  ShoppingBag
} from 'lucide-react';

// Form schema for creating sugar product
const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productType: z.enum(["raw", "white", "refined", "brown", "powdered"], {
    message: "Please select a product type.",
  }),
  quantity: z.string().min(1, {
    message: "Quantity is required.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  sugarContent: z.string().min(1, {
    message: "Sugar content is required.",
  }),
  packageSize: z.string().min(1, {
    message: "Package size is required.",
  }),
  description: z.string().optional(),
});


// Status badges
const StatusBadge = ({ status }: { status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'processing' }) => {
  const statusMap = {
    'in-stock': { icon: <CheckCircle className="h-4 w-4 mr-1" />, color: "bg-green-100 text-green-800" },
    'low-stock': { icon: <Clock className="h-4 w-4 mr-1" />, color: "bg-yellow-100 text-yellow-800" },
    'out-of-stock': { icon: <XCircle className="h-4 w-4 mr-1" />, color: "bg-red-100 text-red-800" },
    'processing': { icon: <Loader className="h-4 w-4 mr-1 animate-spin" />, color: "bg-blue-100 text-blue-800" },
  };

  const { icon, color } = statusMap[status] || statusMap['processing'];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
};

const MillComponent = () => {
  const [products, setProducts] = useState<MillProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rawMaterialInventory, setRawMaterialInventory] = useState(24500); // in kg
  const [pendingOrders, setPendingOrders] = useState(12);

  // Fetch mill products from Firestore
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { getMillProducts } = await import('@/lib/firestore');
        const fetchedProducts = await getMillProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productType: "white",
      quantity: "",
      price: "",
      sugarContent: "",
      packageSize: "",
      description: "",
    },
  });

  // Submit handler for new product
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Prepare product data for Firestore
      const productData = {
        productName: values.productName,
        productType: values.productType,
        quantity: values.quantity + " kgs",
        price: "₹" + values.price + "/kg",
        sugarContent: values.sugarContent + "%",
        packageSize: values.packageSize + " kg",
        description: values.description,
        productionDate: new Date().toISOString().split('T')[0],
        rawMaterial: "CO-86032",
        purity: "High",
        unit: "kg"
      };
      
      // Import the uploadMillProduct function
      const { uploadMillProduct } = await import('@/lib/firestore');
      
      // Upload the product to Firestore
      const id = await uploadMillProduct(productData);
      
      // Create new product for UI
      const newProduct = {
        id,
        ...productData,
        status: "in-stock" as "in-stock" | "low-stock" | "out-of-stock" | "processing",
        revenue: parseInt(values.quantity) * parseInt(values.price),
        producer: "You", // Will be replaced by actual user name in Firestore
        producerId: "", // Will be set in Firestore
        createdAt: Date.now()
      };

      setProducts([newProduct, ...products]);
      form.reset();
      setRawMaterialInventory(prev => prev - (parseInt(values.quantity) * 1.1)); // 10% more raw material than finished product
    } catch (error) {
      console.error('Error creating product:', error);
      // You could add error handling UI here
    } finally {
      setIsSubmitting(false);
    }
  }

  // Calculate analytics
  const totalRevenue = products.reduce((sum, product) => sum + (product.revenue || 0), 0);
  const totalProduction = products.reduce((sum, product) => sum + parseInt(product.quantity.replace(/[^0-9]/g, '')), 0);
  const lowStockProducts = products.filter(product => product.status === "low-stock").length;
  const inStockProducts = products.filter(product => product.status === "in-stock").length;
  
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Summary Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{totalProduction.toLocaleString()} kg</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Raw Material</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Droplet className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-2xl font-bold">{rawMaterialInventory.toLocaleString()} kg</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-2xl font-bold">{pendingOrders}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">New Product</TabsTrigger>
          <TabsTrigger value="inventory">Product Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* New Product Form */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Create New Sugar Product</CardTitle>
              <CardDescription>Fill in the details to create a new sugar product for your inventory.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Premium White Sugar, Brown Sugar, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sugar Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="white">White Sugar</SelectItem>
                              <SelectItem value="brown">Brown Sugar</SelectItem>
                              <SelectItem value="raw">Raw Sugar</SelectItem>
                              <SelectItem value="refined">Refined Sugar</SelectItem>
                              <SelectItem value="powdered">Powdered Sugar</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Quantity in kilograms" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per kg (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Price per kg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sugarContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sugar Content (%)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Sugar content percentage" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="packageSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Size (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Package size in kg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional details about the sugar product..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Inventory */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Manage your sugar product inventory and track production.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sugar Content</TableHead>
                    <TableHead>Package Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Production Date</TableHead>
                    <TableHead>Raw Material</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell className="capitalize">{product.productType}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.sugarContent}</TableCell>
                      <TableCell>{product.packageSize}</TableCell>
                      <TableCell>
                        <StatusBadge status={product.status as 'in-stock' | 'low-stock' | 'out-of-stock' | 'processing'} />
                      </TableCell>
                      <TableCell>{product.productionDate}</TableCell>
                      <TableCell>{product.rawMaterial}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Production</CardTitle>
                <CardDescription>Sugar production in kilograms over the past year</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MONTHLY_PRODUCTION}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value/1000}k`} />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} kg`, 'Production']} />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name="Production (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Type Distribution</CardTitle>
                <CardDescription>Distribution of sugar products by type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PRODUCT_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {PRODUCT_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#10b981', '#6366f1'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue and Production Correlation</CardTitle>
                <CardDescription>Compare monthly revenue against production volume</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...MONTHLY_REVENUE].map((item, index) => ({
                      name: item.name,
                      revenue: item.value,
                      production: MONTHLY_PRODUCTION[index].value
                    }))}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `₹${value/100000}L`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value/1000}k kg`} />
                    <Tooltip formatter={(value, name) => [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : `${value.toLocaleString()} kg`,
                      name === 'revenue' ? 'Revenue' : 'Production'
                    ]} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      name="Revenue"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="production"
                      stroke="#3b82f6"
                      name="Production (kg)"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MillComponent;