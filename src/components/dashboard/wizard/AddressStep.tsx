
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PropertyFormData } from '../AddPropertyWizard';

interface AddressStepProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export const AddressStep = ({ formData, setFormData }: AddressStepProps) => {
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-slate-300">Street Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="123 Main Street"
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-slate-300">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Toronto"
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="province" className="text-slate-300">Province *</Label>
            <Input
              id="province"
              value={formData.province}
              onChange={(e) => handleInputChange('province', e.target.value)}
              placeholder="ON"
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code" className="text-slate-300">Postal Code *</Label>
          <Input
            id="postal_code"
            value={formData.postal_code}
            onChange={(e) => handleInputChange('postal_code', e.target.value)}
            placeholder="M5V 3A8"
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};
