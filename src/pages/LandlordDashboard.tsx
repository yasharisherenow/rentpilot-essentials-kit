import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Home, FileText, User, PlusCircle, AlertCircle, Bell, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import AddPropertyForm from '@/components/AddPropertyForm';
import CreateLeaseForm from '@/components/CreateLeaseForm';
import EditPropertyForm from '@/components/EditPropertyForm';
import AccountManagement from '@/components/AccountManagement';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import PropertyCard from '@/components/dashboard/PropertyCard';
import DashboardNotifications from '@/components/dashboard/DashboardNotifications';
import { Property } from '@/types/property';

type Application = {
  id: string;
  applicant: string;
  property: string;
  property_id: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  email: string;
  phone: string;
};

type Document = {
  id: string;
  name: string;
  date: string;
  type: string;
  property_title?: string;
  tenant_name?: string;
};

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, profile, signOut } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

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
      generateNotifications();
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
        status: app.status as 'pending' | 'approved' | 'rejected',
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

      const formattedDocuments = data.map((lease) => ({
        id: lease.id,
        name: `Lease Agreement - ${lease.properties?.title || lease.properties?.address}`,
        date: lease.created_at,
        type: 'lease',
        property_title: lease.properties?.title || lease.properties?.address,
        tenant_name: lease.tenant_name,
      }));

      setDocuments(formattedDocuments);
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

  const generateNotifications = () => {
    const newNotifications = [];
    
    // New applications notification
    const pendingApps = applications.filter(app => app.status === 'pending');
    if (pendingApps.length > 0) {
      newNotifications.push({
        id: 'pending-apps',
        type: 'application',
        title: `${pendingApps.length} New Application${pendingApps.length > 1 ? 's' : ''}`,
        description: 'Review and respond to tenant applications',
        priority: 'medium',
        actionLabel: 'View Applications',
        onAction: () => setActiveTab('applications')
      });
    }

    // Vacant units notification
    const vacantUnits = properties.filter(p => p.is_available);
    if (vacantUnits.length > 0) {
      newNotifications.push({
        id: 'vacant-units',
        type: 'vacant_unit',
        title: `${vacantUnits.length} Vacant Unit${vacantUnits.length > 1 ? 's' : ''}`,
        description: 'Consider marketing these properties to find tenants',
        priority: 'high',
        actionLabel: 'View Properties',
        onAction: () => setActiveTab('properties')
      });
    }

    setNotifications(newNotifications);
  };

  const handlePropertyAdded = () => {
    fetchProperties();
  };

  const handleLeaseCreated = () => {
    fetchLeaseDocuments();
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const portfolioStats = {
    totalRent: properties.reduce((total, p) => total + p.monthly_rent, 0),
    totalProperties: properties.length,
    occupiedUnits: properties.filter(p => !p.is_available).length,
    vacantUnits: properties.filter(p => p.is_available).length,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    activeLeases: documents.filter(d => d.type === 'lease').length,
    expiringLeases: 0, // TODO: Calculate based on lease end dates
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0C6E5F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Welcome back, {profile?.first_name}
            </h1>
            <p className="text-gray-600">
              Manage your rental portfolio with ease
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bell size={16} />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <User size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <DashboardNotifications 
          notifications={notifications}
          onDismiss={handleDismissNotification}
        />

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8 bg-white shadow-sm rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#0C6E5F] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="properties" className="data-[state=active]:bg-[#0C6E5F] data-[state=active]:text-white">
              Properties
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-[#0C6E5F] data-[state=active]:text-white">
              Applications
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-[#0C6E5F] data-[state=active]:text-white">
              Documents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <PortfolioOverview stats={portfolioStats} />
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md rounded-2xl overflow-hidden">
                <CardHeader className="text-center bg-gradient-to-br from-[#0C6E5F]/5 to-[#FFD500]/10">
                  <Home className="mx-auto text-[#0C6E5F] mb-2 group-hover:scale-110 transition-transform duration-200" size={32} />
                  <CardTitle className="text-lg">Add Property</CardTitle>
                  <CardDescription>Expand your portfolio</CardDescription>
                </CardHeader>
                <CardFooter className="pt-6">
                  <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
                </CardFooter>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md rounded-2xl overflow-hidden">
                <CardHeader className="text-center bg-gradient-to-br from-[#0C6E5F]/5 to-[#FFD500]/10">
                  <FileText className="mx-auto text-[#0C6E5F] mb-2 group-hover:scale-110 transition-transform duration-200" size={32} />
                  <CardTitle className="text-lg">Create Lease</CardTitle>
                  <CardDescription>Generate legal documents</CardDescription>
                </CardHeader>
                <CardFooter className="pt-6">
                  <Button asChild className="w-full bg-[#0C6E5F] hover:bg-[#0C6E5F]/90">
                    <Link to="/lease">Create Lease</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md rounded-2xl overflow-hidden">
                <CardHeader className="text-center bg-gradient-to-br from-[#0C6E5F]/5 to-[#FFD500]/10">
                  <User className="mx-auto text-[#0C6E5F] mb-2 group-hover:scale-110 transition-transform duration-200" size={32} />
                  <CardTitle className="text-lg">Account</CardTitle>
                  <CardDescription>Manage your profile</CardDescription>
                </CardHeader>
                <CardFooter className="pt-6">
                  <AccountManagement />
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
              <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
            </div>
            
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {properties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    applicationCount={applications.filter(app => app.property_id === property.id).length}
                    onViewApplications={(id) => setActiveTab('applications')}
                    onCreateLease={(id) => {}}
                    onEditProperty={(property) => {}}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 rounded-2xl border-2 border-dashed border-gray-200">
                <CardContent>
                  <Home size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Properties Yet</h3>
                  <p className="text-gray-500 mb-6">Start building your rental portfolio</p>
                  <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Tenant Applications</h2>
            </div>
            
            {applications.length > 0 ? (
              <div className="bg-white rounded-lg shadow">
                <div className="hidden md:grid md:grid-cols-5 gap-4 p-4 border-b text-sm font-medium text-gray-500">
                  <div>Applicant</div>
                  <div>Property</div>
                  <div>Contact</div>
                  <div>Date</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {applications.map(application => (
                    <div key={application.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 hover:bg-gray-50">
                      <div>
                        <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Applicant</div>
                        {application.applicant}
                      </div>
                      <div>
                        <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Property</div>
                        {application.property}
                      </div>
                      <div>
                        <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Contact</div>
                        <div className="text-sm">
                          <div>{application.email}</div>
                          <div className="text-gray-500">{application.phone}</div>
                        </div>
                      </div>
                      <div>
                        <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Date</div>
                        {formatDate(application.date)}
                      </div>
                      <div>
                        <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Status</div>
                        <Badge className={
                          application.status === 'approved' 
                            ? 'bg-green-500' 
                            : application.status === 'rejected'
                            ? 'bg-red-500'
                            : 'bg-amber-500'
                        }>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-2">
                  <User size={40} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Applications Found</h3>
                <p className="text-gray-500 mb-4">You don't have any tenant applications yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Documents</h2>
              <Button asChild className="bg-rentpilot-600 hover:bg-rentpilot-700">
                <Link to="/lease">Create Lease</Link>
              </Button>
            </div>
            
            {documents.length > 0 ? (
              <div className="bg-white rounded-lg shadow">
                <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 border-b text-sm font-medium text-gray-500">
                  <div className="col-span-2">Document</div>
                  <div>Date</div>
                  <div>Type</div>
                </div>
                <div className="divide-y">
                  {documents.map(document => (
                    <div key={document.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 hover:bg-gray-50">
                      <div className="md:col-span-2 flex items-center">
                        <FileText className="mr-2 text-rentpilot-600" size={20} />
                        <div>
                          <div className="font-medium">{document.name}</div>
                          {document.tenant_name && (
                            <div className="text-sm text-gray-500">Tenant: {document.tenant_name}</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Date</div>
                        {formatDate(document.date)}
                      </div>
                      <div>
                        <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Type</div>
                        <Badge variant="outline" className="capitalize">
                          {document.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-2">
                  <FileText size={40} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Documents Found</h3>
                <p className="text-gray-500 mb-4">Start by creating a lease</p>
                <Button asChild className="bg-rentpilot-600 hover:bg-rentpilot-700">
                  <Link to="/lease">Create Lease</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LandlordDashboard;
