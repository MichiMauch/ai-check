'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';

interface AdminStats {
  summary: {
    totalAssessments: number;
    totalLeads: number;
    conversionRate: string;
  };
  industryStats: Array<{
    industry: string;
    industryId: string;
    count: number;
  }>;
  levelStats: Array<{
    level: string;
    count: number;
  }>;
  companySizeStats: Array<{
    companySize: string;
    count: number;
  }>;
  recent: {
    assessments: Array<{
      id: string;
      createdAt: string;
      industry: string;
      companySize: string;
      calculatedLevel: string;
      score: number;
      email?: string;
    }>;
    leads: Array<{
      id: string;
      email: string;
      createdAt: string;
      source: string;
      status: string;
      industry?: string;
      companySize?: string;
      calculatedLevel?: string;
    }>;
  };
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Lade Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                AI Maturity Checker - Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Willkommen, {user?.username}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            {/* Summary Stats */}
            <div className="mb-8">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Übersicht</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-semibold">A</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Gesamt Assessments
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats?.summary.totalAssessments}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-semibold">L</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            E-Mail Leads
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats?.summary.totalLeads}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-semibold">%</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Conversion Rate
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats?.summary.conversionRate}%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              
              {/* Industry Stats */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Nach Branchen
                  </h3>
                  <div className="space-y-3">
                    {stats?.industryStats.slice(0, 8).map((item, index) => (
                      <div key={item.industryId} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{item.industry}</span>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Level Stats */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Nach AI-Reifegrad
                  </h3>
                  <div className="space-y-3">
                    {stats?.levelStats.map((item, index) => (
                      <div key={item.level} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{item.level}</span>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Size Stats */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Nach Unternehmensgröße
                  </h3>
                  <div className="space-y-3">
                    {stats?.companySizeStats.map((item, index) => (
                      <div key={item.companySize} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{item.companySize}</span>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Assessments */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Neueste Assessments
                  </h3>
                  <div className="space-y-3">
                    {stats?.recent.assessments.slice(0, 5).map((assessment) => (
                      <div key={assessment.id} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{assessment.industry}</span>
                          <span className="text-gray-500">{formatDate(assessment.createdAt)}</span>
                        </div>
                        <div className="text-gray-600">
                          Level: {assessment.calculatedLevel} • Score: {assessment.score}/75
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Neueste E-Mail Leads
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            E-Mail
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Branche
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Level
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Datum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats?.recent.leads.slice(0, 10).map((lead) => (
                          <tr key={lead.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {lead.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {lead.industry || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {lead.calculatedLevel || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(lead.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                lead.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
