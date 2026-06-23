export const metadata = {
  title: "Privacy Policy — DIONOVA",
  description: "Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-outfit)" }}>
          Privacy Policy
        </h1>
        
        <div className="prose prose-invert prose-p:text-dark-400 prose-h2:text-white max-w-none">
          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact customer support. This may include your name, email address, shipping address, and payment information.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders.</li>
            <li>Communicate with you about your orders, products, and promotions.</li>
            <li>Improve and optimize our website and user experience.</li>
            <li>Protect against fraudulent transactions and monitor against theft.</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We do not sell your personal information. We may share your information with trusted third-party service providers (like payment processors and shipping couriers) solely for the purpose of fulfilling your orders.</p>

          <h2>4. Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information at any time. You can manage your information through your account settings or by contacting our support team.</p>
        </div>
      </div>
    </div>
  );
}
