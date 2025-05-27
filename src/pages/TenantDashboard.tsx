import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Home, FileText, User, Bell, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import AccountManagement from '@/components/AccountManagement';

type Property = {
  id: string;
  title: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  monthly_rent: number;
  bedrooms?: number;
  bathrooms?: number;
};

type Application = {
  id: string;
  property: string;
  property_id: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  email: string;
  phone: string;
};

type Lease = {
  id: string;
  property_title: string;
  tenant_name: string;
  monthly_rent: number;
  lease_start_date: string;
  lease_end_date: string;
  status: string;
};

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) return;

    const loadTenantData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchAvailableProperties(),
          fetchTenantApplications(),
          fetchTenantLeases(),
        ]);
      } catch (error) {
        console.error("Error loading tenant data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTenantData();
  }, [user, profile]);

  const fetchAvailableProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_available', true)
        .limit(5);

      if (error) throw error;

      const formattedProperties = data.map((prop) => ({
        id: prop.id,
        title: prop.title,
        address: prop.address,
        city: prop.city,
        province: prop.province,
        postal_code: prop.postal_code,
        monthly_rent: prop.monthly_rent,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
      })) as Property[];

      setAvailableProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching available properties:", error);
    }
  };

  const fetchTenantApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          property_id,
          created_at,
          status,
          email,
          phone,
          properties:property_id (title, address)
        `)
        .eq('tenant_id', user.id);

      if (error) throw error;

      const formattedApplications = data.map((app) => ({
        id: app.id,
        property: app.properties?.title || app.properties?.address || 'Unknown property',
        property_id: app.property_id,
        date: app.created_at,
        status: app.status as 'pending' | 'approved' | 'rejected',
        email: app.email,
        phone: app.phone,
      }));

      setApplications(formattedApplications);
    } catch (error) {
      console.error("Error fetching tenant applications:", error);
    }
  };

  const fetchTenantLeases = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leases')
        .select(`
          id,
          property_id,
          tenant_name,
          monthly_rent,
          lease_start_date,
          lease_end_date,
          status,
          properties:property_id (title, address)
        `)
        .eq('tenant_id', user.id);

      if (error) throw error;

      const formattedLeases = data.map((lease) => ({
        id: lease.id,
        property_title: lease.properties?.title || lease.properties?.address || 'Unknown property',
        tenant_name: lease.tenant_name,
        monthly_rent: lease.monthly_rent,
        lease_start_date: lease.lease_start_date,
        lease_end_date: lease.lease_end_date,
        status: lease.status,
      }));

      setLeases(formattedLeases);
    } catch (error) {
      console.error("Error fetching tenant leases:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,213,0,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-up">
          <div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Tenant Dashboard
            </h1>
            <p className="text-slate-300 text-lg">
              Welcome back, {profile?.first_name} {profile?.last_name}
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="flex items-center gap-1 bg-slate-800/50 border-slate-600 text-white hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-400">
              <Bell size={16} />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 bg-slate-800/50 border-slate-600 text-white hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-400" onClick={() => signOut()}>
              <User size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <TabsList className="grid grid-cols-4 mb-8 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">Overview</TabsTrigger>
            <TabsTrigger value="properties" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">Browse Properties</TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">My Applications</TabsTrigger>
            <TabsTrigger value="leases" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">My Leases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Available Properties</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold text-white">{availableProperties.length}</div>
                  <p className="text-xs text-slate-500">Properties available for rent</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">My Applications</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold text-white">{applications.length}</div>
                  <p className="text-xs text-slate-500">
                    {applications.filter(a => a.status === 'pending').length} pending
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Active Leases</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold text-white">{leases.length}</div>
                  <p className="text-xs text-slate-500">Current lease agreements</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Monthly Rent</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold text-yellow-400">
                    ${leases.reduce((total, l) => total + l.monthly_rent, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-500">Total monthly</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Available Properties</CardTitle>
                  <CardDescription className="text-slate-400">Properties available for rent</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {availableProperties.length > 0 ? (
                    <div className="divide-y divide-slate-700">
                      {availableProperties.slice(0, 3).map(property => (
                        <div key={property.id} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                          <div className="mb-2 md:mb-0">
                            <div className="font-medium text-white">{property.title || property.address}</div>
                            <div className="text-sm text-slate-400">{property.city}, {property.province}</div>
                            {(property.bedrooms || property.bathrooms) && (
                              <div className="text-xs text-slate-500">
                                {property.bedrooms && `${property.bedrooms} bed`}
                                {property.bedrooms && property.bathrooms && ' • '}
                                {property.bathrooms && `${property.bathrooms} bath`}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col md:items-end">
                            <div className="text-sm text-slate-400 mb-2">
                              ${property.monthly_rent} /mo
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => navigate(`/application/${property.id}`)}
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold"
                            >
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <AlertCircle className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                      <h3 className="text-white">No Properties Available</h3>
                      <p className="text-sm text-slate-500">Check back later for new listings.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-slate-700 bg-slate-800/30">
                  <Button 
                    variant="ghost" 
                    className="w-full text-yellow-400 hover:bg-yellow-500/10" 
                    size="sm"
                    onClick={() => setActiveTab('properties')}
                  >
                    Browse All Properties
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Recent Applications</CardTitle>
                  <CardDescription className="text-slate-400">Your latest rental applications</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {applications.length > 0 ? (
                    <div className="divide-y divide-slate-700">
                      {applications.slice(0, 3).map(application => (
                        <div key={application.id} className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-white">{application.property}</div>
                            <Badge className={
                              application.status === 'approved' 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : application.status === 'rejected'
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-amber-500 hover:bg-amber-600'
                            }>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-400">{formatDate(application.date)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <FileText className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                      <h3 className="text-white">No Applications</h3>
                      <p className="text-sm text-slate-500">Start by applying for a property.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-slate-700 bg-slate-800/30">
                  <Button 
                    variant="ghost" 
                    className="w-full text-yellow-400 hover:bg-yellow-500/10" 
                    size="sm"
                    onClick={() => setActiveTab('applications')}
                  >
                    View All Applications
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-lg text-white">Find Properties</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <Home className="mx-auto text-yellow-400" size={32} />
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => setActiveTab('properties')}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold"
                  >
                    Browse Listings
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-lg text-white">View Applications</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <FileText className="mx-auto text-yellow-400" size={32} />
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => setActiveTab('applications')}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold"
                  >
                    My Applications
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-lg text-white">My Account</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <User className="mx-auto text-yellow-400" size={32} />
                </CardContent>
                <CardFooter>
                  <AccountManagement />
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Available Properties</h2>
            </div>
            
            {availableProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableProperties.map(property => (
                  <Card key={property.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105">
                    <CardHeader>
                      <CardTitle className="text-white">{property.title || property.address}</CardTitle>
                      <CardDescription className="text-slate-400">{property.city}, {property.province}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(property.bedrooms || property.bathrooms) && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Details:</span>
                            <span className="text-slate-300">
                              {property.bedrooms && `${property.bedrooms} bed`}
                              {property.bedrooms && property.bathrooms && ' • '}
                              {property.bathrooms && `${property.bathrooms} bath`}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-400">Monthly Rent:</span>
                          <span className="font-medium text-yellow-400">${property.monthly_rent} CAD</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-slate-700 pt-4">
                      <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-600 text-white hover:bg-yellow-500/10 hover:border-yellow-500/50">View Details</Button>
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/application/${property.id}`)}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold"
                      >
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700/50">
                <div className="text-slate-600 mb-2">
                  <Home size={40} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-1 text-white">No Properties Available</h3>
                <p className="text-slate-500 mb-4">Check back later for new listings.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">My Applications</h2>
            </div>
            
            {applications.length > 0 ? (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700/50 shadow-lg">
                <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 border-b border-slate-700 text-sm font-medium text-slate-400">
                  <div>Property</div>
                  <div>Date Applied</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y divide-slate-700">
                  {applications.map(application => (
                    <div key={application.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 hover:bg-slate-700/30">
                      <div>
                        <div className="md:hidden text-sm font-medium text-slate-500 mb-1">Property</div>
                        <div className="font-medium text-white">{application.property}</div>
                      </div>
                      <div>
                        <div className="md:hidden text-sm font-medium text-slate-500 mb-1">Date Applied</div>
                        <div className="text-slate-300">{formatDate(application.date)}</div>
                      </div>
                      <div>
                        <div className="md:hidden text-sm font-medium text-slate-500 mb-1">Status</div>
                        <Badge className={
                          application.status === 'approved' 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : application.status === 'rejected'
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-amber-500 hover:bg-amber-600'
                        }>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <div className="md:hidden text-sm font-medium text-slate-500 mb-1">Actions</div>
                        <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-600 text-white hover:bg-yellow-500/10 hover:border-yellow-500/50">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700/50">
                <div className="text-slate-600 mb-2">
                  <FileText size={40} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-1 text-white">No Applications Found</h3>
                <p className="text-slate-500 mb-4">Start by applying for a property</p>
                <Button 
                  onClick={() => setActiveTab('properties')}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold"
                >
                  Browse Properties
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="leases" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">My Leases</h2>
            </div>
            
            {leases.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {leases.map(lease => (
                  <Card key={lease.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white">{lease.property_title}</CardTitle>
                      <CardDescription className="text-slate-400">Lease Agreement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-slate-400">Monthly Rent</div>
                          <div className="font-medium text-yellow-400">${lease.monthly_rent}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Lease Start</div>
                          <div className="font-medium text-slate-300">{formatDate(lease.lease_start_date)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Lease End</div>
                          <div className="font-medium text-slate-300">{formatDate(lease.lease_end_date)}</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-slate-700 pt-4">
                      <Badge variant="outline" className="capitalize border-slate-600 text-slate-300">
                        {lease.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-600 text-white hover:bg-yellow-500/10 hover:border-yellow-500/50">
                        Download Lease
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700/50">
                <div className="text-slate-600 mb-2">
                  <FileText size={40} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-1 text-white">No Leases Found</h3>
                <p className="text-slate-500 mb-4">You don't have any active leases.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TenantDashboard;
