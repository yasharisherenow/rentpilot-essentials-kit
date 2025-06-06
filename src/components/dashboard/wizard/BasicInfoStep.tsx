
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PropertyFormData } from '../AddPropertyWizard';

interface BasicInfoStepProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export const BasicInfoStep = ({ formData, setFormData }: BasicInfoStepProps) => {
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-slate-300">Property Name *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Sunny Downtown Apartment"
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="property_type" className="text-slate-300">Property Type</Label>
          <Input
            id="property_type"
            value={formData.property_type}
            onChange={(e) => handleInputChange('property_type', e.target.value)}
            placeholder="Apartment, House, Condo"
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthly_rent" className="text-slate-300">Monthly Rent ($) *</Label>
            <Input
              id="monthly_rent"
              type="number"
              value={formData.monthly_rent}
              onChange={(e) => handleInputChange('monthly_rent', e.target.value)}
              placeholder="2500"
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_count" className="text-slate-300">Unit Count</Label>
            <Input
              id="unit_count"
              type="number"
              value={formData.unit_count}
              onChange={(e) => handleInputChange('unit_count', parseInt(e.target.value) || 1)}
              placeholder="1"
              min="1"
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms" className="text-slate-300">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              placeholder="2"
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms" className="text-slate-300">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              step="0.5"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', e.target.value)}
              placeholder="1.5"
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="square_feet" className="text-slate-300">Square Feet</Label>
            <Input
              id="square_feet"
              type="number"
              value={formData.square_feet}
              onChange={(e) => handleInputChange('square_feet', e.target.value)}
              placeholder="800"
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
