'use client';

import React, {useState} from 'react';
import {auth} from '@/lib/firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import TabBar from "@/components/TabBar";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect to home page after successful registration
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <h1 className="text-2xl font-semibold mb-4">Register</h1>

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
          <Button onClick={handleSignUp}>Register</Button>

          <p className="mt-4">
            Already have an account? <a href="/login" className="text-primary">Login</a>
          </p>
        </div>
      </div>
      <TabBar/>
    </div>
  );
};

export default RegisterPage;
