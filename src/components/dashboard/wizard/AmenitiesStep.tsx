
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PropertyFormData } from '../AddPropertyWizard';

const amenitiesList = [
  'Parking', 'Air Conditioning', 'Laundry In-Unit', 'Laundry In-Building', 
  'Dishwasher', 'Pool', 'Gym', 'Balcony', 'Fireplace', 'Pet Friendly',
  'Storage', 'Elevator', 'Garden', 'Garage'
];

interface AmenitiesStepProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export const AmenitiesStep = ({ formData, setFormData }: AmenitiesStepProps) => {
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const updatedAmenities = checked
      ? [...formData.amenities, amenity]
      : formData.amenities.filter(a => a !== amenity);
    
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const handleDescriptionChange = (value: string) => {
    setFormData({ ...formData, description: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-slate-300">Amenities</Label>
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {amenitiesList.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  className="border-slate-600 text-yellow-400"
                />
                <Label htmlFor={amenity} className="text-slate-300 text-sm cursor-pointer">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-slate-300">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Describe the property features, location, and unique amenities..."
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 min-h-[100px]"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};
