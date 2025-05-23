
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would submit the form data to your backend here
    console.log('Contact form submitted:', formData);
    
    // Simulate a form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond shortly.",
      });
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about RentPilot? Need help with your account or have a privacy request? We're here to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-rentpilot-50 p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-rentpilot-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email Us</h3>
                    <p className="text-gray-500 text-sm mb-1">For general inquiries:</p>
                    <a href="mailto:info@rentpilot.ca" className="text-rentpilot-600 hover:underline">
                      info@rentpilot.ca
                    </a>
                    <p className="text-gray-500 text-sm mb-1 mt-2">For privacy requests:</p>
                    <a href="mailto:privacy@rentpilot.ca" className="text-rentpilot-600 hover:underline">
                      privacy@rentpilot.ca
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rentpilot-50 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-rentpilot-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Call Us</h3>
                    <p className="text-gray-500 text-sm mb-1">Mon-Fri, 9am-5pm ET</p>
                    <a href="tel:+14165550123" className="text-rentpilot-600 hover:underline">
                      (416) 555-0123
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rentpilot-50 p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-rentpilot-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Office</h3>
                    <address className="text-gray-500 text-sm not-italic">
                      123 Privacy Street<br />
                      Suite 100<br />
                      Toronto, ON M5V 2K7<br />
                      Canada
                    </address>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-medium mb-3">Privacy Requests</h3>
              <p className="text-gray-600 text-sm mb-4">
                To submit a data request or exercise your privacy rights under PIPEDA, please email us at privacy@rentpilot.ca or use the contact form.
              </p>
              <p className="text-gray-600 text-sm">
                We will respond to all requests within 30 days as required by Canadian privacy regulations.
              </p>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleSelectChange('subject', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="privacy">Privacy Request</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    className="min-h-[150px]" 
                    required 
                  />
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-rentpilot-600 hover:bg-rentpilot-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold mb-2">How do I request access to my personal data?</h3>
              <p className="text-gray-600">
                You can request access to your personal data by emailing privacy@rentpilot.ca with the subject "Data Access Request" or by using the contact form above.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold mb-2">What information does RentPilot store?</h3>
              <p className="text-gray-600">
                RentPilot stores information related to rental management, including tenant applications, lease agreements, property details, and landlord information as outlined in our Privacy Policy.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold mb-2">How long does data retention last?</h3>
              <p className="text-gray-600">
                We retain your data for as long as needed to provide our services and as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold mb-2">How can I delete my account?</h3>
              <p className="text-gray-600">
                To delete your account, please email us at support@rentpilot.ca with your request. We will process your deletion request within 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
