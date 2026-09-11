import { useState, useEffect } from 'react';
import { getDashboardStats } from '../lib/api';

interface Stats {
  totalArticles: number;
  draftArticles: number;
  publishedArticles: number;
  totalCategories: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-300 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Articles"
          value={stats?.totalArticles || 0}
          icon="📄"
          color="bg-blue-50"
          borderColor="border-blue-200"
        />
        <StatCard
          title="Published"
          value={stats?.publishedArticles || 0}
          icon="✓"
          color="bg-green-50"
          borderColor="border-green-200"
        />
        <StatCard
          title="Draft"
          value={stats?.draftArticles || 0}
          icon="📝"
          color="bg-yellow-50"
          borderColor="border-yellow-200"
        />
        <StatCard
          title="Categories"
          value={stats?.totalCategories || 0}
          icon="📂"
          color="bg-purple-50"
          borderColor="border-purple-200"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            action="Article Published"
            description="Bengaluru Tech Hub Attracts Global Investment"
            time="2 hours ago"
          />
          <ActivityItem
            action="Article Created"
            description="Mangaluru Port Handles Record Cargo Volume"
            time="5 hours ago"
          />
          <ActivityItem
            action="Category Created"
            description="New category: Technology"
            time="1 day ago"
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  borderColor: string;
}

function StatCard({ title, value, icon, color, borderColor }: StatCardProps) {
  return (
    <div className={`${color} border ${borderColor} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  action: string;
  description: string;
  time: string;
}

function ActivityItem({ action, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
      <div>
        <p className="font-medium text-gray-900">{action}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{time}</span>
    </div>
  );
}
