import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Link as LinkIcon, Shield, Download, Menu, X } from 'lucide-react';
import type { Admin as AdminType } from '../types';
import { readJsonFile } from '../services/dataService';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const username = '@johndoe'; // Hardcoded username for now

  useEffect(() => {
    const loadAdmins = async () => {
      const data = await readJsonFile<{ admins: AdminType[] }>('admin.json');
      if (data?.admins) {
        setIsAdmin(data.admins.some(admin => admin.username === username));
      } else {
        setIsAdmin(false);
      }
    };
    loadAdmins();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, showToAdmin: true },
    { name: 'Profile', href: '/profile', icon: User, showToAdmin: true },
    { name: 'Links', href: '/links', icon: LinkIcon, showToAdmin: true },
    { name: 'Admin', href: '/admin', icon: Shield, showToAdmin: true },
    { name: 'Downloads', href: '/downloads', icon: Download, showToAdmin: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 rounded-md bg-white p-2 shadow-md lg:hidden flex items-center"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          <span className="ml-2 text-xl font-bold text-gray-900">MemeX Bot</span>
        </button>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 flex w-64 flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-xl font-bold text-gray-900">MemeX Bot</h1>
              </div>
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                {navigation.map((item) => {
                  if (!item.showToAdmin) return null;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        location.pathname === item.href
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                    >
                      <Icon
                        className={`${
                          location.pathname === item.href
                            ? 'text-gray-500'
                            : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 h-5 w-5 flex-shrink-0`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : ''}`}>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
