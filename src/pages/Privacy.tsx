
import { Separator } from '@/components/ui/separator';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,213,0,0.03),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-slate-400 text-lg">Last updated: May 2023</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="prose prose-blue max-w-none text-slate-200">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Introduction</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  RentPilot ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. We comply with the Personal Information Protection and Electronic Documents Act (PIPEDA) and other applicable Canadian privacy laws.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  By using RentPilot, you consent to the collection and use of information in accordance with this policy.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Information We Collect</h2>
                <p className="mb-2 text-slate-300">We collect the following types of information:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>
                    <strong className="text-white">Personal Information:</strong> Name, email address, phone number, home address, date of birth, employment information, income details, references, and emergency contacts.
                  </li>
                  <li>
                    <strong className="text-white">Property Information:</strong> Details about rental properties, including address, type, condition, and rental terms.
                  </li>
                  <li>
                    <strong className="text-white">Usage Data:</strong> Information on how you use our service, such as features accessed, time spent, actions taken.
                  </li>
                  <li>
                    <strong className="text-white">Device Information:</strong> Browser type, IP address, device type, and operating system.
                  </li>
                </ul>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">How We Use Your Information</h2>
                <p className="mb-2 text-slate-300">We use your information for the following purposes:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>To provide and maintain our service</li>
                  <li>To create and manage rental applications and lease agreements</li>
                  <li>To communicate with you regarding your account or service updates</li>
                  <li>To improve our service and develop new features</li>
                  <li>To respond to your requests or inquiries</li>
                  <li>To comply with legal obligations</li>
                  <li>For internal administrative purposes</li>
                </ul>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Disclosure of Your Information</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  We do not sell your personal information to third parties. We may disclose your information to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>
                    <strong className="text-white">Service Providers:</strong> Third parties that help us operate our service (e.g., cloud storage, payment processors).
                  </li>
                  <li>
                    <strong className="text-white">Legal Requirements:</strong> When required by law, court order, or governmental regulations.
                  </li>
                  <li>
                    <strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.
                  </li>
                  <li>
                    <strong className="text-white">With Consent:</strong> When you have given us explicit consent to share your information.
                  </li>
                </ul>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Data Security</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Data Retention</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  We retain your personal information for as long as needed to provide our services and as necessary to comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need personal information, we securely delete or anonymize it.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Your Rights</h2>
                <p className="mb-2 text-slate-300">Under PIPEDA, you have the following rights:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>The right to access your personal information</li>
                  <li>The right to correct inaccurate or incomplete information</li>
                  <li>The right to withdraw consent at any time</li>
                  <li>The right to file a complaint with the Privacy Commissioner of Canada</li>
                </ul>
                <p className="text-slate-300 leading-relaxed">
                  To exercise these rights, please contact us using the information provided in the "Contact Us" section.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Cookies and Tracking Technologies</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
                </p>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Changes to This Privacy Policy</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Contact Us</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50">
                  <p className="mb-1 text-white"><strong>RentPilot</strong></p>
                  <p className="mb-1 text-slate-300">Email: privacy@rentpilot.ca</p>
                  <p className="mb-1 text-slate-300">Address: 123 Privacy Street, Suite 100, Toronto, ON M5V 2K7</p>
                  <p className="text-slate-300">Phone: (416) 555-0123</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
