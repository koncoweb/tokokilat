'use client';

import React, {useState, useEffect} from 'react';
import {auth} from '@/lib/firebase';
import {signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

const ProfilePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert(`Sign in failed: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      alert(`Sign out failed: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      ) : (
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleSignIn}>Sign In</Button>
        </div>
      )}

      <p>This is the profile page. You can display user information and settings here.</p>
    </div>
  );
};

export default ProfilePage;
