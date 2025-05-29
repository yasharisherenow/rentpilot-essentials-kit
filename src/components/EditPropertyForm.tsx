
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

type Property = {
  id: string;
  title: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  monthly_rent: number;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  unit_count?: number;
  description?: string;
  property_type?: string;
  amenities?: string[];
};

type PropertyFormData = {
  title: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  unit_count: number;
  description: string;
  property_type: string;
};

type EditPropertyFormProps = {
  property: Property;
  onPropertyUpdated: () => void;
};

const EditPropertyForm = ({ property, onPropertyUpdated }: EditPropertyFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const form = useForm<PropertyFormData>({
    defaultValues: {
      title: '',
      address: '',
      city: '',
      province: '',
      postal_code: '',
      monthly_rent: 0,
      bedrooms: 0,
      bathrooms: 0,
      square_feet: 0,
      unit_count: 1,
      description: '',
      property_type: '',
    },
  });

  useEffect(() => {
    if (property && isOpen) {
      form.reset({
        title: property.title || '',
        address: property.address || '',
        city: property.city || '',
        province: property.province || '',
        postal_code: property.postal_code || '',
        monthly_rent: property.monthly_rent || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        square_feet: property.square_feet || 0,
        unit_count: property.unit_count || 1,
        description: property.description || '',
        property_type: property.property_type || '',
      });
    }
  }, [property, isOpen, form]);

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to edit properties",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: data.title,
          address: data.address,
          city: data.city,
          province: data.province,
          postal_code: data.postal_code,
          monthly_rent: data.monthly_rent,
          bedrooms: data.bedrooms || null,
          bathrooms: data.bathrooms || null,
          square_feet: data.square_feet || null,
          unit_count: data.unit_count,
          description: data.description || null,
          property_type: data.property_type || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', property.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property updated successfully",
      });

      setIsOpen(false);
      onPropertyUpdated();
    } catch (error: any) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white">
          <Edit className="mr-2" size={16} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Property</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update your property details. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Property Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Beautiful downtown apartment" 
                      {...field} 
                      className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123 Main Street" 
                      {...field} 
                      className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">City</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Toronto" 
                        {...field} 
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Province</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ON" 
                        {...field} 
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Postal Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="M5V 3A8" 
                        {...field} 
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="monthly_rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Monthly Rent ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))} 
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Bedrooms</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))} 
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Bathrooms</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.5" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))} 
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Unit Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))} 
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your property..."
                      className="min-h-[100px] bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
              >
                {isLoading ? 'Updating...' : 'Update Property'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyForm;
