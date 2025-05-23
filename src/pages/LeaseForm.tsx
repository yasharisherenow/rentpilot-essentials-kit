
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define form schema for validation
const leaseFormSchema = z.object({
  propertyId: z.string({
    required_error: "Please select a property",
  }),
  tenantName: z.string().min(1, "Tenant name is required"),
  tenantEmail: z.string().email("Please enter a valid email"),
  leaseStartDate: z.string().min(1, "Start date is required"),
  leaseEndDate: z.string().min(1, "End date is required"),
  monthlyRent: z.string().min(1, "Monthly rent is required"),
  securityDeposit: z.string().min(1, "Security deposit is required"),
  petDeposit: z.string().optional(),
  utilitiesIncluded: z.string().optional(),
  specialTerms: z.string().optional(),
});

type Property = {
  id: string;
  title: string;
  address: string;
  city: string;
  province: string;
};

const LeaseForm = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  
  // Initialize the form with validation
  const form = useForm<z.infer<typeof leaseFormSchema>>({
    resolver: zodResolver(leaseFormSchema),
    defaultValues: {
      propertyId: "",
      tenantName: "",
      tenantEmail: "",
      leaseStartDate: format(new Date(), 'yyyy-MM-dd'),
      leaseEndDate: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd'),
      monthlyRent: "",
      securityDeposit: "",
      petDeposit: "0",
      utilitiesIncluded: "",
      specialTerms: "",
    },
  });

  // Fetch landlord's properties
  useEffect(() => {
    if (!user) return;
    
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, address, city, province')
          .eq('landlord_id', user.id);
          
        if (error) throw error;
        setProperties(data || []);
        
        if (data && data.length > 0) {
          form.setValue('propertyId', data[0].id);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your properties.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [user]);

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof leaseFormSchema>) => {
    if (!user || !profile) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create a lease.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Convert string values to appropriate types
      const leaseData = {
        property_id: data.propertyId,
        landlord_id: user.id,
        tenant_name: data.tenantName,
        tenant_email: data.tenantEmail,
        lease_start_date: data.leaseStartDate,
        lease_end_date: data.leaseEndDate,
        monthly_rent: parseFloat(data.monthlyRent),
        security_deposit: parseFloat(data.securityDeposit),
        pet_deposit: data.petDeposit ? parseFloat(data.petDeposit) : 0,
        utilities_included: data.utilitiesIncluded ? data.utilitiesIncluded.split(',').map(item => item.trim()) : [],
        special_terms: data.specialTerms,
        status: 'draft',
      };
      
      const { error } = await supabase
        .from('leases')
        .insert([leaseData]);
        
      if (error) throw error;
      
      toast({
        title: 'Lease created',
        description: 'Your lease has been successfully created.',
      });
      
      // Redirect to dashboard after successful creation
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error creating lease:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create lease. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rentpilot-600"></div>
      </div>
    );
  }
  
  // Check if landlord has any properties
  if (!isLoading && properties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card>
          <CardHeader>
            <CardTitle>No Properties Found</CardTitle>
            <CardDescription>
              You need to add a property before you can create a lease.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Please add a property to your account first.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-rentpilot-600 hover:bg-rentpilot-700"
            >
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Lease</CardTitle>
          <CardDescription>
            Fill in the details below to generate a lease agreement.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Property Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Property Information</h3>
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Property</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.title || property.address}, {property.city}, {property.province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Tenant Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tenant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tenantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenant Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tenantEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenant Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="tenant@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Lease Terms */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Lease Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="leaseStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="leaseEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Financial Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Financial Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="monthlyRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rent (CAD)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="securityDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit (CAD)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="petDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Deposit (CAD, if applicable)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Additional Terms */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Terms</h3>
                
                <FormField
                  control={form.control}
                  name="utilitiesIncluded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Utilities Included (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="water, heat, electricity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specialTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Terms and Conditions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any special terms or conditions that apply to this lease..." 
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-rentpilot-600 hover:bg-rentpilot-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Lease...' : 'Create Lease'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default LeaseForm;
