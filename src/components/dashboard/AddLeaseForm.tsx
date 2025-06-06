
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X, FileText, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AddLeaseFormProps {
  onLeaseCreated: () => void;
}

interface Property {
  id: string;
  title: string;
  address: string;
  monthly_rent: number;
}

const AddLeaseForm = ({ onLeaseCreated }: AddLeaseFormProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenantNames, setTenantNames] = useState(['']);
  
  const [formData, setFormData] = useState({
    property_id: '',
    start_date: '',
    end_date: '',
    monthly_rent: '',
    security_deposit: '',
    emergency_contact: '',
    rent_due_day_type: '1st', // '1st', 'last', 'custom'
    custom_rent_day: '',
    pet_allowed: false,
    pet_deposit: '',
    sublet_allowed: false,
    responsibilities: [] as string[],
    lease_notes: ''
  });

  const responsibilityOptions = [
    'Snow Removal',
    'Lawn Care', 
    'Utilities',
    'Garbage',
    'Internet'
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

  const handleResponsibilityChange = (responsibility: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ 
        ...prev, 
        responsibilities: [...prev.responsibilities, responsibility] 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        responsibilities: prev.responsibilities.filter(r => r !== responsibility) 
      }));
    }
  };

  const addTenantField = () => {
    setTenantNames([...tenantNames, '']);
  };

  const removeTenantField = (index: number) => {
    if (tenantNames.length > 1) {
      setTenantNames(tenantNames.filter((_, i) => i !== index));
    }
  };

  const updateTenantName = (index: number, value: string) => {
    const updated = [...tenantNames];
    updated[index] = value;
    setTenantNames(updated);
  };

  const calculateRentDueDay = () => {
    if (formData.rent_due_day_type === '1st') return 1;
    if (formData.rent_due_day_type === 'last') return 31; // We'll handle this in backend
    return parseInt(formData.custom_rent_day) || 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    const validTenants = tenantNames.filter(name => name.trim());
    if (validTenants.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one tenant name",
        variant: "destructive",
      });
      return;
    }

    if (!formData.property_id || !formData.start_date || !formData.end_date) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: lease, error } = await supabase
        .from('leases')
        .insert({
          property_id: formData.property_id,
          landlord_id: user.id,
          tenant_name: validTenants.join(', '),
          lease_start_date: formData.start_date,
          lease_end_date: formData.end_date,
          monthly_rent: parseFloat(formData.monthly_rent),
          security_deposit: parseFloat(formData.security_deposit),
          pet_deposit: formData.pet_allowed ? parseFloat(formData.pet_deposit || '0') : 0,
          has_pets: formData.pet_allowed,
          special_terms: formData.lease_notes,
          status: 'active',
          utilities_included: formData.responsibilities,
          reminder_settings: {
            rent_due_day: calculateRentDueDay(),
            emergency_contact: formData.emergency_contact,
            sublet_allowed: formData.sublet_allowed
          }
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
          description: `Lease agreement created for ${validTenants.join(', ')}`,
          metadata: { lease_id: lease.id, property_id: formData.property_id },
          priority: 'medium'
        });

      toast({
        title: "Success",
        description: "Lease created successfully! This constitutes a legally binding agreement.",
      });

      // Reset form
      setFormData({
        property_id: '',
        start_date: '',
        end_date: '',
        monthly_rent: '',
        security_deposit: '',
        emergency_contact: '',
        rent_due_day_type: '1st',
        custom_rent_day: '',
        pet_allowed: false,
        pet_deposit: '',
        sublet_allowed: false,
        responsibilities: [],
        lease_notes: ''
      });
      setTenantNames(['']);
      setIsOpen(false);
      onLeaseCreated();
    } catch (error: any) {
      console.error('Error creating lease:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create lease",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <FileText className="mr-2" size={16} />
          Create Lease
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="text-primary" size={24} />
            Create Lease Agreement
          </DialogTitle>
          <DialogDescription>
            Generate a new lease for your property. This will constitute a legally binding agreement.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Selection */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Select Property *</Label>
            <Select onValueChange={handlePropertyChange} value={formData.property_id}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title} - {property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tenants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Tenant Names *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTenantField}
              >
                <Plus className="mr-1" size={14} />
                Add Tenant
              </Button>
            </div>
            {tenantNames.map((name, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Tenant ${index + 1} full name`}
                  value={name}
                  onChange={(e) => updateTenantName(index, e.target.value)}
                  className="flex-1"
                />
                {tenantNames.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTenantField(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label htmlFor="emergency_contact">Emergency Contact Number</Label>
            <Input
              id="emergency_contact"
              value={formData.emergency_contact}
              onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Lease Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_rent">Monthly Rent ($) *</Label>
              <Input
                id="monthly_rent"
                type="number"
                value={formData.monthly_rent}
                onChange={(e) => setFormData(prev => ({ ...prev, monthly_rent: e.target.value }))}
                placeholder="2500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="security_deposit">Security Deposit ($) *</Label>
              <Input
                id="security_deposit"
                type="number"
                value={formData.security_deposit}
                onChange={(e) => setFormData(prev => ({ ...prev, security_deposit: e.target.value }))}
                placeholder="2500"
                required
              />
            </div>
          </div>

          {/* Rent Due Date */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Rent Due Date</Label>
            <RadioGroup 
              value={formData.rent_due_day_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, rent_due_day_type: value }))}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1st" id="first" />
                <Label htmlFor="first">1st of month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last" id="last" />
                <Label htmlFor="last">Last day of month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom day:</Label>
                {formData.rent_due_day_type === 'custom' && (
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.custom_rent_day}
                    onChange={(e) => setFormData(prev => ({ ...prev, custom_rent_day: e.target.value }))}
                    placeholder="15"
                    className="w-20 ml-2"
                  />
                )}
              </div>
            </RadioGroup>
          </div>

          {/* Pets */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pet_allowed"
                checked={formData.pet_allowed}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pet_allowed: checked as boolean }))}
              />
              <Label htmlFor="pet_allowed" className="text-base font-medium">
                Pets Allowed
              </Label>
            </div>
            
            {formData.pet_allowed && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="pet_deposit">Pet Deposit ($)</Label>
                <Input
                  id="pet_deposit"
                  type="number"
                  value={formData.pet_deposit}
                  onChange={(e) => setFormData(prev => ({ ...prev, pet_deposit: e.target.value }))}
                  placeholder="500"
                  className="w-40"
                />
              </div>
            )}
          </div>

          {/* Responsibilities */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Tenant Responsibilities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {responsibilityOptions.map((responsibility) => (
                <div key={responsibility} className="flex items-center space-x-2">
                  <Checkbox
                    id={responsibility}
                    checked={formData.responsibilities.includes(responsibility)}
                    onCheckedChange={(checked) => handleResponsibilityChange(responsibility, checked as boolean)}
                  />
                  <Label htmlFor={responsibility} className="text-sm cursor-pointer">
                    {responsibility}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sublet */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sublet_allowed"
              checked={formData.sublet_allowed}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sublet_allowed: checked as boolean }))}
            />
            <Label htmlFor="sublet_allowed" className="text-base font-medium">
              Sublet Allowed
            </Label>
          </div>

          {/* Lease Notes */}
          <div className="space-y-2">
            <Label htmlFor="lease_notes">Additional Lease Notes</Label>
            <Textarea
              id="lease_notes"
              value={formData.lease_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, lease_notes: e.target.value }))}
              placeholder="Any additional clauses, terms, or special conditions..."
              rows={3}
            />
          </div>

          {/* Legal Notice */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800">
                <strong>Legal Notice:</strong> By creating this lease agreement, you acknowledge that this constitutes a legally binding contract between the landlord and tenant(s). Please ensure all information is accurate before submitting.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.property_id}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Creating Lease...' : 'Create Lease Agreement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeaseForm;
