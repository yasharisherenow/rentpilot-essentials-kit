
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  FileText, 
  MessageCircle, 
  Calendar, 
  Phone, 
  Settings, 
  Download,
  DollarSign,
  MapPin,
  Clock,
  User,
  Bell,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import LeaseMessaging from '@/components/messaging/LeaseMessaging';
import TenantDocuments from '@/components/tenant/TenantDocuments';
import TenantSettings from '@/components/tenant/TenantSettings';
import { useMessages } from '@/hooks/useMessages';

type Lease = {
  id: string;
  property_id: string;
  tenant_name: string;
  monthly_rent: number;
  security_deposit: number;
  pet_deposit: number;
  lease_start_date: string;
  lease_end_date: string;
  status: string;
  utilities_included: string[];
  special_terms: string;
  snow_grass_responsibility: string;
  property?: {
    title: string;
    address: string;
    city: string;
    province: string;
  };
  landlord?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
};

const TenantDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [lease, setLease] = useState<Lease | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { unreadCount } = useMessages(lease?.id);

  useEffect(() => {
    if (!user || !profile) return;
    fetchTenantLease();
  }, [user, profile]);

  const fetchTenantLease = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leases')
        .select(`
          *,
          property:properties (
            title,
            address,
            city,
            province
          ),
          landlord:profiles!leases_landlord_id_fkey (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('tenant_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setLease(data);
    } catch (error) {
      console.error('Error fetching lease:', error);
      toast({
        title: "Error",
        description: "Failed to load lease information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getDaysUntilRentDue = () => {
    if (!lease) return null;
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diffTime = nextMonth.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Home size={64} className="mx-auto mb-4 text-slate-600" />
            <h1 className="text-2xl font-bold mb-2">No Active Lease Found</h1>
            <p className="text-slate-400 mb-6">
              You don't have an active lease in the system. Please contact your landlord.
            </p>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              My Rental Dashboard
            </h1>
            <p className="text-slate-300">
              Welcome back, {profile?.first_name} {profile?.last_name}
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} className="mr-1" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              onClick={handleSignOut}
            >
              <LogOut size={16} className="mr-1" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <Home size={16} className="mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="lease" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <FileText size={16} className="mr-2" />
              My Lease
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black relative">
              <MessageCircle size={16} className="mr-2" />
              Messages
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[1.25rem] h-5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <FileText size={16} className="mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <Settings size={16} className="mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Monthly Rent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">${lease.monthly_rent}</div>
                  <p className="text-xs text-slate-500">Due on the 1st</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Days Until Rent Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{getDaysUntilRentDue()}</div>
                  <p className="text-xs text-slate-500">Next payment</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Lease Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    {lease.status}
                  </Badge>
                  <p className="text-xs text-slate-500 mt-1">Current status</p>
                </CardContent>
              </Card>
            </div>

            {/* Property Info */}
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Home size={20} className="text-yellow-400" />
                  My Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white">{lease.property?.title}</h3>
                  <p className="text-slate-400 flex items-center gap-2">
                    <MapPin size={16} />
                    {lease.property?.address}, {lease.property?.city}, {lease.property?.province}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">Lease Term:</span>
                    <p className="text-white">
                      {formatDate(lease.lease_start_date)} - {formatDate(lease.lease_end_date)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Security Deposit:</span>
                    <p className="text-white">${lease.security_deposit}</p>
                  </div>
                </div>

                {lease.utilities_included && lease.utilities_included.length > 0 && (
                  <div>
                    <span className="text-slate-400">Utilities Included:</span>
                    <p className="text-white">{lease.utilities_included.join(', ')}</p>
                  </div>
                )}

                {lease.snow_grass_responsibility && (
                  <div>
                    <span className="text-slate-400">Responsibilities:</span>
                    <p className="text-white">{lease.snow_grass_responsibility}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Landlord Contact */}
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Phone size={20} className="text-yellow-400" />
                  Landlord Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-slate-400">Name:</span>
                  <p className="text-white">
                    {lease.landlord?.first_name} {lease.landlord?.last_name}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>
                  <p className="text-white">{lease.landlord?.email}</p>
                </div>
                {lease.landlord?.phone && (
                  <div>
                    <span className="text-slate-400">Phone:</span>
                    <p className="text-white">{lease.landlord?.phone}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setActiveTab('messages')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Send Message
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Lease Details Tab */}
          <TabsContent value="lease" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText size={20} className="text-yellow-400" />
                  Lease Agreement Details
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Complete information about your rental agreement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400">Property Address</label>
                      <p className="text-white">
                        {lease.property?.title}<br />
                        {lease.property?.address}<br />
                        {lease.property?.city}, {lease.property?.province}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400">Lease Term</label>
                      <p className="text-white">
                        {formatDate(lease.lease_start_date)} to {formatDate(lease.lease_end_date)}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-400">Monthly Rent</label>
                      <p className="text-white text-lg font-semibold">${lease.monthly_rent}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-400">Security Deposit</label>
                      <p className="text-white">${lease.security_deposit}</p>
                    </div>

                    {lease.pet_deposit > 0 && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Pet Deposit</label>
                        <p className="text-white">${lease.pet_deposit}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-slate-400">Status</label>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        {lease.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {lease.utilities_included && lease.utilities_included.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-slate-400">Utilities Included</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {lease.utilities_included.map((utility, index) => (
                        <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                          {utility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {lease.snow_grass_responsibility && (
                  <div>
                    <label className="text-sm font-medium text-slate-400">Maintenance Responsibilities</label>
                    <p className="text-white">{lease.snow_grass_responsibility}</p>
                  </div>
                )}

                {lease.special_terms && (
                  <div>
                    <label className="text-sm font-medium text-slate-400">Special Terms</label>
                    <p className="text-white">{lease.special_terms}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
                  <Download size={16} className="mr-2" />
                  Download Lease Document
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <LeaseMessaging lease={lease} isLandlord={false} />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <TenantDocuments />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <TenantSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TenantDashboard;
