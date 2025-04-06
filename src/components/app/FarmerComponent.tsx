import React, { useState, useRef, useEffect } from 'react';
import { FarmerListing } from '@/lib/models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ClipboardList,
  DollarSign,
  Loader,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  FileUp,
  AlertCircle,
} from 'lucide-react';
// Removed direct Gradio client import
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MONTHLY_PRODUCTION, MONTHLY_REVENUE, PRODUCT_DISTRIBUTION } from '../constants';

// Form schema for listing sugarcane
const formSchema = z.object({
  variety: z.string().min(2, {
    message: "Variety must be at least 2 characters.",
  }),
  quantity: z.string().min(1, {
    message: "Quantity is required.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  quality: z.enum(["premium", "standard", "economy"], {
    message: "Please select a quality grade.",
  }),
  harvestDate: z.string().min(1, {
    message: "Harvest date is required.",
  }),
  description: z.string().optional(),
});

const StatusBadge = ({ status }: { status: 'completed' | 'processing' | 'pending' | 'rejected' }) => {
  const statusMap = {
    completed: { icon: <CheckCircle className="h-4 w-4 mr-1" />, color: "bg-green-100 text-green-800" },
    processing: { icon: <Loader className="h-4 w-4 mr-1 animate-spin" />, color: "bg-blue-100 text-blue-800" },
    pending: { icon: <Clock className="h-4 w-4 mr-1" />, color: "bg-yellow-100 text-yellow-800" },
    rejected: { icon: <XCircle className="h-4 w-4 mr-1" />, color: "bg-red-100 text-red-800" },
  };

  const { icon, color } = statusMap[status] || statusMap.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const FarmerComponent = () => {
  const [listings, setListings] = useState<FarmerListing[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  // Fetch farmer listings from Firestore
  useEffect(() => {
    async function fetchListings() {
      try {
        const { getFarmerListings } = await import('@/lib/firestore');
        const fetchedListings = await getFarmerListings();
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setPredictionError('Failed to load listings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchListings();
  }, []);


  // Calculate summary values
  const totalRevenue = listings.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const pendingListings = listings.filter(item => item.status === "pending").length;
  const completedListings = listings.filter(item => item.status === "completed").length;

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variety: "",
      quantity: "",
      harvestDate: "",
      description: "",
      quality: "standard" as "premium" | "standard" | "economy",
      price: "",
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith('.csv')) {
        setCsvFile(file as any);
        setFileName(file.name);
        setPredictionError("");
      } else {
        setPredictionError("Please upload a CSV file");
        setCsvFile(null);
        setFileName("");
      }
    }
  };

  // Process the CSV file and get quality predictions
  const processCsvFile = async () => {
    if (!csvFile) {
      setPredictionError("Please upload a CSV file first");
      return;
    }

    setIsPredicting(true);
    setPredictionError("");
    setUploadProgress(10);

    try {
      // Create form data to send to our Next.js API
      const formData = new FormData();
      formData.append('file', csvFile);
      
      setUploadProgress(30);
      
      // Call our Next.js API endpoint instead of Gradio directly
      const response = await fetch('/api/prediction', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress(60);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Parse the JSON response
      const qualityData = await response.json();
      setUploadProgress(100);
      
      setPredictionResult(qualityData as any); // Type assertion to handle unknown type

      // Determine predominant quality and set price
      const quality = determinePredominantQuality(qualityData as Record<string, unknown>);
      const price = determinePrice(quality);

      // Set form values
      form.setValue("quality", quality.toLowerCase() as "premium" | "standard" | "economy");
      form.setValue("price", price.toString());

      // Show quality result alert
      return { quality, price };

    } catch (error) {
      console.error("Error processing CSV:", error);
      setPredictionError("Failed to analyze your sugarcane data. Please try again.");
      return null;
    } finally {
      setIsPredicting(false);
    }
  };

  // Determine predominant quality from API response
  const determinePredominantQuality = (data: Record<string, unknown>): string => {
    try {
      // This is a placeholder - adjust based on actual API response format
      if (!data) return "Standard";

      // Example: If the data has quality grades and percentages
      const grades = {
        "Premium": 0,
        "Standard": 0,
        "Economy": 0
      };

      // Parse the data to find predominant quality
      Object.entries(data).forEach(([key, value]) => {
        if (key.includes("Grade") || key.includes("Quality")) {
          const percentage = parseFloat(String(value).replace("%", ""));
          if (percentage > 60) grades["Premium"] += percentage;
          else if (percentage > 40) grades["Standard"] += percentage;
          else grades["Economy"] += percentage;
        }
      });

      // Find the quality with highest score
      return Object.entries(grades).sort((a, b) => b[1] - a[1])[0][0];
    } catch (e) {
      console.error("Error determining quality:", e);
      return "Standard";
    }
  };

  // Determine price based on quality
  const determinePrice = (quality: string): number => {
    const basePrices = {
      "Premium": 2800,
      "Standard": 2650,
      "Economy": 2500
    };

    // Add small random variation to make prices look realistic
    const basePrice = basePrices[quality as keyof typeof basePrices] || basePrices["Standard"];
    const variation = Math.floor(Math.random() * 51) - 25; // -25 to +25
    return basePrice + variation;
  };

  // Submit handler for new listing
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Get quality and price from form (set by prediction)
      const quality = values.quality || "Standard";
      const price = values.price || "2650";
      
      // Import the uploadFarmerListing function
      const { uploadFarmerListing } = await import('@/lib/firestore');
      
      // Upload the listing to Firestore
      const listing = {
        variety: values.variety,
        quantity: values.quantity + " tons",
        price: "₹" + price + "/ton",
        quality: quality.charAt(0).toUpperCase() + quality.slice(1),
        harvestDate: values.harvestDate,
        description: values.description
      };
      
      const id = await uploadFarmerListing({
        variety: values.variety,
        quantity: values.quantity + " tons",
        price: "₹" + values.price + "/ton",
        quality: values.quality,
        harvestDate: values.harvestDate,
        description: values.description
      });
      
      // Create new listing for UI
      const newListing = {
        id,
        ...listing,
        status: "pending",
        buyer: "Pending",
        revenue: parseInt(values.quantity) * parseInt(price),
        farmer: "You", // Will be replaced by actual user name in Firestore
        farmerId: "", // Will be set in Firestore
        createdAt: Date.now()
      };

      setListings([{
        ...newListing as FarmerListing,
        quality: newListing.quality.toLowerCase() as "premium" | "standard" | "economy"
      }, ...listings]);
      form.reset();
      setCsvFile(null);
      setFileName("");
      setPredictionResult(null);
    } catch (error) {
      console.error('Error creating listing:', error);
      setPredictionError('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Reset file upload
  const resetFileUpload = () => {
    setCsvFile(null);
    setFileName("");
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).value = "";
    }
    setPredictionResult(null);
  };

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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardList className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{listings.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-2xl font-bold">{pendingListings}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold">{completedListings}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="listings">New Listing</TabsTrigger>
          <TabsTrigger value="history">Listing History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* New Listing Form - unchanged */}
        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>List Your Sugarcane</CardTitle>
              <CardDescription>Fill in the details to list your sugarcane for sale.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* CSV Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".csv"
                      className="hidden"
                      id="csv-upload"
                    />

                    {!fileName ? (
                      <div className="text-center space-y-4">
                        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="text-lg font-medium">Upload your sugarcane data</h3>
                        <p className="text-sm text-gray-500">
                          Upload a CSV file with your sugarcane measurements to get quality and price recommendations
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("csv-upload")?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Select CSV File
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <h3 className="text-lg font-medium">File selected: {fileName}</h3>

                        <div className="flex justify-center space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetFileUpload}
                          >
                            Choose Different File
                          </Button>
                          <Button
                            type="button"
                            onClick={processCsvFile}
                            disabled={isPredicting || !csvFile}
                          >
                            {isPredicting ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              "Analyze Quality & Price"
                            )}
                          </Button>
                        </div>

                        {/* Progress indicator */}
                        {isPredicting && (
                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-sm">
                              <span>Processing data...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {predictionError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{predictionError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Prediction results */}
                  {predictionResult && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                      <h3 className="text-lg font-semibold mb-2 text-green-800">Quality Analysis Results</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Recommended Quality Grade</span>
                          <span className="block text-xl font-bold text-green-700">
                            {form.getValues("quality") || "Standard"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Recommended Price</span>
                          <span className="block text-xl font-bold text-green-700">
                            ₹{form.getValues("price") || "2650"}/ton
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="variety"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sugarcane Variety</FormLabel>
                          <FormControl>
                            <Input placeholder="CO-86032, CO-0238, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity (tons)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Quantity in tons" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="harvestDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harvest Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                        <FormLabel>Additional Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional information about your sugarcane..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !csvFile || !predictionResult}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "List Sugarcane"
                    )}
                  </Button>

                  {!predictionResult && csvFile && (
                    <p className="text-center text-sm text-amber-600">
                      Please analyze your file to get quality and price recommendations before submitting
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Listing History Tab - unchanged */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Listing History</CardTitle>
              <CardDescription>View all your past and current sugarcane listings.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">You haven't created any listings yet. Use the "New Listing" tab to create your first listing.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Variety</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Harvest Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.id}</TableCell>
                        <TableCell>{listing.variety}</TableCell>
                        <TableCell>{listing.quantity}</TableCell>
                        <TableCell>{listing.price}</TableCell>
                        <TableCell>{listing.quality}</TableCell>
                        <TableCell>{listing.harvestDate}</TableCell>
                        <TableCell>
                          <StatusBadge status={listing.status as 'completed' | 'processing' | 'pending' | 'rejected'} />
                        </TableCell>
                        <TableCell>{listing.buyer}</TableCell>
                        <TableCell>₹{listing.revenue?.toLocaleString() || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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

export default FarmerComponent;