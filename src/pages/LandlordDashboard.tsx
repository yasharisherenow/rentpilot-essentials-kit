import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  FileText, 
  User, 
  PlusCircle, 
  Bell, 
  Settings, 
  CreditCard, 
  FolderOpen,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Property } from '@/types/property';
import NotificationsDropdown from '@/components/dashboard/NotificationsDropdown';
import AnalyticsPanel from '@/components/dashboard/AnalyticsPanel';
import AddPropertyForm from '@/components/dashboard/AddPropertyForm';
import CreateLeaseForm from '@/components/dashboard/CreateLeaseForm';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import NotificationPreferences from '@/components/dashboard/NotificationPreferences';
import BillingManagement from '@/components/dashboard/BillingManagement';
import ViewPropertyModal from '@/components/dashboard/ViewPropertyModal';
import DeletePropertyModal from '@/components/dashboard/DeletePropertyModal';
import EditPropertyForm from '@/components/EditPropertyForm';

type Application = {
  id: string;
  applicant: string;
  property: string;
  property_id: string;
  date: string;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
  email: string;
  phone: string;
};

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, profile, signOut } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [leases, setLeases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showCreateLease, setShowCreateLease] = useState(false);
  const [viewProperty, setViewProperty] = useState<Property | null>(null);
  const [deleteProperty, setDeleteProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!user || !profile) return;
    loadLandlordData();
  }, [user, profile]);

  const loadLandlordData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchProperties(),
        fetchApplicationsForLandlord(),
        fetchLeaseDocuments(),
      ]);
    } catch (error) {
      console.error("Error loading landlord data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProperties = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id);

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
        is_available: prop.is_available,
        unit_count: prop.unit_count,
        created_at: prop.created_at,
        landlord_id: prop.landlord_id,
      })) as Property[];

      setProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchApplicationsForLandlord = async () => {
    if (!user) return;

    try {
      const { data: propertyData, error: propError } = await supabase
        .from('properties')
        .select('id')
        .eq('landlord_id', user.id);

      if (propError) throw propError;

      if (!propertyData || propertyData.length === 0) {
        setApplications([]);
        return;
      }

      const propertyIds = propertyData.map(p => p.id);

      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          property_id,
          first_name,
          last_name,
          email,
          phone,
          created_at,
          status,
          properties:property_id (title, address)
        `)
        .in('property_id', propertyIds);

      if (error) throw error;

      const formattedApplications = data.map((app) => ({
        id: app.id,
        applicant: `${app.first_name} ${app.last_name}`,
        property: app.properties?.title || app.properties?.address || 'Unknown property',
        property_id: app.property_id,
        date: app.created_at,
        status: app.status === 'pending' ? 'new' as const : app.status as 'new' | 'reviewed' | 'approved' | 'rejected',
        email: app.email,
        phone: app.phone,
      }));

      setApplications(formattedApplications);
    } catch (error) {
      console.error("Error fetching applications for landlord:", error);
    }
  };

  const fetchLeaseDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leases')
        .select(`
          id,
          property_id,
          created_at,
          tenant_name,
          status,
          monthly_rent,
          lease_start_date,
          lease_end_date,
          properties:property_id (title, address)
        `)
        .eq('landlord_id', user.id);

      if (error) throw error;

      setLeases(data || []);
    } catch (error) {
      console.error("Error fetching lease documents:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handlePropertyAdded = () => {
    fetchProperties();
  };

  const portfolioStats = {
    totalRent: properties.reduce((total, p) => total + p.monthly_rent, 0),
    totalProperties: properties.length,
    occupiedUnits: properties.filter(p => !p.is_available).length,
    vacantUnits: properties.filter(p => p.is_available).length,
    pendingApplications: applications.filter(a => a.status === 'new').length,
    activeLeases: leases.length,
    expiringLeases: 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,213,0,0.02),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="animate-fade-up">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Welcome back, {profile?.first_name}
            </h1>
            <p className="text-slate-400 text-lg">
              Manage your rental empire with precision
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <NotificationsDropdown />
            <Button variant="outline" size="sm" onClick={() => signOut()} className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-red-400/50 hover:text-red-400 transition-all duration-200">
              <User size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 mb-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-1 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300 font-medium transition-all duration-200 rounded-xl">
              Overview
            </TabsTrigger>
            <TabsTrigger value="properties" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300 font-medium transition-all duration-200 rounded-xl">
              Properties
            </TabsTrigger>
            <TabsTrigger value="tenants" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300 font-medium transition-all duration-200 rounded-xl">
              Tenants
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300 font-medium transition-all duration-200 rounded-xl">
              Applications
            </TabsTrigger>
            <TabsTrigger value="leases" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300 font-medium transition-all duration-200 rounded-xl">
              Leases
            </TabsTrigger>
            <TabsTrigger value="finances" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300 font-medium transition-all duration-200 rounded-xl">
              Finances
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300 font-medium transition-all duration-200 rounded-xl">
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <AnalyticsPanel />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <Card 
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer hover:scale-105"
                onClick={() => setShowAddProperty(true)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-200">
                    <Home className="text-yellow-400 group-hover:scale-110 transition-transform duration-200" size={32} />
                  </div>
                  <CardTitle className="text-lg text-white">Add Property</CardTitle>
                  <CardDescription className="text-slate-400">Expand your portfolio</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold transition-all duration-200 hover:scale-105">
                    <Plus size={16} className="mr-2" />
                    Add Property
                  </Button>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer hover:scale-105"
                onClick={() => setShowCreateLease(true)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-200">
                    <FileText className="text-yellow-400 group-hover:scale-110 transition-transform duration-200" size={32} />
                  </div>
                  <CardTitle className="text-lg text-white">Create Lease</CardTitle>
                  <CardDescription className="text-slate-400">Generate legal documents</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold transition-all duration-200 hover:scale-105">
                    <Plus size={16} className="mr-2" />
                    Create Lease
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-200">
                    <TrendingUp className="text-yellow-400 group-hover:scale-110 transition-transform duration-200" size={32} />
                  </div>
                  <CardTitle className="text-lg text-white">View Analytics</CardTitle>
                  <CardDescription className="text-slate-400">Track your performance</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold transition-all duration-200 hover:scale-105">
                    <TrendingUp size={16} className="mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center animate-fade-up">
              <h2 className="text-2xl font-bold text-white">Your Properties</h2>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
                  <Search size={16} className="mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
                <Button 
                  onClick={() => setShowAddProperty(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
                >
                  <Plus size={16} className="mr-2" />
                  Add Property
                </Button>
              </div>
            </div>
            
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                {properties.map((property, index) => (
                  <Card key={property.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-white mb-1">{property.title}</CardTitle>
                          <CardDescription className="text-slate-400">{property.address}</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                      <Badge className={`w-fit ${property.is_available ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                        {property.is_available ? 'Available' : 'Occupied'}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Rent</p>
                          <p className="text-white font-semibold">${property.monthly_rent}/mo</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Beds/Baths</p>
                          <p className="text-white font-semibold">{property.bedrooms}br / {property.bathrooms}ba</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
                          onClick={() => setViewProperty(property)}
                        >
                          <Eye size={14} className="mr-2" />
                          View
                        </Button>
                        <EditPropertyForm 
                          property={property} 
                          onPropertyUpdated={fetchProperties}
                        />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:text-red-300"
                          onClick={() => setDeleteProperty(property)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl animate-fade-up">
                <CardContent>
                  <Home size={64} className="mx-auto text-slate-600 mb-6" />
                  <h3 className="text-xl font-semibold mb-2 text-white">No Properties Yet</h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">Start building your rental empire by adding your first property</p>
                  <Button 
                    onClick={() => setShowAddProperty(true)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Your First Property
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="tenants" className="space-y-6">
            <div className="flex justify-between items-center animate-fade-up">
              <h2 className="text-2xl font-bold text-white">Tenant Management</h2>
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold">
                <Plus size={16} className="mr-2" />
                Add Tenant
              </Button>
            </div>
            
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8 text-center">
                <Users size={64} className="mx-auto text-slate-600 mb-6" />
                <h3 className="text-xl font-semibold mb-2 text-white">Tenant Management Coming Soon</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">Full tenant profiles, communication logs, and payment tracking will be available soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center animate-fade-up">
              <h2 className="text-2xl font-bold text-white">Rental Applications</h2>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold">
                  Export
                </Button>
              </div>
            </div>
            
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8 text-center">
                <FileText size={64} className="mx-auto text-slate-600 mb-6" />
                <h3 className="text-xl font-semibold mb-2 text-white">No Applications Yet</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">Applications will appear here when tenants apply for your properties</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leases" className="space-y-6">
            <div className="flex justify-between items-center animate-fade-up">
              <h2 className="text-2xl font-bold text-white">Lease Management</h2>
              <Button asChild className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold">
                <Link to="/lease">
                  <Plus size={16} className="mr-2" />
                  Create Lease
                </Link>
              </Button>
            </div>
            
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8 text-center">
                <FileText size={64} className="mx-auto text-slate-600 mb-6" />
                <h3 className="text-xl font-semibold mb-2 text-white">No Leases Yet</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">Create your first lease agreement to get started</p>
                <Button asChild className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold">
                  <Link to="/lease">
                    <Plus size={16} className="mr-2" />
                    Create First Lease
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finances" className="space-y-6">
            <div className="flex justify-between items-center animate-fade-up">
              <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50">
                  <Download size={16} className="mr-2" />
                  Export Report
                </Button>
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold">
                  <CreditCard size={16} className="mr-2" />
                  Setup Payments
                </Button>
              </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">${portfolioStats.totalRent.toLocaleString()}</div>
                  <p className="text-sm text-green-400 mt-2">+8.2% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">Outstanding Rent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">$0</div>
                  <p className="text-sm text-green-400 mt-2">All payments current</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">Net Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">${(portfolioStats.totalRent * 0.85).toLocaleString()}</div>
                  <p className="text-sm text-slate-400 mt-2">After expenses</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8 text-center">
                <TrendingUp size={64} className="mx-auto text-slate-600 mb-6" />
                <h3 className="text-xl font-semibold mb-2 text-white">Advanced Analytics Coming Soon</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">Detailed financial reports, expense tracking, and ROI analysis will be available soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center animate-fade-up">
              <h2 className="text-2xl font-bold text-white">Settings & Preferences</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {/* Profile Settings */}
              <div>
                <ProfileSettings />
              </div>

              {/* Notification Preferences */}
              <div>
                <NotificationPreferences />
              </div>

              {/* Billing Management */}
              <div>
                <BillingManagement />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {showAddProperty && (
          <AddPropertyForm 
            onPropertyAdded={fetchProperties}
            onClose={() => setShowAddProperty(false)} 
          />
        )}

        {showCreateLease && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <CreateLeaseForm 
              onLeaseCreated={() => {
                fetchLeaseDocuments();
                setShowCreateLease(false);
              }} 
              onClose={() => setShowCreateLease(false)} 
            />
          </div>
        )}

        {viewProperty && (
          <ViewPropertyModal 
            property={viewProperty}
            onClose={() => setViewProperty(null)}
          />
        )}

        {deleteProperty && (
          <DeletePropertyModal 
            property={deleteProperty}
            onClose={() => setDeleteProperty(null)}
            onPropertyDeleted={fetchProperties}
          />
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;
