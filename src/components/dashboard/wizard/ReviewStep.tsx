
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyFormData } from '../AddPropertyWizard';

interface ReviewStepProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export const ReviewStep = ({ formData }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white">Property Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Name:</span>
                <span className="text-white ml-2">{formData.title}</span>
              </div>
              <div>
                <span className="text-slate-400">Type:</span>
                <span className="text-white ml-2">{formData.property_type}</span>
              </div>
              <div>
                <span className="text-slate-400">Monthly Rent:</span>
                <span className="text-white ml-2">${formData.monthly_rent}</span>
              </div>
              <div>
                <span className="text-slate-400">Units:</span>
                <span className="text-white ml-2">{formData.unit_count}</span>
              </div>
              {formData.bedrooms && (
                <div>
                  <span className="text-slate-400">Bedrooms:</span>
                  <span className="text-white ml-2">{formData.bedrooms}</span>
                </div>
              )}
              {formData.bathrooms && (
                <div>
                  <span className="text-slate-400">Bathrooms:</span>
                  <span className="text-white ml-2">{formData.bathrooms}</span>
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t border-slate-700/50">
              <div className="text-sm">
                <span className="text-slate-400">Address:</span>
                <div className="text-white mt-1">
                  {formData.address}<br />
                  {formData.city}, {formData.province} {formData.postal_code}
                </div>
              </div>
            </div>

            {formData.amenities.length > 0 && (
              <div className="pt-2 border-t border-slate-700/50">
                <span className="text-slate-400 text-sm">Amenities:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="bg-slate-700/50 text-slate-300">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {formData.description && (
              <div className="pt-2 border-t border-slate-700/50">
                <span className="text-slate-400 text-sm">Description:</span>
                <p className="text-white text-sm mt-1">{formData.description}</p>
              </div>
            )}

            {formData.photos.length > 0 && (
              <div className="pt-2 border-t border-slate-700/50">
                <span className="text-slate-400 text-sm">Photos:</span>
                <div className="text-white text-sm mt-1">
                  {formData.photos.length} photo(s) ready to upload
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
