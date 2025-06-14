
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square,
  Calendar,
  Users,
  FileText,
  MessageCircle,
  Eye
} from 'lucide-react';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import LeaseDetailsModal from './LeaseDetailsModal';

type PropertyCardProps = {
  property: Property;
  applicationCount: number;
  onViewApplications: () => void;
  onCreateLease: () => void;
  onEditProperty: (property: Property) => void;
};

const PropertyCard = ({ property, applicationCount, onViewApplications, onCreateLease, onEditProperty }: PropertyCardProps) => {
  const [activeLeases, setActiveLeases] = useState<any[]>([]);
  const [selectedLease, setSelectedLease] = useState<any>(null);
  const [showLeaseDetails, setShowLeaseDetails] = useState(false);
  const { user } = useAuth();

  const fetchActiveLeases = async () => {
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
          )
        `)
        .eq('property_id', property.id)
        .in('status', ['active', 'draft'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveLeases(data || []);
    } catch (error) {
      console.error('Error fetching leases:', error);
    }
  };

  useEffect(() => {
    fetchActiveLeases();
  }, [property.id, user]);

  const handleViewLeaseDetails = (lease: any) => {
    setSelectedLease(lease);
    setShowLeaseDetails(true);
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
        <CardHeader className="space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">{property.title}</CardTitle>
            <Badge variant="secondary">
              {property.is_available ? 'Vacant' : 'Occupied'}
            </Badge>
          </div>
          <CardDescription className="text-slate-400 flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {property.address}, {property.city}, {property.province}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <DollarSign className="h-4 w-4" />
              ${property.monthly_rent}/month
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Bed className="h-4 w-4" />
              {property.bedrooms} Beds
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Bath className="h-4 w-4" />
              {property.bathrooms} Baths
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Square className="h-4 w-4" />
              {property.square_feet} sqft
            </div>
          </div>

          {/* Active Leases Section */}
          {activeLeases.length > 0 && (
            <div className="border-t border-slate-700/50 pt-4">
              <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <FileText size={14} />
                Active Leases ({activeLeases.length})
              </h4>
              <div className="space-y-2">
                {activeLeases.map((lease) => (
                  <div key={lease.id} className="bg-slate-700/30 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{lease.tenant_name}</p>
                      <p className="text-xs text-slate-400">
                        ${lease.monthly_rent}/month • {lease.status}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleViewLeaseDetails(lease)}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    >
                      <MessageCircle size={14} className="mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-700/50 pt-4">
            <Button variant="outline" size="sm" onClick={onViewApplications} className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
              <Users className="mr-2 h-4 w-4" />
              View Applications ({applicationCount})
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onEditProperty(property)}>
              <Eye className="mr-2 h-4 w-4" />
              Edit Property
            </Button>
          </div>
        </CardContent>
      </Card>

      <LeaseDetailsModal
        lease={selectedLease}
        isOpen={showLeaseDetails}
        onClose={() => {
          setShowLeaseDetails(false);
          setSelectedLease(null);
        }}
        isLandlord={true}
      />
    </>
  );
};

export default PropertyCard;
