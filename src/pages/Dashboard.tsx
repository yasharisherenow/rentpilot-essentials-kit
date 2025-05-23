
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Calendar, Clock, Home, Settings, Bell, PlusCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type Property = {
  id: string;
  title: string;
  address: string;
  city: string;
  province: string;
  monthly_rent: string;
  status: 'occupied' | 'vacant';
  tenant?: string;
  leaseEnd?: string;
};

type Application = {
  id: string;
  applicant: string;
  property: string;
  property_id: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
};

type Document = {
  id: string;
  name: string;
  date: string;
  type: string;
};

type Reminder = {
  id: string;
  title: string;
  date: string;
  description: string;
  priority: string;
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data based on role
  useEffect(() => {
    if (!user || !profile) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (profile.role === 'landlord') {
          // Load landlord data
          await Promise.all([
            fetchProperties(),
            fetchApplicationsForLandlord(),
            fetchLeaseDocuments(),
          ]);
        } else {
          // Load tenant data
          await Promise.all([
            fetchAvailableProperties(),
            fetchTenantApplications(),
          ]);
        }
        
        // Load mock reminders for now (would be from database in production)
        setReminders([
          {
            id: "1",
            title: "Lease Renewal - Coming Soon",
            date: new Date().toISOString(),
            description: "Contact tenant about lease renewal",
            priority: "high",
          },
          {
            id: "2",
            title: "Schedule Property Inspection",
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days from now
            description: "6-month inspection for properties",
            priority: "medium",
          },
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, profile]);

  // Fetch properties for landlords
  const fetchProperties = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id);

      if (error) throw error;

      // Transform data to match the expected format
      const formattedProperties = data.map((prop) => ({
        id: prop.id,
        title: prop.title,
        address: prop.address,
        city: prop.city,
        province: prop.province,
        monthly_rent: prop.monthly_rent,
        status: prop.is_available ? 'vacant' : 'occupied',
        // These fields would be populated from lease information in a real scenario
        tenant: 'TBD',
        leaseEnd: 'TBD',
      }));

      setProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  // Fetch available properties for tenants
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
        monthly_rent: prop.monthly_rent,
        status: 'vacant' as 'vacant',
      }));

      setProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching available properties:", error);
    }
  };

  // Fetch applications for landlords
  const fetchApplicationsForLandlord = async () => {
    if (!user) return;

    try {
      // This query would need to join the applications table with properties
      // and profiles to get all the necessary information
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          property_id,
          first_name,
          last_name,
          created_at,
          status,
          properties:property_id (title, address)
        `)
        .eq('properties.landlord_id', user.id);

      if (error) throw error;

      const formattedApplications = data.map((app) => ({
        id: app.id,
        applicant: `${app.first_name} ${app.last_name}`,
        property: app.properties?.title || app.properties?.address || 'Unknown property',
        property_id: app.property_id,
        date: app.created_at,
        status: app.status as 'pending' | 'approved' | 'rejected',
      }));

      setApplications(formattedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Fetch applications for tenants
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
          properties:property_id (title, address)
        `)
        .eq('tenant_id', user.id);

      if (error) throw error;

      const formattedApplications = data.map((app) => ({
        id: app.id,
        applicant: 'Me',
        property: app.properties?.title || app.properties?.address || 'Unknown property',
        property_id: app.property_id,
        date: app.created_at,
        status: app.status as 'pending' | 'approved' | 'rejected',
      }));

      setApplications(formattedApplications);
    } catch (error) {
      console.error("Error fetching tenant applications:", error);
    }
  };

  // Fetch lease documents
  const fetchLeaseDocuments = async () => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('leases')
        .select(`
          id,
          property_id,
          created_at,
          tenant_name,
          status,
          properties:property_id (title, address)
        `)
        .eq(profile.role === 'landlord' ? 'landlord_id' : 'tenant_id', user.id);

      if (error) throw error;

      const formattedDocuments = data.map((lease) => ({
        id: lease.id,
        name: `Lease - ${lease.properties?.title || lease.properties?.address} - ${lease.tenant_name}`,
        date: lease.created_at,
        type: 'lease',
      }));

      setDocuments(formattedDocuments);
    } catch (error) {
      console.error("Error fetching lease documents:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Render loading state
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
          <h1 className="text-3xl font-bold mb-1">
            {profile?.role === 'landlord' ? 'Landlord Dashboard' : 'Tenant Dashboard'}
          </h1>
          <p className="text-gray-600">
            Welcome back, {profile?.first_name} {profile?.last_name}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Bell size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => signOut()}
          >
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
          {/* Stats Cards */}
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
                <CardTitle className="text-sm font-medium text-gray-500">Reminders</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">{reminders.length}</div>
                <p className="text-xs text-gray-500">
                  {reminders.filter(r => r.priority === 'high').length} high priority
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity and Reminders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{profile?.role === 'landlord' ? 'Your Properties' : 'Available Properties'}</CardTitle>
                <CardDescription>
                  {profile?.role === 'landlord' ? 'Manage your rental properties' : 'Properties available for rent'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {properties.length > 0 ? (
                  <div className="divide-y">
                    {properties.slice(0, 3).map(property => (
                      <div key={property.id} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                        <div className="mb-2 md:mb-0">
                          <div className="font-medium">{property.title || property.address}</div>
                          <div className="text-sm text-gray-500">{property.city}, {property.province}</div>
                        </div>
                        <div className="flex flex-col md:items-end">
                          <Badge className={property.status === 'occupied' ? 'bg-green-500' : 'bg-amber-500'}>
                            {property.status === 'occupied' ? 'Occupied' : 'Vacant'}
                          </Badge>
                          <div className="text-sm text-gray-500 mt-1">
                            ${property.monthly_rent} /mo
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <h3>No Properties Found</h3>
                    {profile?.role === 'landlord' ? (
                      <p className="text-sm text-gray-500">Add your first property to get started.</p>
                    ) : (
                      <p className="text-sm text-gray-500">No available properties at the moment.</p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t bg-gray-50">
                <Button asChild variant="ghost" className="w-full" size="sm">
                  <Link to="#" onClick={() => setActiveTab('properties')}>
                    {profile?.role === 'landlord' ? 'View All Properties' : 'Browse All Properties'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reminders</CardTitle>
                <CardDescription>Important dates and events</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {reminders.length > 0 ? (
                  <div className="divide-y">
                    {reminders.map(reminder => (
                      <div key={reminder.id} className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={
                            reminder.priority === 'high' 
                              ? 'bg-red-500' 
                              : reminder.priority === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }>
                            {reminder.priority}
                          </Badge>
                          <span className="text-sm">{formatDate(reminder.date)}</span>
                        </div>
                        <div className="font-medium">{reminder.title}</div>
                        <div className="text-sm text-gray-500">{reminder.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Clock className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <h3>No Reminders</h3>
                    <p className="text-sm text-gray-500">You don't have any upcoming reminders.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t bg-gray-50">
                <Button variant="ghost" className="w-full" size="sm">
                  Add Reminder
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile?.role === 'landlord' && (
              <Card>
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-lg">Add New Property</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <Home className="mx-auto text-rentpilot-600" size={32} />
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-rentpilot-600 hover:bg-rentpilot-700">Add Property</Button>
                </CardFooter>
              </Card>
            )}
            
            {profile?.role === 'landlord' && (
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
            )}
            
            {profile?.role === 'tenant' && (
              <Card>
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-lg">Find Properties</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <Home className="mx-auto text-rentpilot-600" size={32} />
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => setActiveTab('properties')}
                    className="w-full bg-rentpilot-600 hover:bg-rentpilot-700"
                  >
                    Browse Listings
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {profile?.role === 'tenant' && (
              <Card>
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-lg">View Applications</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-2">
                  <FileText className="mx-auto text-rentpilot-600" size={32} />
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => setActiveTab('applications')}
                    className="w-full bg-rentpilot-600 hover:bg-rentpilot-700"
                  >
                    My Applications
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            <Card>
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-lg">My Account</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-2">
                <User className="mx-auto text-rentpilot-600" size={32} />
              </CardContent>
              <CardFooter>
                <Button className="w-full">Manage Account</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="properties" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {profile?.role === 'landlord' ? 'Your Properties' : 'Available Properties'}
            </h2>
            {profile?.role === 'landlord' && (
              <Button className="bg-rentpilot-600 hover:bg-rentpilot-700">
                <PlusCircle className="mr-2" size={16} />
                Add Property
              </Button>
            )}
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
                      {property.status === 'occupied' && profile?.role === 'landlord' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tenant:</span>
                            <span>{property.tenant}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Lease End Date:</span>
                            <span>{property.leaseEnd && formatDate(property.leaseEnd)}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Monthly Rent:</span>
                        <span>${property.monthly_rent} CAD</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm">View Details</Button>
                    {profile?.role === 'landlord' ? (
                      <Button variant="outline" size="sm">
                        {property.status === 'occupied' ? 'Manage Tenant' : 'Create Listing'}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/application/${property.id}`)}
                      >
                        Apply Now
                      </Button>
                    )}
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
              {profile?.role === 'landlord' ? (
                <>
                  <p className="text-gray-500 mb-4">Start by adding your first property</p>
                  <Button className="bg-rentpilot-600 hover:bg-rentpilot-700">Add Property</Button>
                </>
              ) : (
                <p className="text-gray-500 mb-4">No properties are available at this time. Check back later.</p>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {profile?.role === 'landlord' ? 'Tenant Applications' : 'My Applications'}
            </h2>
            {profile?.role === 'tenant' && (
              <Button asChild className="bg-rentpilot-600 hover:bg-rentpilot-700">
                <Link to="#" onClick={() => setActiveTab('properties')}>
                  <PlusCircle className="mr-2" size={16} />
                  New Application
                </Link>
              </Button>
            )}
          </div>
          
          {applications.length > 0 ? (
            <div className="bg-white rounded-lg shadow">
              <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 border-b text-sm font-medium text-gray-500">
                <div>Applicant</div>
                <div>Property</div>
                <div>Date</div>
                <div>Status</div>
              </div>
              <div className="divide-y">
                {applications.map(application => (
                  <div key={application.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 hover:bg-gray-50">
                    <div>
                      <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Applicant</div>
                      {application.applicant}
                    </div>
                    <div>
                      <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Property</div>
                      {application.property}
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
              {profile?.role === 'tenant' ? (
                <>
                  <p className="text-gray-500 mb-4">Start by applying for a property</p>
                  <Button 
                    onClick={() => setActiveTab('properties')}
                    className="bg-rentpilot-600 hover:bg-rentpilot-700"
                  >
                    Browse Properties
                  </Button>
                </>
              ) : (
                <p className="text-gray-500 mb-4">You don't have any tenant applications yet.</p>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Documents</h2>
            {profile?.role === 'landlord' && (
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to="/application">
                    New Application
                  </Link>
                </Button>
                <Button asChild className="bg-rentpilot-600 hover:bg-rentpilot-700">
                  <Link to="/lease">
                    Create Lease
                  </Link>
                </Button>
              </div>
            )}
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
                      <div className="md:hidden text-sm font-medium text-gray-500 mb-1">Document</div>
                      <FileText className="mr-2 text-rentpilot-600" size={20} />
                      {document.name}
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
              {profile?.role === 'landlord' ? (
                <>
                  <p className="text-gray-500 mb-4">Start by creating a lease or application</p>
                  <div className="flex justify-center gap-2">
                    <Button asChild variant="outline">
                      <Link to="/application">New Application</Link>
                    </Button>
                    <Button asChild className="bg-rentpilot-600 hover:bg-rentpilot-700">
                      <Link to="/lease">Create Lease</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 mb-4">You don't have any documents yet.</p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
