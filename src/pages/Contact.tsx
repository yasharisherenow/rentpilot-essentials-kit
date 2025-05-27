
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
    
    console.log('Contact form submitted:', formData);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond shortly.",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,213,0,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
              Contact Us
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Have questions about RentPilot? Need help with your account or have a privacy request? We're here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-1 space-y-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:border-yellow-500/30 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl mr-4 shadow-lg shadow-yellow-500/30">
                      <Mail className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-white">Email Us</h3>
                      <p className="text-slate-400 text-sm mb-1">For general inquiries:</p>
                      <a href="mailto:info@rentpilot.ca" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                        info@rentpilot.ca
                      </a>
                      <p className="text-slate-400 text-sm mb-1 mt-2">For privacy requests:</p>
                      <a href="mailto:privacy@rentpilot.ca" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                        privacy@rentpilot.ca
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl mr-4 shadow-lg shadow-yellow-500/30">
                      <Phone className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-white">Call Us</h3>
                      <p className="text-slate-400 text-sm mb-1">Mon-Fri, 9am-5pm ET</p>
                      <a href="tel:+14165550123" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                        (416) 555-0123
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl mr-4 shadow-lg shadow-yellow-500/30">
                      <MapPin className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-white">Office</h3>
                      <address className="text-slate-400 text-sm not-italic">
                        123 Privacy Street<br />
                        Suite 100<br />
                        Toronto, ON M5V 2K7<br />
                        Canada
                      </address>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:border-yellow-500/30 transition-all duration-300">
                <h3 className="font-semibold mb-3 text-white">Privacy Requests</h3>
                <p className="text-slate-300 text-sm mb-4">
                  To submit a data request or exercise your privacy rights under PIPEDA, please email us at privacy@rentpilot.ca or use the contact form.
                </p>
                <p className="text-slate-300 text-sm">
                  We will respond to all requests within 30 days as required by Canadian privacy regulations.
                </p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 shadow-lg hover:border-yellow-500/30 transition-all duration-300">
                <h2 className="text-2xl font-bold mb-6 text-white">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      className="bg-slate-800/50 border-slate-600 focus:border-yellow-500 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className="bg-slate-800/50 border-slate-600 focus:border-yellow-500 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => handleSelectChange('subject', value)}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-600 focus:border-yellow-500 text-white">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="privacy">Privacy Request</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-300">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      className="min-h-[150px] bg-slate-800/50 border-slate-600 focus:border-yellow-500 text-white placeholder:text-slate-400" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:border-yellow-500/30 hover:shadow-yellow-500/10 transition-all duration-300">
                <h3 className="font-semibold mb-3 text-white">How do I request access to my personal data?</h3>
                <p className="text-slate-300 leading-relaxed">
                  You can request access to your personal data by emailing privacy@rentpilot.ca with the subject "Data Access Request" or by using the contact form above.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:border-yellow-500/30 hover:shadow-yellow-500/10 transition-all duration-300">
                <h3 className="font-semibold mb-3 text-white">What information does RentPilot store?</h3>
                <p className="text-slate-300 leading-relaxed">
                  RentPilot stores information related to rental management, including tenant applications, lease agreements, property details, and landlord information as outlined in our Privacy Policy.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:border-yellow-500/30 hover:shadow-yellow-500/10 transition-all duration-300">
                <h3 className="font-semibold mb-3 text-white">How long does data retention last?</h3>
                <p className="text-slate-300 leading-relaxed">
                  We retain your data for as long as needed to provide our services and as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:border-yellow-500/30 hover:shadow-yellow-500/10 transition-all duration-300">
                <h3 className="font-semibold mb-3 text-white">How can I delete my account?</h3>
                <p className="text-slate-300 leading-relaxed">
                  To delete your account, please email us at support@rentpilot.ca with your request. We will process your deletion request within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
