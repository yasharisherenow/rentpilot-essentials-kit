
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

type TenantInfo = {
  name: string;
  email: string;
  phone: string;
  is_primary: boolean;
};

type LeaseFormData = {
  tenants: TenantInfo[];
  monthly_rent: number;
  security_deposit: number;
  pet_deposit: number;
  lease_start_date: string;
  lease_end_date: string;
  utilities_included: string[];
  special_terms: string;
  has_pets: boolean;
  snow_grass_responsibility: string;
  reminder_settings: {
    lease_renewal_days: number;
    rent_reminder_days: number;
    email_notifications: boolean;
    sms_notifications: boolean;
  };
};

type CreateLeaseFormProps = {
  propertyId: string;
  propertyTitle: string;
  defaultRent: number;
  onLeaseCreated: () => void;
};

const CreateLeaseForm = ({ propertyId, propertyTitle, defaultRent, onLeaseCreated }: CreateLeaseFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const form = useForm<LeaseFormData>({
    defaultValues: {
      tenants: [{ name: '', email: '', phone: '', is_primary: true }],
      monthly_rent: defaultRent,
      security_deposit: defaultRent,
      pet_deposit: 0,
      lease_start_date: '',
      lease_end_date: '',
      utilities_included: [],
      special_terms: '',
      has_pets: false,
      snow_grass_responsibility: '',
      reminder_settings: {
        lease_renewal_days: 60,
        rent_reminder_days: 5,
        email_notifications: true,
        sms_notifications: false,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tenants"
  });

  const utilityOptions = [
    'Electricity',
    'Gas',
    'Water',
    'Internet',
    'Cable/TV',
    'Heating',
    'Air Conditioning',
    'Garbage Collection',
  ];

  const responsibilityOptions = [
    'Tenant responsible for both',
    'Landlord responsible for both', 
    'Tenant responsible for grass, landlord for snow',
    'Landlord responsible for grass, tenant for snow',
    'As per municipal bylaws',
    'To be discussed case by case'
  ];

  const watchHasPets = form.watch('has_pets');

  const onSubmit = async (data: LeaseFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a lease",
        variant: "destructive",
      });
      return;
    }

    // Check if property already has an active lease
    const { data: existingLease, error: checkError } = await supabase
      .from('leases')
      .select('id')
      .eq('property_id', propertyId)
      .eq('status', 'active')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing lease:', checkError);
      toast({
        title: "Error",
        description: "Failed to check existing leases",
        variant: "destructive",
      });
      return;
    }

    if (existingLease) {
      toast({
        title: "Error",
        description: "This property already has an active lease",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create the lease
      const { data: lease, error: leaseError } = await supabase
        .from('leases')
        .insert({
          property_id: propertyId,
          landlord_id: user.id,
          tenant_name: data.tenants.map(t => t.name).join(', '),
          monthly_rent: data.monthly_rent,
          security_deposit: data.security_deposit,
          pet_deposit: data.has_pets ? data.pet_deposit : 0,
          lease_start_date: data.lease_start_date,
          lease_end_date: data.lease_end_date,
          utilities_included: data.utilities_included,
          special_terms: data.special_terms,
          has_pets: data.has_pets,
          snow_grass_responsibility: data.snow_grass_responsibility,
          reminder_settings: data.reminder_settings,
          status: 'draft',
        })
        .select()
        .single();

      if (leaseError) throw leaseError;

      // Create tenant records
      const tenantRecords = data.tenants.map(tenant => ({
        lease_id: lease.id,
        tenant_name: tenant.name,
        tenant_email: tenant.email,
        tenant_phone: tenant.phone,
        is_primary: tenant.is_primary,
      }));

      const { error: tenantsError } = await supabase
        .from('lease_tenants')
        .insert(tenantRecords);

      if (tenantsError) throw tenantsError;

      toast({
        title: "Success",
        description: "Lease created successfully",
      });

      form.reset();
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
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2" size={16} />
          Create Lease
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Lease Agreement</DialogTitle>
          <DialogDescription>
            Create a new lease for {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tenant Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Tenant Information</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: '', email: '', phone: '', is_primary: false })}
                >
                  <Plus className="mr-2" size={16} />
                  Add Tenant
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Tenant {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`tenants.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`tenants.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`tenants.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`tenants.${index}.is_primary`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Primary contact</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="monthly_rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rent ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="security_deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Deposit ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {watchHasPets && (
                <FormField
                  control={form.control}
                  name="pet_deposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Deposit ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Lease Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lease_start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lease Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lease_end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lease End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pet Information */}
            <FormField
              control={form.control}
              name="has_pets"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Do tenants have pets?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Snow/Grass Responsibility */}
            <FormField
              control={form.control}
              name="snow_grass_responsibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Snow Shoveling & Grass Cutting Responsibility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select responsibility arrangement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {responsibilityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Utilities */}
            <FormField
              control={form.control}
              name="utilities_included"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Utilities Included</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {utilityOptions.map((utility) => (
                      <div key={utility} className="flex items-center space-x-2">
                        <Checkbox
                          id={utility}
                          checked={field.value.includes(utility)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, utility]);
                            } else {
                              field.onChange(field.value.filter(u => u !== utility));
                            }
                          }}
                        />
                        <label
                          htmlFor={utility}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {utility}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reminder Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Reminder Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reminder_settings.lease_renewal_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lease Renewal Reminder (days before)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reminder_settings.rent_reminder_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent Due Reminder (days before)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="reminder_settings.email_notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Email notifications</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reminder_settings.sms_notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>SMS notifications</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Special Terms */}
            <FormField
              control={form.control}
              name="special_terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Terms & Conditions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special terms, conditions, or clauses for this lease..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-rentpilot-600 hover:bg-rentpilot-700">
                {isLoading ? 'Creating...' : 'Create Lease'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeaseForm;
