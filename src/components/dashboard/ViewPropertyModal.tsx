
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Home, DollarSign, Users, Calendar } from 'lucide-react';
import { Property } from '@/types/property';

interface ViewPropertyModalProps {
  property: Property;
  onClose: () => void;
}

const ViewPropertyModal = ({ property, onClose }: ViewPropertyModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-screen-md max-h-[90vh] overflow-y-auto">
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <CardHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-white">{property.title}</CardTitle>
                <CardDescription className="text-slate-400 flex items-center gap-2 mt-2">
                  <MapPin size={16} />
                  {property.address}, {property.city}, {property.province} {property.postal_code}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
                <X size={20} />
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Badge className={`${property.is_available ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                {property.is_available ? 'Available' : 'Occupied'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Property Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="text-yellow-400" size={20} />
                    <h3 className="text-white font-semibold">Rental Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Rent:</span>
                      <span className="text-white font-semibold">${property.monthly_rent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Security Deposit:</span>
                      <span className="text-white">${(property.monthly_rent * 1.5).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Home className="text-yellow-400" size={20} />
                    <h3 className="text-white font-semibold">Property Details</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bedrooms:</span>
                      <span className="text-white">{property.bedrooms || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bathrooms:</span>
                      <span className="text-white">{property.bathrooms || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Square Feet:</span>
                      <span className="text-white">{property.square_feet ? `${property.square_feet} sq ft` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="text-yellow-400" size={20} />
                    <h3 className="text-white font-semibold">Unit Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Units:</span>
                      <span className="text-white">{property.unit_count || 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Property Type:</span>
                      <span className="text-white">{property.property_type || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="text-yellow-400" size={20} />
                    <h3 className="text-white font-semibold">Timeline</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Listed:</span>
                      <span className="text-white">{new Date(property.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Available:</span>
                      <span className="text-white">{property.available_date ? new Date(property.available_date).toLocaleDateString() : 'Immediately'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="text-sm text-slate-300 bg-slate-600/30 rounded-lg px-3 py-2">
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Description</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{property.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewPropertyModal;
