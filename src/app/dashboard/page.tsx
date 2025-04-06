'use client';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { useTabs } from '@/TabsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomerComponent from '@/components/app/CustomerComponent';
import MillComponent from '@/components/app/MillComponent';
import FarmerComponent from '@/components/app/FarmerComponent';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';


export default function DashboardPage() {
    const router = useRouter();
    const { activeTab, setActiveTab } = useTabs();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'customer':
                return <CustomerComponent />;
            case 'mill':
                return <MillComponent />;
            case 'farmer':
                return <FarmerComponent />;
            default:
                return <CustomerComponent />;
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('User signed out successfully');
        } catch(e){
            console.log("Error signing out: ", e);
        }
        router.push('/');
    }

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800 flex items-center">
                        <Leaf className="mr-2" /> Sugar Mommy
                    </h1>
                    <div className="flex space-x-4">
                        <Select value={activeTab} onValueChange={setActiveTab}>
                            <SelectTrigger className="">
                                <SelectValue placeholder={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
                            </SelectTrigger>
                            <SelectContent>
                                {['customer', 'mill', 'farmer'].map((tab) => (
                                    <SelectItem
                                        key={tab}
                                        value={tab}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Link href="/dashboard/profile" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200">
                            Edit Profile
                        </Link>
                        <Button variant="outline" className="bg-red-600 text-white rounded hover:bg-red-700 transition duration-200" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}