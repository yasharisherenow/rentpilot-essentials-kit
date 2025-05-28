
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
import { Upload, X, Plus } from 'lucide-react';

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
    property_group: '',
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
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Insert property first
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
          property_group: formData.property_group || null,
          description: formData.description || null,
          is_available: true
        })
        .select()
        .single();

      if (error) throw error;

      // Upload photos if any
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        photoUrls = await uploadPhotos(property.id);
        
        // Update property with photo URLs
        await supabase
          .from('properties')
          .update({ photos: photoUrls })
          .eq('id', property.id);
      }

      // Create notification
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

      onPropertyAdded();
      onClose();
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error",
        description: "Failed to add property",
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
            <CardTitle className="text-2xl text-white">Add New Property</CardTitle>
            <CardDescription className="text-slate-400">
              Add a property to your rental portfolio
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
              <Label htmlFor="title" className="text-slate-300">Property Name *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Sunny Downtown Apartment"
                required
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property_type" className="text-slate-300">Property Type</Label>
              <Input
                id="property_type"
                value={formData.property_type}
                onChange={(e) => handleInputChange('property_type', e.target.value)}
                placeholder="Apartment, House, Condo"
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-300">Street Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Main Street"
              required
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-slate-300">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Toronto"
                required
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
                required
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postal_code" className="text-slate-300">Postal Code *</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="M5V 3A8"
                required
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <Label htmlFor="bedrooms" className="text-slate-300">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="2"
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="text-slate-300">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                placeholder="1.5"
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit_count" className="text-slate-300">Unit Count</Label>
              <Input
                id="unit_count"
                type="number"
                value={formData.unit_count}
                onChange={(e) => handleInputChange('unit_count', parseInt(e.target.value))}
                placeholder="1"
                min="1"
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-slate-300">Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    className="border-slate-600 text-yellow-400"
                  />
                  <Label htmlFor={amenity} className="text-slate-300 text-sm cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-slate-300">Property Photos</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-800/30 hover:bg-slate-700/30 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-400">
                      <span className="font-semibold">Click to upload</span> property photos
                    </p>
                  </div>
                  <input type="file" className="hidden" multiple accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
              
              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Property photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Beautiful property with modern amenities..."
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
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
            >
              {isSubmitting ? 'Adding Property...' : 'Add Property'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPropertyForm;
