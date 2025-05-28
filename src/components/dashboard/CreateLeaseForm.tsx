
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CreateLeaseFormProps {
  onLeaseCreated: () => void;
  onClose: () => void;
}

interface Property {
  id: string;
  title: string;
  address: string;
  monthly_rent: number;
}

const CreateLeaseForm = ({ onLeaseCreated, onClose }: CreateLeaseFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState({
    property_id: '',
    tenant_name: '',
    tenant_email: '',
    lease_start_date: '',
    lease_end_date: '',
    monthly_rent: '',
    security_deposit: '',
    pet_deposit: '',
    has_pets: false,
    utilities_included: [] as string[],
    snow_grass_responsibility: '',
    special_terms: ''
  });

  const utilityOptions = [
    'Electricity', 'Gas', 'Water', 'Internet', 'Cable/TV', 
    'Heating', 'Air Conditioning', 'Garbage Collection'
  ];

  const responsibilityOptions = [
    'Tenant responsible for both',
    'Landlord responsible for both',
    'Tenant responsible for grass, landlord for snow',
    'Landlord responsible for grass, tenant for snow',
    'As per municipal bylaws'
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, address, monthly_rent')
        .eq('landlord_id', user.id)
        .eq('is_available', true);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUtilityChange = (utility: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ 
        ...prev, 
        utilities_included: [...prev.utilities_included, utility] 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        utilities_included: prev.utilities_included.filter(u => u !== utility) 
      }));
    }
  };

  const handlePropertyChange = (propertyId: string) => {
    const selectedProperty = properties.find(p => p.id === propertyId);
    if (selectedProperty) {
      setFormData(prev => ({
        ...prev,
        property_id: propertyId,
        monthly_rent: selectedProperty.monthly_rent.toString(),
        security_deposit: selectedProperty.monthly_rent.toString()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { data: lease, error } = await supabase
        .from('leases')
        .insert({
          property_id: formData.property_id,
          landlord_id: user.id,
          tenant_name: formData.tenant_name,
          lease_start_date: formData.lease_start_date,
          lease_end_date: formData.lease_end_date,
          monthly_rent: parseFloat(formData.monthly_rent),
          security_deposit: parseFloat(formData.security_deposit),
          pet_deposit: formData.has_pets ? parseFloat(formData.pet_deposit || '0') : 0,
          has_pets: formData.has_pets,
          utilities_included: formData.utilities_included,
          snow_grass_responsibility: formData.snow_grass_responsibility,
          special_terms: formData.special_terms,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Update property availability
      await supabase
        .from('properties')
        .update({ is_available: false })
        .eq('id', formData.property_id);

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'lease_created',
          title: 'New Lease Created',
          description: `Lease agreement created for ${formData.tenant_name}`,
          metadata: { lease_id: lease.id, property_id: formData.property_id },
          priority: 'medium'
        });

      toast({
        title: "Success",
        description: "Lease created successfully!",
      });

      onLeaseCreated();
      onClose();
    } catch (error) {
      console.error('Error creating lease:', error);
      toast({
        title: "Error",
        description: "Failed to create lease",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <FileText className="text-yellow-400" size={24} />
              Create Lease Agreement
            </CardTitle>
            <CardDescription className="text-slate-400">
              Generate a new lease for your property
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Select Property *</Label>
              <Select onValueChange={handlePropertyChange} value={formData.property_id}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
                  <SelectValue placeholder="Choose a property" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id} className="text-white">
                      {property.title} - {property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tenant_name" className="text-slate-300">Tenant Name *</Label>
              <Input
                id="tenant_name"
                value={formData.tenant_name}
                onChange={(e) => handleInputChange('tenant_name', e.target.value)}
                placeholder="John Doe"
                required
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lease_start_date" className="text-slate-300">Lease Start Date *</Label>
              <Input
                id="lease_start_date"
                type="date"
                value={formData.lease_start_date}
                onChange={(e) => handleInputChange('lease_start_date', e.target.value)}
                required
                className="bg-slate-800/50 border-slate-700/50 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lease_end_date" className="text-slate-300">Lease End Date *</Label>
              <Input
                id="lease_end_date"
                type="date"
                value={formData.lease_end_date}
                onChange={(e) => handleInputChange('lease_end_date', e.target.value)}
                required
                className="bg-slate-800/50 border-slate-700/50 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_rent" className="text-slate-300">Monthly Rent *</Label>
              <Input
                id="monthly_rent"
                type="number"
                value={formData.monthly_rent}
                onChange={(e) => handleInputChange('monthly_rent', e.target.value)}
                placeholder="2500"
                required
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="security_deposit" className="text-slate-300">Security Deposit *</Label>
              <Input
                id="security_deposit"
                type="number"
                value={formData.security_deposit}
                onChange={(e) => handleInputChange('security_deposit', e.target.value)}
                placeholder="2500"
                required
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
            
            {formData.has_pets && (
              <div className="space-y-2">
                <Label htmlFor="pet_deposit" className="text-slate-300">Pet Deposit</Label>
                <Input
                  id="pet_deposit"
                  type="number"
                  value={formData.pet_deposit}
                  onChange={(e) => handleInputChange('pet_deposit', e.target.value)}
                  placeholder="500"
                  className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_pets"
                checked={formData.has_pets}
                onCheckedChange={(checked) => handleInputChange('has_pets', checked)}
                className="border-slate-600 text-yellow-400"
              />
              <Label htmlFor="has_pets" className="text-slate-300">
                Pets allowed
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-slate-300">Snow/Grass Responsibility</Label>
            <Select onValueChange={(value) => handleInputChange('snow_grass_responsibility', value)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Select responsibility" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {responsibilityOptions.map((option) => (
                  <SelectItem key={option} value={option} className="text-white">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-slate-300">Utilities Included</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {utilityOptions.map((utility) => (
                <div key={utility} className="flex items-center space-x-2">
                  <Checkbox
                    id={utility}
                    checked={formData.utilities_included.includes(utility)}
                    onCheckedChange={(checked) => handleUtilityChange(utility, checked as boolean)}
                    className="border-slate-600 text-yellow-400"
                  />
                  <Label htmlFor={utility} className="text-slate-300 text-sm cursor-pointer">
                    {utility}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_terms" className="text-slate-300">Special Terms & Conditions</Label>
            <Textarea
              id="special_terms"
              value={formData.special_terms}
              onChange={(e) => handleInputChange('special_terms', e.target.value)}
              placeholder="Any special clauses or conditions..."
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.property_id}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
            >
              {isSubmitting ? 'Creating Lease...' : 'Create Lease'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateLeaseForm;
