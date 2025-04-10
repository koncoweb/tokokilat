'use client';

import React, {useState, useEffect} from 'react';
import {auth} from '@/lib/firebase';
import {signOut, onAuthStateChanged} from 'firebase/auth';
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login page after sign out
    } catch (error: any) {
      alert(`Sign out failed: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p>Please <a href="/login" className="text-primary">login</a> to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div>
        <p>Welcome, {user.email}!</p>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
      <p>This is the profile page. You can display user information and settings here.</p>
    </div>
  );
};

export default ProfilePage;
