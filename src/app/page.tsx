import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-900/10 dark:to-black font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-green-800 dark:text-green-100">
          SugarMommy
        </h1>
        <p className="text-xl md:text-2xl text-green-600 dark:text-green-300 mb-12 max-w-3xl mx-auto">
          Connecting sugarcane farmers, mills, and customers in one sweet ecosystem
        </p>
        <div>
          <Link href="/dashboard">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full">
              Enter Marketplace
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-green-800 dark:text-green-100">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Premium White Sugar",
              producer: "Sweet Mills Ltd.",
              image: "1.jpeg"
            },
            {
              title: "Natural Brown Sugar",
              producer: "Organic Sugar Mills",
              image: "2.jpeg"
            },
            {
              title: "Premium Sugarcane",
              producer: "Local Farmers Collective",
              image: "3.jpeg"
            }
          ].map((item, index) => (
            <div key={index}>
              <Card className="border-green-200 dark:border-green-800 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-300">{item.title}</CardTitle>
                  <CardDescription>{item.producer}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-green-100 rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-green-50 dark:bg-green-900/20 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-green-800 dark:text-green-100">Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Patel",
                role: "Sugarcane Farmer",
                testimonial: "SugarMommy has helped me connect directly with mills, eliminating middlemen and increasing my profits significantly."
              },
              {
                name: "Sudha Mehta",
                role: "Sugar Mill Owner",
                testimonial: "We've streamlined our supply chain and improved quality control by sourcing directly from verified farmers on this platform."
              },
              {
                name: "Vivek Kumar",
                role: "Bulk Customer",
                testimonial: "The transparency in pricing and quality has transformed how we source sugar for our confectionery business."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-green-900/30 p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-green-200 flex items-center justify-center mr-4">
                    <span className="text-green-600">{item.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800 dark:text-green-200">{item.name}</h3>
                    <p className="text-green-600 dark:text-green-400">{item.role}</p>
                  </div>
                </div>
                <p className="text-green-700 dark:text-green-300">
                  "{item.testimonial}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-800 dark:text-green-100">Join Our Sugar Ecosystem</h2>
          <p className="text-xl text-green-600 dark:text-green-300 mb-8">
            Whether you're a farmer, mill owner, or customer - become part of India's most transparent sugar marketplace.
          </p>
          <Link href="/auth/signup">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full">
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}