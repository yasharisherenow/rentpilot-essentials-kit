
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Home, FileText, User, PlusCircle, AlertCircle, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import AddPropertyForm from '@/components/AddPropertyForm';
import CreateLeaseForm from '@/components/CreateLeaseForm';
import EditPropertyForm from '@/components/EditPropertyForm';
import AccountManagement from '@/components/AccountManagement';

type Property = {
  id: string;
  title: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  monthly_rent: number;
  status: 'occupied' | 'vacant';
  tenant?: string;
  leaseEnd?: string;
  bedrooms?: number;
  bathrooms?: number;
  is_available: boolean;
  unit_count?: number;
};

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

  useEffect(() => {
    if (!user || !profile) return;

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

    loadLandlordData();
  }, [user, profile]);

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
        status: prop.is_available ? 'vacant' : 'occupied',
        tenant: 'TBD',
        leaseEnd: 'TBD',
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        is_available: prop.is_available,
        unit_count: prop.unit_count,
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

  const handlePropertyAdded = () => {
    fetchProperties();
  };

  const handleLeaseCreated = () => {
    fetchLeaseDocuments();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rentpilot-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Landlord Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {profile?.first_name} {profile?.last_name}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Bell size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => signOut()}>
            <User size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Properties</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">{properties.length}</div>
                <p className="text-xs text-gray-500">
                  {properties.filter(p => p.status === 'occupied').length} occupied, {properties.filter(p => p.status === 'vacant').length} vacant
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">{applications.length}</div>
                <p className="text-xs text-gray-500">
                  {applications.filter(a => a.status === 'pending').length} pending review
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Documents</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">{documents.length}</div>
                <p className="text-xs text-gray-500">
                  {documents.filter(d => d.type === 'lease').length} leases
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">
                  ${properties.reduce((total, p) => total + p.monthly_rent, 0).toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">Monthly potential</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-lg">Add New Property</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-2">
                <Home className="mx-auto text-rentpilot-600" size={32} />
              </CardContent>
              <CardFooter>
                <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-lg">Create Lease</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-2">
                <FileText className="mx-auto text-rentpilot-600" size={32} />
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-rentpilot-600 hover:bg-rentpilot-700">
                  <Link to="/lease">Create Lease</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-lg">My Account</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-2">
                <User className="mx-auto text-rentpilot-600" size={32} />
              </CardContent>
              <CardFooter>
                <AccountManagement />
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="properties" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Properties</h2>
            <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
          </div>
          
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map(property => (
                <Card key={property.id}>
                  <CardHeader>
                    <CardTitle>{property.title || property.address}</CardTitle>
                    <CardDescription>{property.city}, {property.province}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <Badge className={property.status === 'occupied' ? 'bg-green-500' : 'bg-amber-500'}>
                          {property.status === 'occupied' ? 'Occupied' : 'Vacant'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Monthly Rent:</span>
                        <span>${property.monthly_rent} CAD</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <EditPropertyForm
                      property={property}
                      onPropertyUpdated={handlePropertyAdded}
                    />
                    <CreateLeaseForm
                      propertyId={property.id}
                      propertyTitle={property.title || property.address}
                      defaultRent={property.monthly_rent}
                      onLeaseCreated={handleLeaseCreated}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-2">
                <Home size={40} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Properties Found</h3>
              <p className="text-gray-500 mb-4">Start by adding your first property</p>
              <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
            </div>
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
  );
};

export default LandlordDashboard;
