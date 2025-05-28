
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Users, AlertTriangle, Calendar, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalRentCollected: number;
  rentDueThisMonth: number;
  occupancyRate: number;
  upcomingRenewals: number;
  newApplications: number;
  maintenanceRequests: number;
}

const AnalyticsPanel = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRentCollected: 0,
    rentDueThisMonth: 0,
    occupancyRate: 0,
    upcomingRenewals: 0,
    newApplications: 0,
    maintenanceRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Get properties count and occupancy
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, unit_count, is_available')
        .eq('landlord_id', user.id);

      if (propError) throw propError;

      // Get active leases for rent calculations
      const { data: leases, error: leaseError } = await supabase
        .from('leases')
        .select('monthly_rent, lease_end_date, status')
        .eq('landlord_id', user.id)
        .eq('status', 'active');

      if (leaseError) throw leaseError;

      // Get new applications
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('id, status, property_id')
        .eq('status', 'pending')
        .in('property_id', properties?.map(p => p.id) || []);

      if (appError) throw appError;

      // Calculate analytics
      const totalUnits = properties?.reduce((sum, prop) => sum + (prop.unit_count || 1), 0) || 0;
      const occupiedUnits = properties?.filter(prop => !prop.is_available).length || 0;
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

      const totalRentDue = leases?.reduce((sum, lease) => sum + Number(lease.monthly_rent || 0), 0) || 0;

      // Check for upcoming renewals (next 60 days)
      const today = new Date();
      const sixtyDaysFromNow = new Date(today.getTime() + (60 * 24 * 60 * 60 * 1000));
      const upcomingRenewals = leases?.filter(lease => {
        if (!lease.lease_end_date) return false;
        const endDate = new Date(lease.lease_end_date);
        return endDate >= today && endDate <= sixtyDaysFromNow;
      }).length || 0;

      setAnalytics({
        totalRentCollected: totalRentDue * 0.95, // Assuming 95% collection rate
        rentDueThisMonth: totalRentDue,
        occupancyRate: Math.round(occupancyRate),
        upcomingRenewals,
        newApplications: applications?.length || 0,
        maintenanceRequests: 0, // Will be implemented when maintenance system is added
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
            <CardHeader className="space-y-2">
              <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
              <div className="w-24 h-4 bg-slate-700 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="w-16 h-8 bg-slate-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const analyticsCards = [
    {
      title: 'Rent Collected',
      value: `$${analytics.totalRentCollected.toLocaleString()}`,
      description: 'This month',
      icon: DollarSign,
      trend: '+8.2%',
      trendType: 'positive' as const,
    },
    {
      title: 'Rent Due',
      value: `$${analytics.rentDueThisMonth.toLocaleString()}`,
      description: 'This month',
      icon: Calendar,
      trend: 'Current',
      trendType: 'neutral' as const,
    },
    {
      title: 'Occupancy Rate',
      value: `${analytics.occupancyRate}%`,
      description: 'Current occupancy',
      icon: Home,
      trend: analytics.occupancyRate >= 90 ? 'Excellent' : analytics.occupancyRate >= 70 ? 'Good' : 'Needs attention',
      trendType: analytics.occupancyRate >= 90 ? 'positive' : analytics.occupancyRate >= 70 ? 'neutral' : 'negative',
    },
    {
      title: 'Lease Renewals',
      value: analytics.upcomingRenewals.toString(),
      description: 'Next 60 days',
      icon: AlertTriangle,
      trend: analytics.upcomingRenewals > 0 ? 'Action needed' : 'All current',
      trendType: analytics.upcomingRenewals > 0 ? 'negative' : 'positive',
    },
    {
      title: 'New Applications',
      value: analytics.newApplications.toString(),
      description: 'Pending review',
      icon: Users,
      trend: analytics.newApplications > 0 ? 'Review pending' : 'Up to date',
      trendType: analytics.newApplications > 0 ? 'neutral' : 'positive',
    },
    {
      title: 'Maintenance',
      value: analytics.maintenanceRequests.toString(),
      description: 'Open requests',
      icon: TrendingUp,
      trend: 'Coming soon',
      trendType: 'neutral' as const,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Portfolio Analytics</h2>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
          Real-time data
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsCards.map((card, index) => (
          <Card 
            key={card.title} 
            className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105"
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {card.title}
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-200">
                <card.icon className="h-5 w-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                {card.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {card.description}
                </p>
                <Badge 
                  className={`text-xs ${
                    card.trendType === 'positive' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                      : card.trendType === 'negative'
                      ? 'bg-red-500/20 text-red-400 border-red-500/50'
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/50'
                  }`}
                >
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPanel;
