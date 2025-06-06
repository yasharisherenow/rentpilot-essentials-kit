import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Building, Users, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Property } from '@/types/property';
import AddPropertyWizard from '@/components/dashboard/AddPropertyWizard';
import AddLeaseForm from '@/components/dashboard/AddLeaseForm';
import PropertyCard from '@/components/dashboard/PropertyCard';
import ViewPropertyModal from '@/components/dashboard/ViewPropertyModal';
import EditPropertyForm from '@/components/EditPropertyForm';
import DeletePropertyModal from '@/components/dashboard/DeletePropertyModal';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import ApplicationBoard from '@/components/dashboard/ApplicationBoard';
import AnalyticsPanel from '@/components/dashboard/AnalyticsPanel';
import LeaseManagement from '@/components/dashboard/LeaseManagement';
import DocumentManager from '@/components/dashboard/DocumentManager';
import EnhancedNotifications from '@/components/dashboard/EnhancedNotifications';

const LandlordDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showViewProperty, setShowViewProperty] = useState(false);
  const [showEditProperty, setShowEditProperty] = useState(false);
  const [showDeleteProperty, setShowDeleteProperty] = useState(false);

  const fetchProperties = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const handlePropertyAdded = () => {
    fetchProperties();
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowViewProperty(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowEditProperty(true);
  };

  const handleDeleteProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowDeleteProperty(true);
  };

  const handlePropertyUpdated = () => {
    fetchProperties();
    setShowEditProperty(false);
    setSelectedProperty(null);
  };

  const handlePropertyDeleted = () => {
    fetchProperties();
    setShowDeleteProperty(false);
    setSelectedProperty(null);
  };

  // Calculate portfolio stats
  const portfolioStats = {
    totalRent: properties.reduce((sum, prop) => sum + Number(prop.monthly_rent), 0),
    totalProperties: properties.length,
    occupiedUnits: properties.filter(p => !p.is_available).length,
    vacantUnits: properties.filter(p => p.is_available).length,
    pendingApplications: 0, // This would come from applications table
    activeLeases: 0, // This would come from leases table
    expiringLeases: 0, // This would come from leases table
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Landlord Dashboard</h1>
          <p className="text-muted-foreground">Manage your rental properties and track performance</p>
        </div>
        <div className="flex gap-3">
          <AddLeaseForm onLeaseCreated={handlePropertyAdded} />
          <Button onClick={() => setShowAddProperty(true)} className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2" size={16} />
            Add Property
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="leases">Leases</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PortfolioOverview stats={portfolioStats} />
          <EnhancedNotifications 
            notifications={[]}
            onDismiss={() => {}}
            onMarkAsRead={() => {}}
            onClearAll={() => {}}
          />
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          {properties.length === 0 ? (
            <Card>
              <CardHeader className="text-center">
                <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle>No Properties Yet</CardTitle>
                <CardDescription>
                  Get started by adding your first rental property
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => setShowAddProperty(true)}>
                  <PlusCircle className="mr-2" size={16} />
                  Add Your First Property
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  applicationCount={0}
                  onViewApplications={() => {}}
                  onCreateLease={() => {}}
                  onEditProperty={() => handleEditProperty(property)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationBoard 
            applications={[]}
            onStatusChange={() => {}}
            onCreateLease={() => {}}
            onViewDetails={() => {}}
          />
        </TabsContent>

        <TabsContent value="leases">
          <LeaseManagement 
            leases={[]}
            onPreviewLease={() => {}}
            onDownloadLease={() => {}}
            onDuplicateLease={() => {}}
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentManager />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsPanel />
        </TabsContent>
      </Tabs>

      {showAddProperty && (
        <AddPropertyWizard
          onPropertyAdded={handlePropertyAdded}
          onClose={() => setShowAddProperty(false)}
        />
      )}

      {showViewProperty && selectedProperty && (
        <ViewPropertyModal
          property={selectedProperty}
          onClose={() => {
            setShowViewProperty(false);
            setSelectedProperty(null);
          }}
        />
      )}

      {showEditProperty && selectedProperty && (
        <EditPropertyForm
          property={selectedProperty}
          onPropertyUpdated={handlePropertyUpdated}
        />
      )}

      {showDeleteProperty && selectedProperty && (
        <DeletePropertyModal
          property={selectedProperty}
          onPropertyDeleted={handlePropertyDeleted}
          onClose={() => {
            setShowDeleteProperty(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </div>
  );
};

export default LandlordDashboard;
