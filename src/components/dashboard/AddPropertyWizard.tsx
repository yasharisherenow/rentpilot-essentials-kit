
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { BasicInfoStep } from './wizard/BasicInfoStep';
import { AddressStep } from './wizard/AddressStep';
import { AmenitiesStep } from './wizard/AmenitiesStep';
import { PhotosStep } from './wizard/PhotosStep';
import { ReviewStep } from './wizard/ReviewStep';

interface AddPropertyWizardProps {
  onPropertyAdded: () => void;
  onClose: () => void;
}

export interface PropertyFormData {
  title: string;
  property_type: string;
  monthly_rent: string;
  unit_count: number;
  bedrooms: string;
  bathrooms: string;
  square_feet: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  amenities: string[];
  description: string;
  photos: File[];
}

const AddPropertyWizard = ({ onPropertyAdded, onClose }: AddPropertyWizardProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    property_type: 'Apartment',
    monthly_rent: '',
    unit_count: 1,
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    amenities: [],
    description: '',
    photos: []
  });

  const steps = [
    { id: 1, title: 'Basic Info', component: BasicInfoStep },
    { id: 2, title: 'Address', component: AddressStep },
    { id: 3, title: 'Amenities', component: AmenitiesStep },
    { id: 4, title: 'Photos', component: PhotosStep },
    { id: 5, title: 'Review', component: ReviewStep }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) {
          toast({ title: "Error", description: "Property name is required", variant: "destructive" });
          return false;
        }
        if (!formData.monthly_rent || parseFloat(formData.monthly_rent) <= 0) {
          toast({ title: "Error", description: "Valid monthly rent is required", variant: "destructive" });
          return false;
        }
        break;
      case 2:
        if (!formData.address.trim() || !formData.city.trim() || !formData.province.trim() || !formData.postal_code.trim()) {
          toast({ title: "Error", description: "All address fields are required", variant: "destructive" });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const uploadPhotos = async (propertyId: string): Promise<string[]> => {
    const photoUrls: string[] = [];
    
    for (const photo of formData.photos) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${user!.id}/${propertyId}/${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('property-photos')
        .upload(fileName, photo);
      
      if (error) {
        console.error('Photo upload error:', error);
        continue;
      }
      
      const { data } = supabase.storage
        .from('property-photos')
        .getPublicUrl(fileName);
      
      photoUrls.push(data.publicUrl);
    }
    
    return photoUrls;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .insert({
          landlord_id: user.id,
          title: formData.title,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postal_code,
          unit_count: formData.unit_count,
          property_type: formData.property_type,
          monthly_rent: parseFloat(formData.monthly_rent),
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
          square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
          amenities: formData.amenities,
          description: formData.description || null,
          is_available: true
        })
        .select()
        .single();

      if (error) throw error;

      if (formData.photos.length > 0) {
        await uploadPhotos(property.id);
      }

      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'vacancy',
          title: 'New Property Added',
          description: `${formData.title} has been added to your portfolio`,
          metadata: { property_id: property.id },
          priority: 'medium'
        });

      toast({ title: "Success", description: "Property added successfully!" });
      onPropertyAdded();
      onClose();
    } catch (error: any) {
      console.error('Error adding property:', error);
      toast({ title: "Error", description: error.message || "Failed to add property", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        <Card className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl flex flex-col h-full">
          <CardHeader className="flex-shrink-0 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-white">Add New Property</CardTitle>
                <CardDescription className="text-slate-400">
                  Step {currentStep} of {steps.length}: {currentStepData?.title}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
                <X size={18} />
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-700/50 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto">
            {CurrentStepComponent && (
              <CurrentStepComponent 
                formData={formData}
                setFormData={setFormData}
              />
            )}
          </CardContent>

          <div className="flex-shrink-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6 border-t border-slate-700/30">
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? onClose : handleBack}
                className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
              >
                <ChevronLeft size={16} className="mr-1" />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>
              
              {currentStep === steps.length ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
                >
                  {isSubmitting ? 'Adding Property...' : 'Add Property'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddPropertyWizard;
