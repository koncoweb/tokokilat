'use client';

import React, {useState} from 'react';
import {auth} from '@/lib/firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import TabBar from "@/components/TabBar";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect to home page after successful login
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-semibold mb-4">Login</h1>

          {error && <div className="text-red-500 mb-4">{error}</div>}

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
          <p className="mt-4">
            Don't have an account? <a href="/register" className="text-primary">Register</a>
          </p>
        </div>
      </div>
      <TabBar/>
    </div>
  );
};

export default LoginPage;
