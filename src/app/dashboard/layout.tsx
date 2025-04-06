"use client";

import { TabsProvider } from "@/TabsContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/auth');
            } else {
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }


    return (
        <TabsProvider>
            {children}
        </TabsProvider>
    );
}