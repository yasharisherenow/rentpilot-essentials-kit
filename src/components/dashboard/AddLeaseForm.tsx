
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

interface TenantInfo {
  [key: string]: string;
  name: string;
  emergency_contact: string;
}

const AddLeaseForm = ({ onLeaseCreated }: AddLeaseFormProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<TenantInfo[]>([{ name: '', emergency_contact: '' }]);
  
  const [formData, setFormData] = useState({
    property_id: '',
    start_date: '',
    end_date: '',
    monthly_rent: '',
    security_deposit: '',
    rent_due_day_type: '1st', // '1st', 'last', 'custom'
    custom_rent_day: '',
    pet_allowed: false,
    pet_deposit: '',
    sublet_allowed: false,
    responsibilities: [] as string[],
    lease_notes: '',
    signature_name: '',
    signature_date: new Date().toISOString().split('T')[0]
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
        .eq('landlord_id', user.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    }
  };

  const handlePropertyChange = async (propertyId: string) => {
    // Check if property already has an active lease
    try {
      const { data: existingLease, error } = await supabase
        .from('leases')
        .select('id')
        .eq('property_id', propertyId)
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking existing lease:', error);
        return;
      }

      if (existingLease) {
        toast({
          title: "Property Unavailable",
          description: "This property already has an active lease",
          variant: "destructive",
        });
        return;
      }

      const selectedProperty = properties.find(p => p.id === propertyId);
      if (selectedProperty) {
        setFormData(prev => ({
          ...prev,
          property_id: propertyId,
          monthly_rent: selectedProperty.monthly_rent.toString(),
          security_deposit: selectedProperty.monthly_rent.toString()
        }));
      }
    } catch (error) {
      console.error('Error validating property selection:', error);
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

  const addTenant = () => {
    setTenants([...tenants, { name: '', emergency_contact: '' }]);
  };

  const removeTenant = (index: number) => {
    if (tenants.length > 1) {
      setTenants(tenants.filter((_, i) => i !== index));
    }
  };

  const updateTenant = (index: number, field: keyof TenantInfo, value: string) => {
    const updated = [...tenants];
    updated[index][field] = value;
    setTenants(updated);
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
    const validTenants = tenants.filter(tenant => tenant.name.trim());
    if (validTenants.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one tenant",
        variant: "destructive",
      });
      return;
    }

    if (!formData.property_id || !formData.start_date || !formData.end_date || !formData.signature_name.trim()) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields including signature",
        variant: "destructive",
      });
      return;
    }

    // Check property availability one more time before submitting
    try {
      const { data: existingLease, error: checkError } = await supabase
        .from('leases')
        .select('id')
        .eq('property_id', formData.property_id)
        .eq('status', 'active')
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLease) {
        toast({
          title: "Error",
          description: "This property already has an active lease",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      // Prepare reminder settings with proper JSON serialization
      const reminderSettings = {
        rent_due_day: calculateRentDueDay(),
        sublet_allowed: formData.sublet_allowed,
        tenants: validTenants.map(tenant => ({
          name: tenant.name,
          emergency_contact: tenant.emergency_contact
        })),
        signature_name: formData.signature_name,
        signature_date: formData.signature_date
      };

      const { data: lease, error } = await supabase
        .from('leases')
        .insert({
          property_id: formData.property_id,
          landlord_id: user.id,
          tenant_name: validTenants.map(t => t.name).join(', '),
          lease_start_date: formData.start_date,
          lease_end_date: formData.end_date,
          monthly_rent: parseFloat(formData.monthly_rent),
          security_deposit: parseFloat(formData.security_deposit),
          pet_deposit: formData.pet_allowed ? parseFloat(formData.pet_deposit || '0') : 0,
          has_pets: formData.pet_allowed,
          special_terms: formData.lease_notes,
          status: 'active',
          utilities_included: formData.responsibilities,
          reminder_settings: reminderSettings as any
        })
        .select()
        .single();

      if (error) throw error;

      // Update property availability
      await supabase
        .from('properties')
        .update({ is_available: false })
        .eq('id', formData.property_id);

      // Prepare notification metadata with proper JSON serialization
      const notificationMetadata = {
        lease_id: lease.id,
        property_id: formData.property_id,
        tenants: validTenants.map(tenant => ({
          name: tenant.name,
          emergency_contact: tenant.emergency_contact
        }))
      };

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'lease_created',
          title: 'New Lease Created',
          description: `Lease agreement created and digitally signed by ${formData.signature_name}`,
          metadata: notificationMetadata as any,
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
        rent_due_day_type: '1st',
        custom_rent_day: '',
        pet_allowed: false,
        pet_deposit: '',
        sublet_allowed: false,
        responsibilities: [],
        lease_notes: '',
        signature_name: '',
        signature_date: new Date().toISOString().split('T')[0]
      });
      setTenants([{ name: '', emergency_contact: '' }]);
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

  // Filter available properties (ones without active leases)
  const availableProperties = properties.filter(property => {
    // This is a simplified check - in a real app you'd want to do this server-side
    return property;
  });

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
                {availableProperties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title} - {property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableProperties.length === 0 && (
              <p className="text-sm text-muted-foreground">No available properties. All properties may have active leases.</p>
            )}
          </div>

          {/* Tenants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Tenant Information *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTenant}
              >
                <Plus className="mr-1" size={14} />
                Add Tenant
              </Button>
            </div>
            {tenants.map((tenant, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Tenant {index + 1}</h4>
                  {tenants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTenant(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`tenant-name-${index}`}>Full Name *</Label>
                    <Input
                      id={`tenant-name-${index}`}
                      placeholder="John Doe"
                      value={tenant.name}
                      onChange={(e) => updateTenant(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`emergency-contact-${index}`}>Emergency Contact (Optional)</Label>
                    <Input
                      id={`emergency-contact-${index}`}
                      placeholder="(555) 123-4567"
                      value={tenant.emergency_contact}
                      onChange={(e) => updateTenant(index, 'emergency_contact', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
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

          {/* Digital Signature Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">Digital Signature</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signature_name">Signature Name *</Label>
                <Input
                  id="signature_name"
                  value={formData.signature_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, signature_name: e.target.value }))}
                  placeholder="Type your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signature_date">Signature Date *</Label>
                <Input
                  id="signature_date"
                  type="date"
                  value={formData.signature_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, signature_date: e.target.value }))}
                  required
                />
              </div>
            </div>
            {formData.signature_name && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Digital Signature Preview:</strong><br />
                  Signed by {formData.signature_name} on {formData.signature_date}
                </p>
              </div>
            )}
          </div>

          {/* Legal Notice */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800">
                <strong>Legal Notice:</strong> By creating this lease agreement, you acknowledge that this constitutes a legally binding contract between the landlord and tenant(s). The digital signature above serves as binding confirmation. Please ensure all information is accurate before submitting.
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
              disabled={isSubmitting || !formData.property_id || !formData.signature_name}
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
