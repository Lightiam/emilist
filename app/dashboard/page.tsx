"use client";
"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaHome, 
  FaTools, 
  FaCalendarAlt, 
  FaFileInvoiceDollar, 
  FaClipboardList, 
  FaChartLine, 
  FaUsers, 
  FaHardHat, 
  FaTasks, 
  FaLightbulb, 
  FaShieldAlt,
  FaBell, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaClock 
} from 'react-icons/fa';
import Header from '../../app/components/layout/Header';
import Footer from '../../app/components/layout/Footer';
import Link from 'next/link';

// Define types for the dashboard data
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  memberSince: string;
  address: string;
  profileImage: string;
}

interface Milestone {
  title: string;
  dueDate: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  providerId: string;
  providerName: string;
  nextMilestone: Milestone | null;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  contactName: string;
  phone: string;
  email: string;
  image: string;
}

interface ProjectInsight {
  projectId: string;
  title: string;
  insights: string[];
  recommendations: string[];
  riskLevel: string;
}

interface TrendingProjects {
  region: string;
  popularTypes: string[];
  averageCosts: Record<string, string>;
  seasonalTip: string;
}

interface Insights {
  summary: string;
  projectInsights: ProjectInsight[];
  trendingProjects: TrendingProjects;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  projectId: string;
}

const DashboardPage = () => {
  // State variables
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock data implementation
        // (Implementation details omitted for brevity)
        
        // Set state with mock data
        setUserData({
          id: 'u123',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          role: 'homeowner',
          memberSince: '2023-05-15',
          address: '123 Main St, Anytown, USA',
          profileImage: '/assets/images/people/worker1.jpg'
        });
        
        setProjects([
          {
            id: 'p1',
            title: 'Kitchen Renovation',
            description: 'Complete kitchen remodel with new cabinets, countertops, and appliances',
            status: 'in-progress',
            progress: 65,
            startDate: '2025-02-10',
            endDate: '2025-04-15',
            budget: 18500,
            spent: 12350,
            providerId: 'sp1',
            providerName: 'Elite Home Renovations',
            nextMilestone: { title: 'Appliance Installation', dueDate: '2025-03-25' }
          },
          // Additional projects would be added here
        ]);
        
        // Set providers, insights, and notifications
        // (Implementation details omitted for brevity)
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Helper functions
  const markNotificationAsRead = (notificationId: string) => {
    // Implementation details omitted for brevity
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'planning':
        return { label: 'Planning', color: '#3498db', icon: <FaClipboardList /> };
      case 'in-progress':
        return { label: 'In Progress', color: '#f39c12', icon: <FaTasks /> };
      case 'completed':
        return { label: 'Completed', color: '#2ecc71', icon: <FaCheckCircle /> };
      case 'on-hold':
        return { label: 'On Hold', color: '#e74c3c', icon: <FaClock /> };
      default:
        return { label: status, color: '#7f8c8d', icon: null };
    }
  };
  
  const getRiskIndicator = (riskLevel: string) => {
    // Implementation details omitted for brevity
    return null;
  };
  
  // Tab content rendering functions
  const renderOverview = () => {
    // Implementation details omitted for brevity
    return <div>Overview content</div>;
  };
  
  const renderProjects = () => {
    // Implementation details omitted for brevity
    return <div>Projects content</div>;
  };
  
  const renderProviders = () => {
    // Implementation details omitted for brevity
    return <div>Providers content</div>;
  };
  
  const renderFinances = () => {
    // Implementation details omitted for brevity
    return <div>Finances content</div>;
  };
  
  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'projects':
        return renderProjects();
      case 'providers':
        return renderProviders();
      case 'finances':
        return renderFinances();
      case 'overview':
      default:
        return renderOverview();
    }
  };
  
  // Render notifications panel
  const renderNotifications = () => {
    // Implementation details omitted for brevity
    return <div>Notifications panel</div>;
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          {userData && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <img 
                  src={userData.profileImage} 
                  alt={userData.name} 
                  className="w-12 h-12 rounded-full object-cover mr-3" 
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{userData.name}</h2>
                  <p className="text-sm text-gray-600 capitalize">{userData.role}</p>
                </div>
              </div>
            </div>
          )}
          
          <nav className="p-4">
            <button 
              className={`flex items-center w-full px-4 py-2 rounded-md mb-2 text-left ${
                activeTab === 'overview' 
                  ? 'bg-primary bg-opacity-10 text-primary font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <FaHome className="mr-3" /> Overview
            </button>
            <button 
              className={`flex items-center w-full px-4 py-2 rounded-md mb-2 text-left ${
                activeTab === 'projects' 
                  ? 'bg-primary bg-opacity-10 text-primary font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('projects')}
            >
              <FaClipboardList className="mr-3" /> Projects
            </button>
            <button 
              className={`flex items-center w-full px-4 py-2 rounded-md mb-2 text-left ${
                activeTab === 'providers' 
                  ? 'bg-primary bg-opacity-10 text-primary font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('providers')}
            >
              <FaHardHat className="mr-3" /> Service Providers
            </button>
            <button 
              className={`flex items-center w-full px-4 py-2 rounded-md mb-2 text-left ${
                activeTab === 'finances' 
                  ? 'bg-primary bg-opacity-10 text-primary font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('finances')}
            >
              <FaFileInvoiceDollar className="mr-3" /> Finances
            </button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'projects' && 'My Projects'}
              {activeTab === 'providers' && 'My Service Providers'}
              {activeTab === 'finances' && 'Financial Overview'}
            </h1>
            
            <div className="relative">
              <button className="text-gray-600 hover:text-gray-900">
                <FaBell className="text-xl" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="dashboard-content">
            {renderTabContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
