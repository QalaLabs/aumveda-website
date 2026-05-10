export const metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Aumveda protects your privacy and handles your personal data.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-emerald-50 to-white py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Privacy Policy
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
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Aumveda ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and mobile application (collectively, the "Service"), including all related features and functionalities.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service. Your continued use of the Service following the posting of revised Privacy Policy means you accept and agree to the changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">2.1 Information from Google Authentication</h3>
            <p>
              When you sign up or log in through Google OAuth 2.0, we collect the following information with your explicit consent:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email address</li>
              <li>Full name</li>
              <li>Profile picture URL</li>
              <li>Google account ID</li>
            </ul>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">2.2 Information You Provide</h3>
            <p>
              We may collect information you voluntarily provide, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Health and wellness preferences</li>
              <li>Journal entries and personal notes</li>
              <li>Meditation and healing practice history</li>
              <li>Product purchases and preferences</li>
              <li>Feedback and support requests</li>
              <li>Payment information (processed securely through third-party providers)</li>
            </ul>

            <h3 className="text-xl font-sans font-semibold text-gray-800 mt-6 mb-3">2.3 Automatically Collected Information</h3>
            <p>
              When you use our Service, we automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Device information (device type, operating system, unique device identifiers)</li>
              <li>Log data (access times, pages viewed, IP address)</li>
              <li>Usage analytics and interaction patterns</li>
              <li>Location data (only with explicit permission)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Authentication and account management</li>
              <li>Personalizing your healing and wellness experience</li>
              <li>Delivering requested services and features</li>
              <li>Processing transactions and sending transaction confirmations</li>
              <li>Improving and optimizing our Service</li>
              <li>Communicating updates, promotions, and support messages</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Detecting and preventing fraud or security issues</li>
              <li>Complying with legal obligations</li>
              <li>Conducting research and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. How We Share Your Information</h2>
            <p>
              We do not sell your personal information. However, we may share information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Service Providers:</strong> With third parties who assist in operating our Service (analytics, payment processing, customer support)</li>
              <li><strong>Google OAuth Provider:</strong> Your data is shared with Google only for authentication purposes</li>
              <li><strong>Legal Compliance:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In the event of merger, acquisition, or bankruptcy</li>
              <li><strong>With Your Consent:</strong> For other purposes disclosed to you with your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Security of Your Information</h2>
            <p>
              We implement comprehensive security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Secure password storage using industry-standard hashing</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure API communications</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience. These may include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality</li>
              <li><strong>Performance Cookies:</strong> To analyze how you use our Service</li>
              <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> To understand user behavior and improve our Service</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. Disabling cookies may affect functionality of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Right to Access:</strong> Request a copy of your personal information</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
              <li><strong>Right to Data Portability:</strong> Request your data in a portable format</li>
              <li><strong>Right to Object:</strong> Object to processing of your data</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw previously given consent</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us using the information provided in Section 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. Retention periods vary based on the type of information and the purposes for which we use it.
            </p>
            <p>
              If you request deletion or if your account is inactive for 2 years, we will delete your personal data, except where we are legally required to retain it or have a legitimate business purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p>
              Our Service is not directed to individuals under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that a child has provided us with personal information, we will delete such information and terminate the child's account.
            </p>
            <p>
              For users between 13 and 18, we provide additional privacy protections and require parental consent where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
            <p>
              Our Service may contain links to third-party websites and applications that are not operated by us. This Privacy Policy does not apply to those third-party services, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services before providing your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. International Data Transfers</h2>
            <p>
              Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws different from your home country. By using our Service, you consent to the transfer of your information to countries outside your country of residence.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of material changes by posting the updated policy on our Service and updating the "Last Updated" date. Your continued use of the Service constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-emerald-50 p-6 rounded-lg mt-4">
              <p className="font-semibold text-gray-900">Aumveda</p>
              <p className="text-gray-700">Email: privacy@aumveda.com</p>
              <p className="text-gray-700">Website: www.aumveda.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}