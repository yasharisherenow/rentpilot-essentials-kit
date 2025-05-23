
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const LeaseForm = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Property Details
    propertyAddress: '',
    propertyCity: '',
    propertyProvince: '',
    propertyPostalCode: '',
    propertyType: '',
    unitNumber: '',
    
    // Landlord Details
    landlordName: '',
    landlordAddress: '',
    landlordPhone: '',
    landlordEmail: '',
    
    // Tenant Details
    tenantName: '',
    tenantPhone: '',
    tenantEmail: '',
    additionalTenants: '',
    
    // Lease Terms
    leaseStartDate: '',
    leaseEndDate: '',
    leaseType: 'fixed', // fixed or month-to-month
    monthlyRent: '',
    securityDeposit: '',
    rentDueDay: '1',
    lateFeesApply: true,
    lateFeeAmount: '',
    
    // Utilities
    utilitiesIncluded: [],
    tenantPaysUtilities: [],
    parkingIncluded: false,
    parkingFee: '',
    
    // Additional Terms
    petsAllowed: false,
    petDeposit: '',
    smokingAllowed: false,
    sublettingAllowed: false,
    additionalTerms: '',
    
    // Consent
    consent: false
  });

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

  const handleUtilityChange = (utility: string, isChecked: boolean, type: 'included' | 'tenant') => {
    const fieldName = type === 'included' ? 'utilitiesIncluded' : 'tenantPaysUtilities';
    
    setFormData(prev => {
      const currentUtilities = [...prev[fieldName] as string[]];
      
      if (isChecked) {
        return { ...prev, [fieldName]: [...currentUtilities, utility] };
      } else {
        return { ...prev, [fieldName]: currentUtilities.filter(item => item !== utility) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "You must agree to the terms and privacy policy to submit this lease form.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would submit the form data to your backend here
    console.log('Lease form submitted:', formData);
    
    // Show success message
    toast({
      title: "Lease Form Submitted",
      description: "Your lease document has been generated successfully.",
    });
    
    setSubmitted(true);
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-md p-6 max-w-md mx-auto">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Lease Document Generated!</h2>
          <p className="text-gray-600 mb-4">Your lease document has been created and saved to your account.</p>
          <p className="text-sm text-gray-500">You'll be redirected to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Create Lease Document</h1>
          <p className="text-gray-600">Fill out the form below to generate a residential lease agreement.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border shadow-sm">
          {/* Property Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Street Address *</Label>
                <Input 
                  id="propertyAddress" 
                  name="propertyAddress" 
                  value={formData.propertyAddress} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitNumber">Unit/Apt Number</Label>
                  <Input 
                    id="unitNumber" 
                    name="unitNumber" 
                    value={formData.unitNumber} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select 
                    value={formData.propertyType}
                    onValueChange={(value) => handleSelectChange('propertyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="basement">Basement Suite</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyCity">City *</Label>
                  <Input 
                    id="propertyCity" 
                    name="propertyCity" 
                    value={formData.propertyCity} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyProvince">Province *</Label>
                  <Select 
                    value={formData.propertyProvince}
                    onValueChange={(value) => handleSelectChange('propertyProvince', value)}
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
                  <Label htmlFor="propertyPostalCode">Postal Code *</Label>
                  <Input 
                    id="propertyPostalCode" 
                    name="propertyPostalCode" 
                    value={formData.propertyPostalCode} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Landlord Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Landlord Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="landlordName">Full Name *</Label>
                <Input 
                  id="landlordName" 
                  name="landlordName" 
                  value={formData.landlordName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landlordPhone">Phone Number *</Label>
                <Input 
                  id="landlordPhone" 
                  name="landlordPhone" 
                  type="tel" 
                  value={formData.landlordPhone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="landlordAddress">Address</Label>
                <Input 
                  id="landlordAddress" 
                  name="landlordAddress" 
                  value={formData.landlordAddress} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landlordEmail">Email *</Label>
                <Input 
                  id="landlordEmail" 
                  name="landlordEmail" 
                  type="email" 
                  value={formData.landlordEmail} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Tenant Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Tenant Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenantName">Primary Tenant Name *</Label>
                <Input 
                  id="tenantName" 
                  name="tenantName" 
                  value={formData.tenantName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantPhone">Phone Number *</Label>
                <Input 
                  id="tenantPhone" 
                  name="tenantPhone" 
                  type="tel" 
                  value={formData.tenantPhone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantEmail">Email *</Label>
                <Input 
                  id="tenantEmail" 
                  name="tenantEmail" 
                  type="email" 
                  value={formData.tenantEmail} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="additionalTenants">Additional Tenants (if any)</Label>
                <Textarea 
                  id="additionalTenants" 
                  name="additionalTenants" 
                  placeholder="List full names of all additional tenants" 
                  value={formData.additionalTenants} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Lease Terms */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Lease Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leaseStartDate">Lease Start Date *</Label>
                <Input 
                  id="leaseStartDate" 
                  name="leaseStartDate" 
                  type="date" 
                  value={formData.leaseStartDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseEndDate">Lease End Date *</Label>
                <Input 
                  id="leaseEndDate" 
                  name="leaseEndDate" 
                  type="date" 
                  value={formData.leaseEndDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseType">Lease Type *</Label>
                <Select 
                  value={formData.leaseType}
                  onValueChange={(value) => handleSelectChange('leaseType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Term</SelectItem>
                    <SelectItem value="month-to-month">Month-to-Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent (CAD) *</Label>
                <Input 
                  id="monthlyRent" 
                  name="monthlyRent" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.monthlyRent} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit (CAD) *</Label>
                <Input 
                  id="securityDeposit" 
                  name="securityDeposit" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.securityDeposit} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentDueDay">Rent Due Day *</Label>
                <Select 
                  value={formData.rentDueDay}
                  onValueChange={(value) => handleSelectChange('rentDueDay', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(28)].map((_, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} of the month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="lateFeesApply" 
                    checked={formData.lateFeesApply} 
                    onCheckedChange={(checked) => handleCheckboxChange('lateFeesApply', checked === true)} 
                  />
                  <Label htmlFor="lateFeesApply">Apply Late Fees</Label>
                </div>
                
                {formData.lateFeesApply && (
                  <div className="pl-6 space-y-2">
                    <Label htmlFor="lateFeeAmount">Late Fee Amount (CAD)</Label>
                    <Input 
                      id="lateFeeAmount" 
                      name="lateFeeAmount" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={formData.lateFeeAmount} 
                      onChange={handleChange} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Utilities and Parking */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Utilities & Parking</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium mb-2">Utilities included in rent:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Water', 'Electricity', 'Heat', 'Internet', 'Cable TV', 'Gas'].map((utility) => (
                    <div key={`included-${utility}`} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`included-${utility}`} 
                        checked={(formData.utilitiesIncluded as string[]).includes(utility)} 
                        onCheckedChange={(checked) => handleUtilityChange(utility, checked === true, 'included')} 
                      />
                      <Label htmlFor={`included-${utility}`}>{utility}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Utilities paid by tenant:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Water', 'Electricity', 'Heat', 'Internet', 'Cable TV', 'Gas'].map((utility) => (
                    <div key={`tenant-${utility}`} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`tenant-${utility}`} 
                        checked={(formData.tenantPaysUtilities as string[]).includes(utility)} 
                        onCheckedChange={(checked) => handleUtilityChange(utility, checked === true, 'tenant')} 
                      />
                      <Label htmlFor={`tenant-${utility}`}>{utility}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="parkingIncluded" 
                    checked={formData.parkingIncluded} 
                    onCheckedChange={(checked) => handleCheckboxChange('parkingIncluded', checked === true)} 
                  />
                  <Label htmlFor="parkingIncluded">Parking Included</Label>
                </div>
                
                {formData.parkingIncluded && (
                  <div className="pl-6 space-y-2">
                    <Label htmlFor="parkingFee">Monthly Parking Fee (if any, CAD)</Label>
                    <Input 
                      id="parkingFee" 
                      name="parkingFee" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={formData.parkingFee} 
                      onChange={handleChange} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Additional Terms */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Additional Terms</h2>
            
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="petsAllowed" 
                    checked={formData.petsAllowed} 
                    onCheckedChange={(checked) => handleCheckboxChange('petsAllowed', checked === true)} 
                  />
                  <Label htmlFor="petsAllowed">Pets Allowed</Label>
                </div>
                
                {formData.petsAllowed && (
                  <div className="pl-6 space-y-2">
                    <Label htmlFor="petDeposit">Pet Deposit (CAD)</Label>
                    <Input 
                      id="petDeposit" 
                      name="petDeposit" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={formData.petDeposit} 
                      onChange={handleChange} 
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="smokingAllowed" 
                  checked={formData.smokingAllowed} 
                  onCheckedChange={(checked) => handleCheckboxChange('smokingAllowed', checked === true)} 
                />
                <Label htmlFor="smokingAllowed">Smoking Allowed</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sublettingAllowed" 
                  checked={formData.sublettingAllowed} 
                  onCheckedChange={(checked) => handleCheckboxChange('sublettingAllowed', checked === true)} 
                />
                <Label htmlFor="sublettingAllowed">Subletting Allowed</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalTerms">Additional Terms & Conditions</Label>
                <Textarea 
                  id="additionalTerms" 
                  name="additionalTerms" 
                  placeholder="Enter any additional terms or conditions for this lease agreement" 
                  value={formData.additionalTerms} 
                  onChange={handleChange} 
                  className="min-h-[100px]"
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
                I consent to the collection, use, and disclosure of my personal information as described in the Privacy Policy. I understand that RentPilot will use this information to generate lease documents and for related rental management purposes. I have the right to withdraw consent at any time by contacting RentPilot.
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
            <Button type="submit" className="w-full bg-rentpilot-600 hover:bg-rentpilot-700">Generate Lease Document</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaseForm;
