export const metadata = {
  title: 'Terms of Service',
  description: 'Read Aumveda\'s Terms of Service and understand your rights and responsibilities.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-emerald-50 to-white py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: January 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Aumveda website and mobile application (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to abide by the above, please do not use this service. Aumveda reserves the right to make changes to these Terms of Service at any time, and your continued use of the Service following the posting of such changes means you accept and agree to the changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Eligibility and Account Registration</h2>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">2.1 Eligibility</h3>
            <p>
              You must be at least 13 years of age to use our Service. If you are between 13 and 18 years old, your parents or guardians must review and agree to these Terms on your behalf. Users under 13 are not permitted to use our Service.
            </p>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">2.2 Google OAuth Authentication</h3>
            <p>
              You agree to authenticate through Google OAuth 2.0. By connecting your Google account, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You own or have the authority to use the Google account</li>
              <li>You consent to sharing your Google account information with Aumveda</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You are responsible for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">2.3 Account Responsibility</h3>
            <p>
              You are responsible for maintaining the security of your account. You agree to immediately notify us of any unauthorized use of your account or any breach of security. Aumveda will not be liable for any loss or damage arising from unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Aumveda's Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Engage in unauthorized framing of or linking to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Disclaimer of Warranties</h2>
            <p className="font-semibold text-red-700 mb-4">
              MEDICAL DISCLAIMER: Aumveda is a wellness platform providing educational information and guided practices. It is NOT a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-red-700 mb-4">
              <li>Always consult with a qualified healthcare provider before starting any new wellness practice</li>
              <li>Aumveda does not provide medical diagnosis or treatment</li>
              <li>Our content is for informational and educational purposes only</li>
              <li>Results may vary and are not guaranteed</li>
              <li>If you have a medical condition, consult your doctor before using our Service</li>
            </ul>
            <p>
              The materials on Aumveda's Service are provided on an 'as is' basis. Aumveda makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Limitations of Liability</h2>
            <p>
              In no event shall Aumveda or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Aumveda's Service, even if Aumveda or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Accuracy of Materials</h2>
            <p>
              The materials appearing on Aumveda's Service could include technical, typographical, or photographic errors. Aumveda does not warrant that any of the materials on our Service are accurate, complete, or current. Aumveda may make changes to the materials contained on its Service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Materials and Content</h2>
            <p>
              The materials on Aumveda's Service are protected by copyright law and international copyright treaties. Aumveda grants you a limited license to access and use the Service for personal, non-commercial purposes. You may not reproduce, distribute, transmit, or display the materials without permission from Aumveda.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. User-Generated Content</h2>
            <p>
              Any content you create, upload, or submit (including journal entries, personal notes, and wellness data) remains your intellectual property. However, by submitting content to Aumveda, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content for improving our Service.
            </p>
            <p>
              You agree that your content:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Will not violate any applicable laws or regulations</li>
              <li>Will not infringe upon any intellectual property rights</li>
              <li>Will not contain offensive, abusive, or harmful material</li>
              <li>You have full rights to grant the license described above</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Prohibited Conduct</h2>
            <p>
              You agree not to engage in any of the following prohibited behavior:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Harassing or causing distress or inconvenience to any person</li>
              <li>Transmitting spam, unsolicited emails, or marketing materials</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with or disrupting the normal operation of the Service</li>
              <li>Reverse engineering, decompiling, or otherwise attempting to discover source code</li>
              <li>Using automated tools without explicit permission</li>
              <li>Impersonating any person or entity</li>
              <li>Collecting or tracking personal information of others</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Third-Party Services and Links</h2>
            <p>
              Aumveda's Service may contain links to third-party websites and services that are not operated by us. We are not responsible for the content, accuracy, or practices of these third-party sites. Your use of third-party services is governed by their own terms and conditions. We encourage you to review their policies before using their services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Payment and Purchases</h2>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">11.1 Pricing</h3>
            <p>
              All prices are subject to change without notice. Aumveda reserves the right to modify pricing at any time.
            </p>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">11.2 Payment Processing</h3>
            <p>
              We process payments through secure third-party payment processors. By making a purchase, you authorize the payment processor to charge your provided payment method. You are responsible for maintaining accurate billing information.
            </p>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">11.3 Refunds and Returns</h3>
            <p>
              Please refer to our Return and Refund Policy for detailed information regarding returns and refunds. Digital products are generally non-refundable except in cases of technical failure.
            </p>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">11.4 Billing Disputes</h3>
            <p>
              If you dispute a charge, please contact us within 30 days of the transaction. We will investigate and resolve billing disputes in accordance with applicable payment processor policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. Termination of Service</h2>
            <p>
              Aumveda may terminate or suspend your account and access to the Service, with or without notice, for any reason including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violation of these Terms of Service</li>
              <li>Unauthorized access attempts</li>
              <li>Violation of applicable laws</li>
              <li>Fraudulent or abusive behavior</li>
              <li>Non-payment of fees</li>
            </ul>
            <p className="mt-4">
              Upon termination, your right to use the Service will immediately cease. Any data associated with your account may be deleted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">13. Intellectual Property Rights</h2>
            <p>
              All content, features, and functionality of the Service (including but not limited to text, graphics, logos, images, music, digital downloads, and software) are the exclusive property of Aumveda or its content suppliers and are protected by Indian and international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">14. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Aumveda, its affiliates, and their respective officers, directors, employees, and agents from any and all claims, damages, losses, and expenses arising out of:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms of Service</li>
              <li>Your violation of applicable laws or regulations</li>
              <li>Your infringement of any intellectual property rights</li>
              <li>Any content you submit or transmit</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">15. Governing Law and Dispute Resolution</h2>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">15.1 Governing Law</h3>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">15.2 Dispute Resolution</h3>
            <p>
              Any dispute arising out of or relating to these Terms of Service or the use of the Service shall be resolved through:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Informal Resolution:</strong> Both parties agree to attempt good faith negotiations to resolve disputes</li>
              <li><strong>Arbitration:</strong> If informal resolution fails, disputes shall be resolved through binding arbitration under the Indian Arbitration and Conciliation Act, 1996</li>
              <li><strong>Jurisdiction:</strong> Arbitration shall be conducted in India, and the arbitral award shall be binding on both parties</li>
            </ol>
            <p className="mt-4">
              By agreeing to these Terms, you waive your right to pursue disputes in court.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">16. Modifications to Service</h2>
            <p>
              Aumveda reserves the right to modify or discontinue the Service (or any part thereof) at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">17. Entire Agreement</h2>
            <p>
              These Terms of Service, together with our Privacy Policy and any other policies or agreements referenced herein, constitute the entire agreement between you and Aumveda regarding your use of the Service and supersede all prior and contemporaneous agreements, whether written or oral.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">18. Severability</h2>
            <p>
              If any provision of these Terms of Service is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect, and the invalid or unenforceable provision shall be modified to the minimum extent necessary to make it valid and enforceable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">19. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-emerald-50 p-6 rounded-lg mt-4">
              <p className="font-semibold text-gray-900">Aumveda</p>
              <p className="text-gray-700">Email: support@aumveda.com</p>
              <p className="text-gray-700">Website: www.aumveda.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}