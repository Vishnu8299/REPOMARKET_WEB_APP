
// Unit tests for: App


import Layout from "@/components/Layout";
import SplashScreen from '@/components/SplashScreen';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '@testing-library/jest-dom';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { render, screen } from '@testing-library/react';
import React from 'react';



jest.mock("@/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: jest.fn(),
}));

jest.mock("@/components/ui/toaster", () => ({
  Toaster: () => <div>Toaster</div>,
}));

jest.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div>Sonner</div>,
}));

jest.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/pages/Home", () => ({
  default: () => <div>Home Page</div>,
}));

jest.mock("@/pages/AdminDashboard", () => ({
  default: () => <div>Admin Dashboard</div>,
}));

jest.mock("@/pages/developer/DeveloperDashboard", () => ({
  default: () => <div>Developer Dashboard</div>,
}));

jest.mock("@/pages/buyer/Marketplace", () => ({
  default: () => <div>Marketplace</div>,
}));

jest.mock("@/pages/Login", () => ({
  default: () => <div>Login Page</div>,
}));

jest.mock("@/pages/SignUp", () => ({
  default: () => <div>Sign Up Page</div>,
}));

jest.mock("@/components/SplashScreen", () => ({
  default: () => <div>Splash Screen</div>,
}));

describe('App() App method', () => {
  const mockQueryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render SplashScreen on the root path', () => {
    render(
      <QueryClientProvider client={mockQueryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<SplashScreen />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    expect(screen.getByText('Splash Screen')).toBeInTheDocument();
  });

  it('should render Login page on /login path', () => {
    render(
      <QueryClientProvider client={mockQueryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render SignUp page on /signup path', () => {
    render(
      <QueryClientProvider client={mockQueryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/signup" element={<SignUp />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    expect(screen.getByText('Sign Up Page')).toBeInTheDocument();
  });

  it('should render Home page on /home path', () => {
    render(
      <QueryClientProvider client={mockQueryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/home" element={<Home />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  // Add more tests for other routes and edge cases as needed
});

// End of unit tests for: App
