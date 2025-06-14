'use client';

import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card } from '~/components/ui/card';
import { trpc } from '~/utils/trpc';
import type { NextPageWithLayout } from '../_app';
import Navbar from '~/components/NavbarAlt';
import toast from 'react-hot-toast';

const LoginPage: NextPageWithLayout = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    console.log('Current cookies:', document.cookie);

    // Manually check if token is in cookies
    const hasToken = document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('token='));
    console.log('Has token cookie:', hasToken);

    // If token exists, should not be on login page
    if (hasToken) {
      console.log('Token found but still on login page - middleware issue!');
    }
  }, []);

  const loginMutation = trpc.user.login.useMutation({
    onSuccess(data) {
      toast.success('Login successful!');
      console.log('Login successful, data:', data);

      // Set redirecting state
      setIsRedirecting(true);

      // Force a small delay to ensure cookie is set
      setTimeout(() => {
        // Use window.location for a full page navigation instead of router.push
        window.location.href = '/course';
      }, 100);
    },
    onError(error: any) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      toast.error('Login error: ' + errorMessage);
    },
  });

  // Check if token exists on mount - debugging
  useEffect(() => {
    console.log('Current cookies:', document.cookie);
    // You could also add a check here to see if token exists on load
    // and redirect if it does
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('Submitting login for:', loginData.username);
      await loginMutation.mutateAsync(loginData);
    } catch (error) {
      console.error('Login submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF3]">
      <Navbar />
      <main className="container mx-auto max-w-2xl pt-4 px-4">
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-3xl font-bold mt-2">Masuk ke EdPlay</h1>
          <h2 className="text-xl font-semibold">
            Silakan login dengan akun Anda
          </h2>
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
            <Button
              type="submit"
              className="w-full bg-[#334589] hover:bg-orange-600"
              disabled={isRedirecting || loginMutation.status === 'pending'}
            >
              {isRedirecting
                ? 'Redirecting...'
                : loginMutation.status === 'pending'
                  ? 'Logging in...'
                  : 'Masuk'}
            </Button>
            {loginMutation.error && (
              <p className="text-red-500">{loginMutation.error.message}</p>
            )}
          </form>
        </Card>
      </main>
    </div>
  );
};

export default LoginPage;
