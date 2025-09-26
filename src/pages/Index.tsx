
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, Shield, FileText, Calendar, Clock, CreditCard, Mail, ChevronDown, Star, Zap, Database, DollarSign
} from 'lucide-react';
import { useEffect, useState } from 'react';

const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) => (
  <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
    <div className="relative z-10">
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-xl mb-6 w-fit shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white group-hover:text-yellow-400 transition-colors duration-300">{title}</h3>
      <p className="text-slate-300 leading-relaxed">{description}</p>
    </div>
  </div>
);

const TestimonialCard = ({ quote, author, rating }: { quote: string, author: string, rating: number }) => (
  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-yellow-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-yellow-500/10">
    <div className="flex text-yellow-400 mb-6 space-x-1">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} size={20} fill="currentColor" className="drop-shadow-lg" />
      ))}
    </div>
    <p className="text-slate-200 text-lg mb-6 leading-relaxed italic">"{quote}"</p>
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-yellow-500/30">
        {author.split(' ').map(n => n[0]).join('')}
      </div>
      <p className="font-semibold text-white">- {author}</p>
    </div>
  </div>
);

const ScrollIndicator = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col items-center space-y-2 text-yellow-400">
        <span className="text-sm font-medium tracking-wider uppercase">Scroll to Explore</span>
        <ChevronDown size={24} className="animate-bounce drop-shadow-lg" />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="bg-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,213,0,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
          <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-white bg-clip-text text-transparent drop-shadow-2xl">
             Your lease, on autopilot.
            </span>
          </h1>

            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Manage leases, tenants, and documents — without spreadsheets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-12 py-6 text-lg rounded-2xl shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transition-all duration-300 border-2 border-yellow-400">
                <Link to="/application">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400 px-12 py-6 text-lg rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>

        <ScrollIndicator />
      </section>

      {/* Features Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Powered by Innovation
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Experience the future of property management with cutting-edge tools designed for modern landlords.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Zap size={32} className="text-black" />}
              title="Digital Lease Generator"
              description="Create professional lease agreements in seconds with our AI-powered generator."
            />
            <FeatureCard 
              icon={<ClipboardCheck size={32} className="text-black" />}
              title="Property & Tenant Management"
              description="Streamline your entire portfolio with intelligent tenant and property tracking."
            />
            <FeatureCard 
              icon={<Database size={32} className="text-black" />}
              title="PIPEDA-Compliant Storage"
              description="Secure, encrypted document storage that meets all Canadian privacy regulations."
            />
            <FeatureCard 
              icon={<DollarSign size={32} className="text-black" />}
              title="Simple Pricing"
              description="Transparent pricing from $9.99-$19.99. No hidden fees, no surprises."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Trusted by Landlords
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Join hundreds of Canadian landlords who have transformed their rental management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="RentPilot has completely revolutionized how I manage my properties. The digital lease generator alone saves me hours every week."
              author="Sarah Chen"
              rating={5}
            />
            <TestimonialCard 
              quote="Finally, a property management tool that actually understands small landlords. Clean, powerful, and affordable."
              author="Michael Torres"
              rating={5}
            />
            <TestimonialCard 
              quote="The PIPEDA compliance gives me peace of mind, and my tenants love the digital application process. It's a win-win."
              author="Jennifer Walsh"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-slate-950 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,213,0,0.15),transparent_70%)]" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-yellow-400 via-yellow-300 to-white bg-clip-text text-transparent">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the revolution in property management. Start your free trial today and see why landlords are making the switch to RentPilot.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-16 py-8 text-xl rounded-2xl shadow-2xl shadow-yellow-500/40 hover:shadow-yellow-500/60 hover:scale-105 transition-all duration-300 border-2 border-yellow-400">
            <Link to="/application">Start Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="relative py-24 border-t border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-black" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl shadow-2xl shadow-yellow-500/30">
              <Mail size={48} className="text-black" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold mb-4 text-white">Questions? We're Here to Help</h3>
              <p className="text-slate-300 text-lg leading-relaxed">Connect with our team to discover how RentPilot can transform your rental business.</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-8 py-4 rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transition-all duration-300">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
