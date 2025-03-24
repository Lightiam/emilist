"use client";

import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Project {
  id: number;
  title: string;
  status: 'In Progress' | 'Pending' | 'Completed';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  contractor: string;
  description: string;
  tasks: {
    id: number;
    name: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    dueDate: string;
  }[];
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'Kitchen Renovation',
      status: 'In Progress',
      progress: 65,
      startDate: '2025-02-15',
      endDate: '2025-04-30',
      budget: 25000,
      spent: 16250,
      contractor: 'Modern Kitchens Inc.',
      description: 'Complete renovation of kitchen including new cabinets, countertops, appliances, and flooring.',
      tasks: [
        {
          id: 101,
          name: 'Demolition',
          status: 'Completed',
          dueDate: '2025-02-20'
        },
        {
          id: 102,
          name: 'Plumbing Rough-In',
          status: 'Completed',
          dueDate: '2025-02-28'
        },
        {
          id: 103,
          name: 'Electrical Rough-In',
          status: 'Completed',
          dueDate: '2025-03-05'
        },
        {
          id: 104,
          name: 'Cabinet Installation',
          status: 'In Progress',
          dueDate: '2025-03-25'
        },
        {
          id: 105,
          name: 'Countertop Installation',
          status: 'Not Started',
          dueDate: '2025-04-05'
        },
        {
          id: 106,
          name: 'Appliance Installation',
          status: 'Not Started',
          dueDate: '2025-04-15'
        },
        {
          id: 107,
          name: 'Final Inspection',
          status: 'Not Started',
          dueDate: '2025-04-25'
        }
      ]
    },
    {
      id: 2,
      title: 'Bathroom Remodel',
      status: 'Pending',
      progress: 0,
      startDate: '2025-05-10',
      endDate: '2025-06-15',
      budget: 12000,
      spent: 0,
      contractor: 'Luxury Bathrooms LLC',
      description: 'Master bathroom remodel with new shower, vanity, toilet, and tile work.',
      tasks: [
        {
          id: 201,
          name: 'Design Approval',
          status: 'In Progress',
          dueDate: '2025-04-30'
        },
        {
          id: 202,
          name: 'Material Selection',
          status: 'In Progress',
          dueDate: '2025-05-05'
        },
        {
          id: 203,
          name: 'Demolition',
          status: 'Not Started',
          dueDate: '2025-05-15'
        },
        {
          id: 204,
          name: 'Plumbing Work',
          status: 'Not Started',
          dueDate: '2025-05-25'
        },
        {
          id: 205,
          name: 'Tile Installation',
          status: 'Not Started',
          dueDate: '2025-06-05'
        },
        {
          id: 206,
          name: 'Fixture Installation',
          status: 'Not Started',
          dueDate: '2025-06-10'
        }
      ]
    }
  ]);
  
  const [activeProject, setActiveProject] = useState<Project | null>(projects[0]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Project Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Project List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">My Projects</h2>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      activeProject?.id === project.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveProject(project)}
                  >
                    <div className="font-medium">{project.title}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        activeProject?.id === project.id
                          ? 'bg-white text-primary'
                          : getStatusColor(project.status)
                      }`}>
                        {project.status}
                      </span>
                      <span className="text-sm">{project.progress}% Complete</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors">
                Add New Project
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
              <div className="bg-gray-100 rounded-md p-3 mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  Need help with your project? Ask our AI assistant for recommendations, troubleshooting, or advice.
                </p>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  rows={3}
                  placeholder="Ask a question about your project..."
                ></textarea>
                <button className="w-full mt-2 bg-primary text-white py-1.5 rounded-md hover:bg-primary-dark transition-colors text-sm">
                  Get AI Recommendations
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeProject ? (
              <>
                {/* Project Overview */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{activeProject.title}</h2>
                      <p className="text-gray-600">{activeProject.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(activeProject.status)}`}>
                      {activeProject.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-500">Start Date</div>
                      <div className="font-medium">{formatDate(activeProject.startDate)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-500">End Date</div>
                      <div className="font-medium">{formatDate(activeProject.endDate)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-500">Contractor</div>
                      <div className="font-medium">{activeProject.contractor}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-500">Progress</div>
                      <div className="font-medium">{activeProject.progress}%</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <div className="text-sm font-medium">Budget</div>
                      <div className="text-sm">
                        {formatCurrency(activeProject.spent)} / {formatCurrency(activeProject.budget)}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          activeProject.spent > activeProject.budget ? 'bg-red-500' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(100, (activeProject.spent / activeProject.budget) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                      Update Project
                    </button>
                    <button className="bg-white border border-primary text-primary px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      Contact Contractor
                    </button>
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      View Documents
                    </button>
                  </div>
                </div>
                
                {/* Tasks */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">Project Tasks</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Task
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeProject.tasks.map((task) => (
                          <tr key={task.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{task.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatDate(task.dueDate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-primary hover:text-primary-dark mr-3">Edit</button>
                              <button className="text-gray-500 hover:text-gray-700">Details</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button className="mt-4 bg-white border border-primary text-primary px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                    Add New Task
                  </button>
                </div>
                
                {/* AI Recommendations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">AI Project Insights</h3>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-800">
                          <strong>Schedule Risk:</strong> Based on current progress, your project may be delayed by 5-7 days. Consider discussing timeline adjustments with your contractor.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-800">
                          <strong>Budget Optimization:</strong> You're currently 5% under budget for this stage of the project. Consider allocating these savings to higher quality countertops.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Material Recommendation:</strong> Based on your project timeline, order countertops by April 1st to avoid potential delays in installation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">Select a project to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
