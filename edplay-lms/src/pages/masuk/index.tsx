'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card } from '~/components/ui/card';
import { trpc } from '~/utils/trpc';
import type { NextPageWithLayout } from '../_app';
import Navbar from '~/components/Navbar';
import toast from 'react-hot-toast';

const LoginPage: NextPageWithLayout = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [loggedInUser, setLoggedInUser] = useState<{
    token: string;
    user: {
      user_id: number;
      username: string;
      fullname: string;
      schoolId: number;
    };
  } | null>(null);

  const loginMutation = trpc.user.login.useMutation({
    onSuccess(data) {
      setLoggedInUser(data);
      toast.success('Login successful!');
    },
    onError(error: any) {
      toast.error('Login error: ' + error.message);
    },
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({
        username: loginData.username,
        password: loginData.password,
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      <Navbar />
      <main className="container mx-auto max-w-2xl pt-4 px-4">
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-3xl font-bold mt-2">Masuk ke EdPlay</h1>
          <h2 className="text-xl font-semibold">Silakan login dengan akun Anda</h2>
        </div>

        <Card className="p-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              {loginMutation.status === 'pending' ? 'Logging in...' : 'Masuk'}
            </Button>
            {loginMutation.error && (
              <p className="text-red-500">{loginMutation.error.message}</p>
            )}
          </form>
        </Card>

        {loggedInUser && <p className="text-center mt-4">User logged in!</p>}
      </main>
    </div>
  );
};

export default LoginPage;
