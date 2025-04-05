import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const featuredListings = [
    { id: 1, title: "Premium Apartment", location: "Downtown", price: "$1,200/month", tags: ["Verified", "Top Rated"], image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" },
    { id: 2, title: "Cozy Studio", location: "Midtown", price: "$800/month", tags: ["Pet Friendly"], image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" },
    { id: 3, title: "Modern Loft", location: "West End", price: "$1,500/month", tags: ["Furnished", "New"], image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Find Your Perfect Match
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Connect with verified properties and trusted landlords in your area.
              </p>
            </div>
            <div className="w-full max-w-md space-y-2">
              <div className="relative flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="Search by location, price, or features..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit">Search</Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Over 10,000 properties available nationwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="apartments">Apartments</TabsTrigger>
            <TabsTrigger value="houses">Houses</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={listing.image} 
                      alt={listing.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{listing.title}</CardTitle>
                      <p className="font-bold text-primary">{listing.price}</p>
                    </div>
                    <CardDescription>{listing.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">More Info</Button>
                    <Button>Contact</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          {/* Other tab contents would be similar */}
          <TabsContent value="apartments" className="mt-6">
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-500">Apartment listings coming soon</p>
            </div>
          </TabsContent>
          <TabsContent value="houses" className="mt-6">
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-500">House listings coming soon</p>
            </div>
          </TabsContent>
          <TabsContent value="rooms" className="mt-6">
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-500">Room listings coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose Us</h2>
            <p className="text-gray-500 mt-2">Our platform offers the best experience for renters and property owners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Verified Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All properties are verified by our team to ensure quality and accuracy.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our secure payment system protects both renters and property owners.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our customer support team is available around the clock to assist you.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-muted rounded-lg my-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Join thousands of satisfied users already on our platform
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button size="lg">Sign Up Now</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}