
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  DollarSign, 
  Users, 
  FileText, 
  Plus,
  Eye,
  Settings
} from 'lucide-react';
import { Property } from '@/types/property';

type PropertyCardProps = {
  property: Property;
  applicationCount?: number;
  onViewApplications: (propertyId: string) => void;
  onCreateLease: (propertyId: string) => void;
  onEditProperty: (property: Property) => void;
};

const PropertyCard = ({ 
  property, 
  applicationCount = 0,
  onViewApplications,
  onCreateLease,
  onEditProperty
}: PropertyCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#0C6E5F]/5 to-[#FFD500]/5 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {property.title || property.address}
            </CardTitle>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin size={14} className="mr-1" />
              {property.city}, {property.province}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center text-[#0C6E5F] font-medium">
                <DollarSign size={14} className="mr-1" />
                ${property.monthly_rent}/month
              </div>
              {property.bedrooms && (
                <span className="text-gray-600">
                  {property.bedrooms}BR
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={property.is_available ? "secondary" : "default"}
              className={property.is_available 
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200" 
                : "bg-green-100 text-green-700 hover:bg-green-200"
              }
            >
              {property.is_available ? 'Vacant' : 'Occupied'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditProperty(property)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Settings size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewApplications(property.id)}
            className="flex items-center gap-2 hover:bg-[#0C6E5F]/5 hover:border-[#0C6E5F]/20"
          >
            <Users size={14} />
            <span>Applications</span>
            {applicationCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs bg-[#FFD500]/20 text-[#0C6E5F]">
                {applicationCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateLease(property.id)}
            className="flex items-center gap-2 hover:bg-[#0C6E5F]/5 hover:border-[#0C6E5F]/20"
          >
            <FileText size={14} />
            Create Lease
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Property ID: {property.id.slice(0, 8)}...</span>
            <span>Added {new Date(property.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
