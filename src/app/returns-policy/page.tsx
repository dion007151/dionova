export const metadata = {
  title: "Returns Policy — DIONOVA",
  description: "Learn about our 30-day return policy and how to initiate a return.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-outfit)" }}>
          Returns & Exchanges
        </h1>
        
        <div className="prose prose-invert prose-p:text-dark-400 prose-h2:text-white max-w-none">
          <h2>30-Day Return Guarantee</h2>
          <p>We want you to be completely satisfied with your purchase. If you change your mind, you can return most items within 30 days of delivery for a full refund or exchange.</p>
          
          <h2>Conditions for Return</h2>
          <ul>
            <li>Items must be unused, unwashed, and in their original condition.</li>
            <li>All original tags and packaging must be intact and included.</li>
            <li>Certain items, such as intimate apparel and personalized goods, are final sale and cannot be returned for hygiene reasons.</li>
          </ul>

          <h2>How to Initiate a Return</h2>
          <p>To start a return, please visit our Contact Us page or email our support team at support@dionova.com with your order number and the reason for the return. We will provide you with a return shipping label and instructions.</p>

          <h2>Refund Processing</h2>
          <p>Once we receive and inspect your returned item(s), we will notify you of the approval or rejection of your refund. Approved refunds are processed back to the original payment method within 5-7 business days.</p>
        </div>
      </div>
    </div>
  );
}
