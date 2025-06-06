
import { Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { PropertyFormData } from '../AddPropertyWizard';

interface PhotosStepProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
}

export const PhotosStep = ({ formData, setFormData }: PhotosStepProps) => {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = [...formData.photos, ...Array.from(e.target.files)];
      setFormData({ ...formData, photos: newPhotos });
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: updatedPhotos });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-slate-300">Property Photos</Label>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-700/30 transition-all duration-200">
                <div className="flex flex-col items-center justify-center py-6">
                  <Upload className="w-8 h-8 mb-2 text-slate-400" />
                  <p className="text-sm text-slate-400 text-center">
                    <span className="font-semibold">Click to upload</span> property photos
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG or JPEG (MAX. 10MB each)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                />
              </label>
            </div>
            
            {formData.photos.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">{formData.photos.length} photo(s) selected</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {formData.photos.map((photo, index) => (
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
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
