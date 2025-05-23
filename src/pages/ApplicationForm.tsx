import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type Property = {
  id: string;
  title: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
};

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { user, profile } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    dateOfBirth: '',
    currentAddress: '',
    currentCity: '',
    currentProvince: '',
    currentPostalCode: '',
    moveInDate: '',
    employmentStatus: '',
    currentEmployer: '',
    monthlyIncome: '',
    employmentLength: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    referenceName: '',
    referencePhone: '',
    referenceRelation: '',
    hasBeenEvicted: false,
    hasPets: false,
    petDetails: '',
    numberOfOccupants: '1',
    additionalComments: '',
    consent: false
  });

  useEffect(() => {
    // If we have a propertyId, fetch the property details
    if (propertyId) {
      fetchProperty(propertyId);
    }
    
    // Pre-fill form with user data if available
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.first_name || prev.firstName,
        lastName: profile.last_name || prev.lastName,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
      }));
    }
  }, [propertyId, profile]);

  const fetchProperty = async (id: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, address, city, province, postal_code')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch property details',
          variant: 'destructive',
        });
      } else if (data) {
        setProperty(data);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "You must agree to the terms and privacy policy to submit your application.",
        variant: "destructive"
      });
      return;
    }

    if (!propertyId) {
      toast({
        title: "No Property Selected",
        description: "Please select a property to apply for.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to submit an application.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const applicationData = {
        property_id: propertyId,
        tenant_id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        current_address: formData.currentAddress,
        current_city: formData.currentCity,
        current_province: formData.currentProvince,
        current_postal_code: formData.currentPostalCode,
        employment_status: formData.employmentStatus,
        current_employer: formData.currentEmployer,
        monthly_income: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,
        employment_length: formData.employmentLength,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        emergency_contact_relation: formData.emergencyContactRelation,
        reference_name: formData.referenceName,
        reference_phone: formData.referencePhone,
        reference_relation: formData.referenceRelation,
        has_been_evicted: formData.hasBeenEvicted,
        has_pets: formData.hasPets,
        pet_details: formData.hasPets ? formData.petDetails : null,
        number_of_occupants: parseInt(formData.numberOfOccupants),
        move_in_date: formData.moveInDate,
        additional_comments: formData.additionalComments,
        status: 'pending'
      };

      const { error } = await supabase
        .from('applications')
        .insert([applicationData]);

      if (error) {
        throw error;
      }
      
      // Show success message
      toast({
        title: "Application Submitted",
        description: "Your rental application has been submitted successfully.",
      });
      
      setSubmitted(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-md p-6 max-w-md mx-auto">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">Your rental application has been received. We'll review it shortly.</p>
          <p className="text-sm text-gray-500">You'll be redirected to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Rental Application Form</h1>
          {property && (
            <div className="mb-2">
              <span className="font-semibold">Applying for:</span> {property.title || property.address}, {property.city}, {property.province}
            </div>
          )}
          <p className="text-gray-600">Please fill out all required fields to apply for this rental property.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border shadow-sm">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input 
                  id="dateOfBirth" 
                  name="dateOfBirth" 
                  type="date" 
                  value={formData.dateOfBirth} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Current Address */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentAddress">Street Address *</Label>
                <Input 
                  id="currentAddress" 
                  name="currentAddress" 
                  value={formData.currentAddress} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentCity">City *</Label>
                  <Input 
                    id="currentCity" 
                    name="currentCity" 
                    value={formData.currentCity} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentProvince">Province *</Label>
                  <Select 
                    value={formData.currentProvince}
                    onValueChange={(value) => handleSelectChange('currentProvince', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="BC">British Columbia</SelectItem>
                      <SelectItem value="MB">Manitoba</SelectItem>
                      <SelectItem value="NB">New Brunswick</SelectItem>
                      <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                      <SelectItem value="NS">Nova Scotia</SelectItem>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="PE">Prince Edward Island</SelectItem>
                      <SelectItem value="QC">Quebec</SelectItem>
                      <SelectItem value="SK">Saskatchewan</SelectItem>
                      <SelectItem value="NT">Northwest Territories</SelectItem>
                      <SelectItem value="NU">Nunavut</SelectItem>
                      <SelectItem value="YT">Yukon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPostalCode">Postal Code *</Label>
                  <Input 
                    id="currentPostalCode" 
                    name="currentPostalCode" 
                    value={formData.currentPostalCode} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Employment Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Employment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select 
                  value={formData.employmentStatus}
                  onValueChange={(value) => handleSelectChange('employmentStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullTime">Full-time</SelectItem>
                    <SelectItem value="partTime">Part-time</SelectItem>
                    <SelectItem value="selfEmployed">Self-employed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentEmployer">Current Employer</Label>
                <Input 
                  id="currentEmployer" 
                  name="currentEmployer" 
                  value={formData.currentEmployer} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (CAD)</Label>
                <Input 
                  id="monthlyIncome" 
                  name="monthlyIncome" 
                  type="number" 
                  value={formData.monthlyIncome} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentLength">Length of Employment</Label>
                <Input 
                  id="employmentLength" 
                  name="employmentLength" 
                  placeholder="e.g., 2 years, 6 months" 
                  value={formData.employmentLength} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Emergency Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Name *</Label>
                <Input 
                  id="emergencyContactName" 
                  name="emergencyContactName" 
                  value={formData.emergencyContactName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
                <Input 
                  id="emergencyContactPhone" 
                  name="emergencyContactPhone" 
                  type="tel" 
                  value={formData.emergencyContactPhone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Relationship *</Label>
                <Input 
                  id="emergencyContactRelation" 
                  name="emergencyContactRelation" 
                  value={formData.emergencyContactRelation} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Reference */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referenceName">Name</Label>
                <Input 
                  id="referenceName" 
                  name="referenceName" 
                  value={formData.referenceName} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referencePhone">Phone Number</Label>
                <Input 
                  id="referencePhone" 
                  name="referencePhone" 
                  type="tel" 
                  value={formData.referencePhone} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referenceRelation">Relationship</Label>
                <Input 
                  id="referenceRelation" 
                  name="referenceRelation" 
                  value={formData.referenceRelation} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Additional Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasBeenEvicted" 
                  checked={formData.hasBeenEvicted} 
                  onCheckedChange={(checked) => handleCheckboxChange('hasBeenEvicted', checked === true)} 
                />
                <Label htmlFor="hasBeenEvicted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Have you ever been evicted?
                </Label>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasPets" 
                    checked={formData.hasPets} 
                    onCheckedChange={(checked) => handleCheckboxChange('hasPets', checked === true)} 
                  />
                  <Label htmlFor="hasPets" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Do you have pets?
                  </Label>
                </div>
                
                {formData.hasPets && (
                  <div className="pl-6 pt-2">
                    <Label htmlFor="petDetails">Pet Details</Label>
                    <Textarea 
                      id="petDetails" 
                      name="petDetails" 
                      placeholder="Type, breed, size, etc." 
                      value={formData.petDetails} 
                      onChange={handleChange} 
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numberOfOccupants">Number of Occupants</Label>
                <Select 
                  value={formData.numberOfOccupants}
                  onValueChange={(value) => handleSelectChange('numberOfOccupants', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moveInDate">Desired Move-in Date *</Label>
                <Input 
                  id="moveInDate" 
                  name="moveInDate" 
                  type="date" 
                  value={formData.moveInDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalComments">Additional Comments</Label>
                <Textarea 
                  id="additionalComments" 
                  name="additionalComments" 
                  placeholder="Any additional information you would like to share" 
                  value={formData.additionalComments} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Consent */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border text-sm">
              <h3 className="font-semibold mb-2">PIPEDA Consent</h3>
              <p className="text-gray-600">
                I consent to the collection, use, and disclosure of my personal information as described in the Privacy Policy. I understand that RentPilot will use this information to process my rental application, assess my suitability as a tenant, and communicate with me about my application and potential tenancy. I have the right to withdraw consent at any time by contacting RentPilot.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="consent" 
                checked={formData.consent} 
                onCheckedChange={(checked) => handleCheckboxChange('consent', checked === true)} 
                required
              />
              <Label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the <a href="/terms" className="text-rentpilot-600 hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" className="text-rentpilot-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              </Label>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-rentpilot-600 hover:bg-rentpilot-700"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
