
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, Shield, FileText, Calendar, Clock, CreditCard, Mail
} from 'lucide-react';

const FeatureItem = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row gap-4 items-start border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-all animate-fade-up">
    <div className="bg-rentpilot-50 p-3 rounded-lg text-rentpilot-600">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-rentpilot-50 section-padding">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Property management <span className="gradient-text">simplified</span> for small landlords
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Streamline your rental process with digital applications, leases, and documents. Perfect for landlords with 1-5 units.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-rentpilot-600 hover:bg-rentpilot-700">
                  <Link to="/application">Get Started for Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="RentPilot Dashboard" 
                className="rounded-lg shadow-xl max-w-full" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage your rentals</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No more paperwork hassles. Just simple, digital tools designed for small landlords.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureItem 
              icon={<ClipboardCheck size={24} />}
              title="Digital Applications"
              description="Collect and review tenant applications online with standardized forms."
            />
            <FeatureItem 
              icon={<FileText size={24} />}
              title="Digital Lease Agreements"
              description="Create, send, and sign lease agreements securely online."
            />
            <FeatureItem 
              icon={<Calendar size={24} />}
              title="Important Date Reminders"
              description="Never miss a lease renewal or important deadline again."
            />
            <FeatureItem 
              icon={<Shield size={24} />}
              title="PIPEDA Compliant"
              description="Your data is handled according to Canadian privacy regulations."
            />
            <FeatureItem 
              icon={<Clock size={24} />}
              title="Save Time"
              description="Eliminate paperwork and administrative tasks with digital workflows."
            />
            <FeatureItem 
              icon={<CreditCard size={24} />}
              title="Affordable Plans"
              description="Simple pricing designed for small landlords, not large property companies."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-rentpilot-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to simplify your rental management?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join hundreds of Canadian landlords who are saving time and reducing stress with RentPilot.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/application">Get Started Now</Link>
          </Button>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by landlords across Canada</h2>
            <p className="text-xl text-gray-600">Hear from some of our satisfied customers.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"RentPilot has saved me so much time with my rental properties. The digital lease process alone is worth it."</p>
              <p className="font-medium">- Sarah T., Vancouver</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"As someone with just two rental properties, I needed something simple but professional. RentPilot delivers exactly that."</p>
              <p className="font-medium">- Michael L., Toronto</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"The tenant application process is so streamlined now. I love how everything is organized in one place."</p>
              <p className="font-medium">- David K., Montreal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="bg-rentpilot-50 p-4 rounded-full">
              <Mail size={32} className="text-rentpilot-600" />
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-semibold mb-2">Have questions?</h3>
              <p className="text-gray-600 mb-0">We're here to help you get the most out of RentPilot.</p>
            </div>
            <Button asChild className="bg-rentpilot-600 hover:bg-rentpilot-700">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
