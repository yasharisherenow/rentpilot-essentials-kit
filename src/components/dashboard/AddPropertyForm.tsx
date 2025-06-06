import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface AddPropertyFormProps {
  onPropertyAdded: () => void;
  onClose: () => void;
}

const amenitiesList = [
  'Parking', 'Air Conditioning', 'Laundry In-Unit', 'Laundry In-Building', 
  'Dishwasher', 'Pool', 'Gym', 'Balcony', 'Fireplace', 'Pet Friendly',
  'Storage', 'Elevator', 'Garden', 'Garage'
];

const AddPropertyForm = ({ onPropertyAdded, onClose }: AddPropertyFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    unit_count: 1,
    property_type: 'Apartment',
    monthly_rent: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    amenities: [] as string[],
    description: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
    } else {
      setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Property title is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Address is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.city.trim()) {
      toast({
        title: "Validation Error",
        description: "City is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.province.trim()) {
      toast({
        title: "Validation Error",
        description: "Province is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.postal_code.trim()) {
      toast({
        title: "Validation Error",
        description: "Postal code is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.monthly_rent || parseFloat(formData.monthly_rent) <= 0) {
      toast({
        title: "Validation Error",
        description: "Valid monthly rent is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const uploadPhotos = async (propertyId: string): Promise<string[]> => {
    const photoUrls: string[] = [];
    
    for (const photo of photos) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a property",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
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

      if (error) {
        console.error('Property insert error:', error);
        throw error;
      }

      if (photos.length > 0) {
        const photoUrls = await uploadPhotos(property.id);
        console.log('Uploaded photo URLs:', photoUrls);
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

      toast({
        title: "Success",
        description: "Property added successfully!",
      });

      setFormData({
        title: '',
        address: '',
        city: '',
        province: '',
        postal_code: '',
        unit_count: 1,
        property_type: 'Apartment',
        monthly_rent: '',
        bedrooms: '',
        bathrooms: '',
        square_feet: '',
        amenities: [],
        description: ''
      });
      setPhotos([]);

      onPropertyAdded();
      onClose();
    } catch (error: any) {
      console.error('Error adding property:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl max-h-[95vh] flex flex-col mx-auto">
        <Card className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl flex flex-col h-full">
          <CardHeader className="flex-shrink-0 pb-4 px-4 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg sm:text-xl text-white">Add New Property</CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  Add a property to your rental portfolio
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
                <X size={18} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300 text-sm">Property Name *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Sunny Downtown Apartment"
                    required
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="property_type" className="text-slate-300 text-sm">Property Type</Label>
                  <Input
                    id="property_type"
                    value={formData.property_type}
                    onChange={(e) => handleInputChange('property_type', e.target.value)}
                    placeholder="Apartment, House, Condo"
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 h-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-300 text-sm">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                  required
                  className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 h-9"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-300 text-sm">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Toronto"
                    required
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-slate-300 text-sm">Province *</Label>
                  <Input
                    id="province"
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    placeholder="ON"
                    required
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postal_code" className="text-slate-300 text-sm">Postal Code *</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    placeholder="M5V 3A8"
                    required
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_rent" className="text-slate-300 text-sm">Monthly Rent *</Label>
                  <Input
                    id="monthly_rent"
                    type="number"
                    value={formData.monthly_rent}
                    onChange={(e) => handleInputChange('monthly_rent', e.target.value)}
                    placeholder="2500"
                    required
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="text-slate-300 text-sm">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    placeholder="2"
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="text-slate-300 text-sm">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    placeholder="1.5"
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 h-9"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit_count" className="text-slate-300 text-sm">Unit Count</Label>
                  <Input
                    id="unit_count"
                    type="number"
                    value={formData.unit_count}
                    onChange={(e) => handleInputChange('unit_count', parseInt(e.target.value))}
                    placeholder="1"
                    min="1"
                    className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 h-9"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-300 text-sm">Amenities</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                        className="border-slate-600 text-yellow-400"
                      />
                      <Label htmlFor={amenity} className="text-slate-300 text-xs cursor-pointer leading-tight">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-300 text-sm">Property Photos</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-700/30 transition-all duration-200">
                      <div className="flex flex-col items-center justify-center py-2">
                        <Upload className="w-5 h-5 mb-1 text-slate-400" />
                        <p className="text-xs text-slate-400">
                          <span className="font-semibold">Click to upload</span> photos
                        </p>
                      </div>
                      <input type="file" className="hidden" multiple accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                  
                  {photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 max-h-24 overflow-y-auto">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Property photo ${index + 1}`}
                            className="w-full h-14 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300 text-sm">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Beautiful property with modern amenities..."
                  className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 min-h-[60px] resize-none"
                  rows={3}
                />
              </div>
            </form>
          </CardContent>

          <div className="flex-shrink-0 bg-gradient-to-t from-slate-900/90 to-transparent p-4 sm:p-6 border-t border-slate-700/30">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold h-10"
              >
                {isSubmitting ? 'Adding...' : 'Add Property'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddPropertyForm;
