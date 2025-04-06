// Sample data for sugar products from mills
const MILL_PRODUCTS = [
    {
        id: "SP001",
        name: "Premium White Sugar",
        type: "white",
        price: 45,
        quantity: 5000,
        unit: "kg",
        packageSize: 50,
        producer: "Sweet Mills Ltd.",
        rating: 4.8,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1581268497091-31132809fef6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        description: "High-quality refined white sugar with 99.8% purity, perfect for baking and cooking.",
        sugarContent: "99.8%",
        origin: "Maharashtra"
    },
    {
        id: "SP002",
        name: "Natural Brown Sugar",
        type: "brown",
        price: 55,
        quantity: 3500,
        unit: "kg",
        packageSize: 25,
        producer: "Organic Sugar Mills",
        rating: 4.6,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1584473457793-99817725c9dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        description: "100% natural brown sugar with rich molasses flavor, ideal for desserts and beverages.",
        sugarContent: "97.5%",
        origin: "Karnataka"
    },
    {
        id: "SP003",
        name: "Refined Sugar Powder",
        type: "powdered",
        price: 60,
        quantity: 2000,
        unit: "kg",
        packageSize: 10,
        producer: "Sweet Mills Ltd.",
        rating: 4.9,
        reviews: 56,
        image: "https://images.unsplash.com/photo-1558642891-54be180ea339?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        description: "Ultra-fine powdered sugar, perfect for decorating desserts and making icing.",
        sugarContent: "99.5%",
        origin: "Uttar Pradesh"
    },
    {
        id: "SP004",
        name: "Raw Cane Sugar",
        type: "raw",
        price: 35,
        quantity: 8000,
        unit: "kg",
        packageSize: 100,
        producer: "Traditional Sugar Co.",
        rating: 4.3,
        reviews: 73,
        image: "https://images.unsplash.com/photo-1549191029-2f071e5f90cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        description: "Minimally processed raw sugar with natural flavor and nutrients intact.",
        sugarContent: "96.0%",
        origin: "Tamil Nadu"
    },
    {
        id: "SP005",
        name: "Jaggery Blocks",
        type: "jaggery",
        price: 70,
        quantity: 1500,
        unit: "kg",
        packageSize: 5,
        producer: "Traditional Sugar Co.",
        rating: 4.7,
        reviews: 102,
        image: "https://images.unsplash.com/photo-1599940235377-f6d815ddd8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        description: "Traditional jaggery blocks made from concentrated sugarcane juice, rich in minerals.",
        sugarContent: "85.0%",
        origin: "Gujarat"
    },
    {
        id: "SP006",
        name: "Organic Coconut Sugar",
        type: "coconut",
        price: 85,
        quantity: 1000,
        unit: "kg",
        packageSize: 1,
        producer: "Organic Sugar Mills",
        rating: 4.9,
        reviews: 65,
        image: "https://images.unsplash.com/photo-1621638521793-b1e722830090?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        description: "Low-glycemic coconut sugar, sustainably harvested and perfect for health-conscious consumers.",
        sugarContent: "93.0%",
        origin: "Kerala"
    },
];

// Sample data for raw sugarcane from farmers
const FARMER_PRODUCTS = [
    {
        id: "SC001",
        name: "Premium CO-86032 Sugarcane",
        variety: "CO-86032",
        price: 2800,
        quantity: 500,
        unit: "ton",
        farmer: "Rajesh Patel",
        rating: 4.7,
        reviews: 42,
        image: "https://images.unsplash.com/photo-1627207785566-00a505799891?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        description: "High-yield premium quality sugarcane variety with excellent sugar recovery.",
        quality: "Premium",
        harvestDate: "2025-03-15",
        origin: "Maharashtra"
    },
    {
        id: "SC002",
        name: "CO-0238 Standard Sugarcane",
        variety: "CO-0238",
        price: 2650,
        quantity: 350,
        unit: "ton",
        farmer: "Suresh Kumar",
        rating: 4.4,
        reviews: 28,
        image: "https://images.unsplash.com/photo-1598811629267-faaec4328240?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        description: "Popular variety with good sugar content and disease resistance.",
        quality: "Standard",
        harvestDate: "2025-03-25",
        origin: "Uttar Pradesh"
    },
    {
        id: "SC003",
        name: "Organic CO-86032 Sugarcane",
        variety: "CO-86032",
        price: 3100,
        quantity: 200,
        unit: "ton",
        farmer: "Meena Singh",
        rating: 4.9,
        reviews: 36,
        image: "https://images.unsplash.com/photo-1601522261938-57c11b2f8a83?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        description: "Organically grown premium sugarcane without chemical fertilizers or pesticides.",
        quality: "Premium",
        harvestDate: "2025-04-05",
        origin: "Karnataka"
    },
    {
        id: "SC004",
        name: "CO-0238 Bulk Sugarcane",
        variety: "CO-0238",
        price: 2750,
        quantity: 600,
        unit: "ton",
        farmer: "Vijay Sharma",
        rating: 4.6,
        reviews: 31,
        image: "https://images.unsplash.com/photo-1593253787226-567eda4ad32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        description: "High-quality sugarcane available in bulk quantities for mills.",
        quality: "Premium",
        harvestDate: "2025-04-10",
        origin: "Maharashtra"
    },
];


// Sample data for past listings
const SAMPLE_LISTINGS = [
    {
        id: "12345",
        variety: "CO-86032",
        quantity: "500 tons",
        price: "₹2,800/ton",
        quality: "Premium",
        harvestDate: "2025-03-15",
        status: "completed",
        buyer: "Sweet Mills Ltd.",
        revenue: 1400000
    },
    {
        id: "12346",
        variety: "CO-0238",
        quantity: "350 tons",
        price: "₹2,650/ton",
        quality: "Standard",
        harvestDate: "2025-03-25",
        status: "processing",
        buyer: "Pending",
        revenue: 927500
    },
    {
        id: "12347",
        variety: "CO-0238",
        quantity: "600 tons",
        price: "₹2,750/ton",
        quality: "Premium",
        harvestDate: "2025-04-10",
        status: "pending",
        buyer: "Pending",
        revenue: 1650000
    },
];


// Monthly production data
const MONTHLY_PRODUCTION = [
    { name: 'Jan', value: 32000 },
    { name: 'Feb', value: 38000 },
    { name: 'Mar', value: 45000 },
    { name: 'Apr', value: 42000 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 },
    { name: 'Aug', value: 0 },
    { name: 'Sep', value: 0 },
    { name: 'Oct', value: 28000 },
    { name: 'Nov', value: 34000 },
    { name: 'Dec', value: 30000 },
];

// Product type distribution
const PRODUCT_DISTRIBUTION = [
    { name: 'CO-86032', value: 35 },
    { name: 'CO-0238', value: 30 },
    { name: 'CO-118', value: 20 },
    { name: 'CO-62175', value: 15 },
];

// Monthly revenue data
const MONTHLY_REVENUE = [
    { name: 'Jan', value: 1440000 },
    { name: 'Feb', value: 1750000 },
    { name: 'Mar', value: 2025000 },
    { name: 'Apr', value: 1890000 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 },
    { name: 'Aug', value: 0 },
    { name: 'Sep', value: 0 },
    { name: 'Oct', value: 1260000 },
    { name: 'Nov', value: 1580000 },
    { name: 'Dec', value: 1350000 },
];



// Sample data for products
const SAMPLE_PRODUCTS = [
    {
        id: "SP001",
        productName: "Premium White Sugar",
        productType: "white",
        quantity: "5,000 kgs",
        price: "₹45/kg",
        sugarContent: "99.8%",
        packageSize: "50 kg",
        status: "in-stock",
        productionDate: "2025-03-15",
        revenue: 225000,
        rawMaterial: "CO-86032",
        purity: "High"
    },
    {
        id: "SP002",
        productName: "Brown Sugar",
        productType: "brown",
        quantity: "3,500 kgs",
        price: "₹55/kg",
        sugarContent: "97.5%",
        packageSize: "25 kg",
        status: "in-stock",
        productionDate: "2025-03-20",
        revenue: 192500,
        rawMaterial: "CO-0238",
        purity: "Medium"
    },
    {
        id: "SP003",
        productName: "Refined Sugar Powder",
        productType: "powdered",
        quantity: "2,000 kgs",
        price: "₹60/kg",
        sugarContent: "99.5%",
        packageSize: "10 kg",
        status: "low-stock",
        productionDate: "2025-04-01",
        revenue: 120000,
        rawMaterial: "CO-86032",
        purity: "High"
    },
    {
        id: "SP004",
        productName: "Raw Sugar",
        productType: "raw",
        quantity: "8,000 kgs",
        price: "₹35/kg",
        sugarContent: "96.0%",
        packageSize: "100 kg",
        status: "in-stock",
        productionDate: "2025-03-25",
        revenue: 280000,
        rawMaterial: "Mixed",
        purity: "Low"
    },
];