
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Home, FileText, TrendingUp, Users, Calendar, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { format, startOfMonth, endOfMonth, addDays, isBefore, isAfter } from 'date-fns';

interface AnalyticsData {
  totalRentCollected: number;
  totalRentDue: number;
  occupancyRate: number;
  totalUnits: number;
  occupiedUnits: number;
  newApplications: number;
  upcomingRenewals: number;
  maintenanceRequests: {
    urgent: number;
    routine: number;
  };
  revenueThisMonth: number;
}

interface UpcomingRenewal {
  id: string;
  tenant_name: string;
  property_title: string;
  lease_end_date: string;
  monthly_rent: number;
}

const AnalyticsPanel = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRentCollected: 0,
    totalRentDue: 0,
    occupancyRate: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    newApplications: 0,
    upcomingRenewals: 0,
    maintenanceRequests: { urgent: 0, routine: 0 },
    revenueThisMonth: 0
  });
  const [upcomingRenewals, setUpcomingRenewals] = useState<UpcomingRenewal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Fetch properties
      const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id);

      // Fetch active leases
      const { data: leases } = await supabase
        .from('leases')
        .select('*, properties(title)')
        .eq('landlord_id', user.id)
        .eq('status', 'active');

      // Fetch applications
      const { data: applications } = await supabase
        .from('applications')
        .select('*')
        .in('property_id', properties?.map(p => p.id) || [])
        .eq('status', 'pending');

      // Calculate analytics
      const totalUnits = properties?.reduce((sum, p) => sum + (p.unit_count || 1), 0) || 0;
      const occupiedUnits = leases?.length || 0;
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

      // Calculate rent due this month
      const currentMonth = new Date();
      const totalRentDue = leases?.reduce((sum, lease) => sum + lease.monthly_rent, 0) || 0;

      // Find upcoming renewals (next 60 days)
      const sixtyDaysFromNow = addDays(new Date(), 60);
      const renewals = leases?.filter(lease => {
        const endDate = new Date(lease.lease_end_date);
        return isAfter(endDate, new Date()) && isBefore(endDate, sixtyDaysFromNow);
      }) || [];

      const renewalsData = renewals.map(lease => ({
        id: lease.id,
        tenant_name: lease.tenant_name,
        property_title: lease.properties?.title || 'Unknown Property',
        lease_end_date: lease.lease_end_date,
        monthly_rent: lease.monthly_rent
      }));

      setAnalytics({
        totalRentCollected: totalRentDue * 0.95, // Simulate 95% collection rate
        totalRentDue,
        occupancyRate,
        totalUnits,
        occupiedUnits,
        newApplications: applications?.length || 0,
        upcomingRenewals: renewals.length,
        maintenanceRequests: { urgent: 2, routine: 5 }, // Mock data
        revenueThisMonth: totalRentDue
      });

      setUpcomingRenewals(renewalsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-700 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Rent Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${analytics.totalRentCollected.toLocaleString()}</div>
            <p className="text-xs text-green-400 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Rent Due</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${analytics.totalRentDue.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Occupancy Rate</CardTitle>
            <Home className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-slate-500 mt-1">{analytics.occupiedUnits} of {analytics.totalUnits} units</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">New Applications</CardTitle>
            <FileText className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.newApplications}</div>
            <p className="text-xs text-slate-500 mt-1">Pending review</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <AlertTriangle size={20} className="text-yellow-400" />
              Upcoming Lease Renewals
            </CardTitle>
            <CardDescription className="text-slate-400">
              Leases expiring in the next 60 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingRenewals.length === 0 ? (
              <p className="text-slate-400 text-sm">No upcoming renewals</p>
            ) : (
              upcomingRenewals.map((renewal) => (
                <div key={renewal.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{renewal.tenant_name}</p>
                    <p className="text-xs text-slate-400">{renewal.property_title}</p>
                    <p className="text-xs text-slate-500">
                      Expires: {format(new Date(renewal.lease_end_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">${renewal.monthly_rent}/mo</p>
                    <Badge variant="outline" className="text-xs border-yellow-400/50 text-yellow-400">
                      Expiring Soon
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-green-400" />
              Revenue Overview
            </CardTitle>
            <CardDescription className="text-slate-400">
              Monthly financial summary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Gross Revenue</span>
                <span className="text-white font-semibold">${analytics.revenueThisMonth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Collection Rate</span>
                <span className="text-green-400 font-semibold">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Net Income</span>
                <span className="text-white font-semibold">${(analytics.revenueThisMonth * 0.8).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700/50">
              <Button variant="outline" className="w-full bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white">
                View Detailed Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
