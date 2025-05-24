
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

type LeaseFormData = {
  tenant_name: string;
  monthly_rent: number;
  security_deposit: number;
  pet_deposit: number;
  lease_start_date: string;
  lease_end_date: string;
  utilities_included: string[];
  special_terms: string;
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
      tenant_name: '',
      monthly_rent: defaultRent,
      security_deposit: defaultRent, // Default to one month's rent
      pet_deposit: 0,
      lease_start_date: '',
      lease_end_date: '',
      utilities_included: [],
      special_terms: '',
    },
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

  const onSubmit = async (data: LeaseFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a lease",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('leases')
        .insert({
          ...data,
          property_id: propertyId,
          landlord_id: user.id,
          status: 'draft',
        });

      if (error) throw error;

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Lease Agreement</DialogTitle>
          <DialogDescription>
            Create a new lease for {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenant_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Name(s)</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe, Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            </div>

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
