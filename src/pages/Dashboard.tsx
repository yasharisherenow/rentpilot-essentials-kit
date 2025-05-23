
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Calendar, Clock, Home, Settings, Bell, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for dashboard
  const properties = [
    {
      id: 1,
      address: '123 Main Street, Unit 4B',
      city: 'Toronto',
      province: 'ON',
      status: 'occupied',
      tenant: 'Sarah Johnson',
      leaseEnd: '2023-12-31',
      monthlyRent: '1800',
    },
    {
      id: 2,
      address: '456 Maple Avenue',
      city: 'Vancouver',
      province: 'BC',
      status: 'vacant',
      tenant: '',
      leaseEnd: '',
      monthlyRent: '2200',
    },
  ];
  
  const applications = [
    {
      id: 1,
      applicant: 'Michael Lee',
      property: '123 Main Street, Unit 4B',
      date: '2023-05-15',
      status: 'approved',
    },
    {
      id: 2,
      applicant: 'Jessica Smith',
      property: '456 Maple Avenue',
      date: '2023-05-18',
      status: 'pending',
    },
  ];
  
  const documents = [
    {
      id: 1,
      name: 'Lease Agreement - 123 Main St',
      date: '2023-05-01',
      type: 'lease',
    },
    {
      id: 2,
      name: 'Tenant Application - Michael Lee',
      date: '2023-04-28',
      type: 'application',
    },
    {
      id: 3,
      name: 'Lease Agreement - 456 Maple Ave',
      date: '2023-01-15',
      type: 'lease',
    },
  ];
  
  const reminders = [
    {
      id: 1,
      title: 'Lease Renewal - 123 Main St',
      date: '2023-12-01',
      description: 'Contact tenant about lease renewal (expires Dec 31)',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Schedule Property Inspection',
      date: '2023-06-15',
      description: '6-month inspection for 123 Main St',
      priority: 'medium',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Landlord Dashboard</h1>
          <p className="text-gray-600">Manage your properties, applications, and documents</p>
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
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Settings</span>
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
                  {documents.filter(d => d.type === 'lease').length} leases, {documents.filter(d => d.type === 'application').length} applications
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
                <CardTitle>Recent Properties</CardTitle>
                <CardDescription>Manage your rental properties</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {properties.map(property => (
                    <div key={property.id} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                      <div className="mb-2 md:mb-0">
                        <div className="font-medium">{property.address}</div>
                        <div className="text-sm text-gray-500">{property.city}, {property.province}</div>
                      </div>
                      <div className="flex flex-col md:items-end">
                        <Badge className={property.status === 'occupied' ? 'bg-green-500' : 'bg-amber-500'}>
                          {property.status === 'occupied' ? 'Occupied' : 'Vacant'}
                        </Badge>
                        {property.status === 'occupied' && (
                          <div className="text-sm text-gray-500 mt-1">
                            Lease ends: {new Date(property.leaseEnd).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50">
                <Button asChild variant="ghost" className="w-full" size="sm">
                  <Link to="#" onClick={() => setActiveTab('properties')}>
                    View All Properties
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
                        <span className="text-sm">{new Date(reminder.date).toLocaleDateString()}</span>
                      </div>
                      <div className="font-medium">{reminder.title}</div>
                      <div className="text-sm text-gray-500">{reminder.description}</div>
                    </div>
                  ))}
                </div>
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
                <CardTitle className="text-lg">New Application</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-2">
                <User className="mx-auto text-rentpilot-600" size={32} />
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-rentpilot-600 hover:bg-rentpilot-700">
                  <Link to="/application">Create Application</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="properties" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Properties</h2>
            <Button className="bg-rentpilot-600 hover:bg-rentpilot-700">
              <PlusCircle className="mr-2" size={16} />
              Add Property
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map(property => (
              <Card key={property.id}>
                <CardHeader>
                  <CardTitle>{property.address}</CardTitle>
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
                    {property.status === 'occupied' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tenant:</span>
                          <span>{property.tenant}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Lease End Date:</span>
                          <span>{new Date(property.leaseEnd).toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Rent:</span>
                      <span>${property.monthlyRent} CAD</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">
                    {property.status === 'occupied' ? 'Manage Tenant' : 'Create Listing'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Tenant Applications</h2>
            <Button asChild className="bg-rentpilot-600 hover:bg-rentpilot-700">
              <Link to="/application">
                <PlusCircle className="mr-2" size={16} />
                New Application
              </Link>
            </Button>
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
                      {new Date(application.date).toLocaleDateString()}
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
              <p className="text-gray-500 mb-4">Start by creating a new tenant application</p>
              <Button asChild className="bg-rentpilot-600 hover:bg-rentpilot-700">
                <Link to="/application">Create Application</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Documents</h2>
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
                      {new Date(document.date).toLocaleDateString()}
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
              <p className="text-gray-500 mb-4">Start by creating a lease or application</p>
              <div className="flex justify-center gap-2">
                <Button asChild variant="outline">
                  <Link to="/application">New Application</Link>
                </Button>
                <Button asChild className="bg-rentpilot-600 hover:bg-rentpilot-700">
                  <Link to="/lease">Create Lease</Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
