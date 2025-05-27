
import { Separator } from '@/components/ui/separator';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,213,0,0.03),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-slate-400 text-lg">Last updated: May 2023</p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="prose prose-blue max-w-none text-slate-200">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">1. Introduction</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  Welcome to RentPilot ("Service"). These Terms of Service ("Terms") govern your use of our web application operated by RentPilot Inc. ("we", "us", or "our").
                </p>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you do not have permission to access the Service.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">2. Definitions</h2>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li><strong className="text-white">"User":</strong> Any individual who accesses or uses the Service.</li>
                  <li><strong className="text-white">"Landlord":</strong> A User who utilizes the Service to manage rental properties.</li>
                  <li><strong className="text-white">"Tenant":</strong> An individual who rents or applies to rent a property listed by a Landlord.</li>
                  <li><strong className="text-white">"Content":</strong> Information, data, text, documents, and other materials uploaded, generated, or accessed through the Service.</li>
                </ul>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">3. Account Registration</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your account. We encourage you to use a strong password and to keep it confidential.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">4. Service Usage</h2>
                <p className="mb-2 text-slate-300">You agree to use the Service only for purposes that are permitted by:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>These Terms</li>
                  <li>Applicable laws and regulations</li>
                  <li>Generally accepted practices and guidelines</li>
                </ul>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  You agree not to engage in any activity that interferes with or disrupts the Service or the servers and networks connected to the Service.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">5. Content</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  You retain all rights to any Content you submit, post, or display on or through the Service. By submitting, posting, or displaying Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your Content in connection with providing and improving the Service.
                </p>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  You are solely responsible for all Content that you upload, post, email, transmit, or otherwise make available via the Service. We do not guarantee the accuracy, integrity, or quality of any User Content.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">6. Intellectual Property</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of RentPilot Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of Canada and foreign countries.
                </p>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of RentPilot Inc.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">7. Payment Terms</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  Some features of the Service require payment of fees. All fees are in Canadian Dollars and are non-refundable unless otherwise specified.
                </p>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  We may change our fees at any time. If we change our fees, we will provide notice of the change on the website or by email, at our option, at least 14 days before the change is to take effect.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">8. Disclaimer of Warranties</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
                </p>
                <p className="mb-4 text-slate-300">
                  RENTPILOT INC. ITS SUBSIDIARIES, AFFILIATES, AND LICENSORS DO NOT WARRANT THAT:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>THE SERVICE WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE AT ANY PARTICULAR TIME OR LOCATION;</li>
                  <li>ANY ERRORS OR DEFECTS WILL BE CORRECTED;</li>
                  <li>THE SERVICE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS;</li>
                  <li>THE RESULTS OF USING THE SERVICE WILL MEET YOUR REQUIREMENTS.</li>
                </ul>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">9. Limitation of Liability</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  IN NO EVENT SHALL RENTPILOT INC., NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE;</li>
                  <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE;</li>
                  <li>ANY CONTENT OBTAINED FROM THE SERVICE; AND</li>
                  <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT,</li>
                </ul>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">10. Indemnification</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  You agree to defend, indemnify, and hold harmless RentPilot Inc., its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">11. Termination</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">12. Governing Law</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  These Terms shall be governed and construed in accordance with the laws of Canada and the Province of Ontario, without regard to its conflict of law provisions.
                </p>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">13. Changes to Terms</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
                </p>
              </section>
              
              <Separator className="my-8 bg-slate-700" />
              
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-yellow-400">14. Contact Us</h2>
                <p className="mb-4 text-slate-300 leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50">
                  <p className="mb-1 text-white"><strong>RentPilot Inc.</strong></p>
                  <p className="mb-1 text-slate-300">Email: legal@rentpilot.ca</p>
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

export default Terms;
