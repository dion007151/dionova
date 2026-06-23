export const metadata = {
  title: "Shipping Information — DIONOVA",
  description: "Learn about DIONOVA's shipping methods, delivery times, and rates.",
};

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-outfit)" }}>
          Shipping Information
        </h1>
        
        <div className="prose prose-invert prose-p:text-dark-400 prose-h2:text-white max-w-none">
          <h2>Delivery Methods & Times</h2>
          <p>We partner with leading couriers to ensure your items arrive safely and on time. Delivery times vary based on your location and the selected shipping method.</p>
          
          <ul>
            <li><strong>Standard Shipping:</strong> 3-5 business days</li>
            <li><strong>Express Shipping:</strong> 1-2 business days</li>
            <li><strong>Same-Day Delivery:</strong> Available in Metro Manila for orders placed before 12:00 PM</li>
          </ul>

          <h2>Shipping Rates</h2>
          <p>Shipping is automatically calculated at checkout based on your delivery address and the total weight of your order.</p>
          <ul>
            <li><strong>Free Standard Shipping</strong> on all orders over ₱2,000.</li>
            <li>For orders below ₱2,000, a flat rate of ₱199 applies.</li>
          </ul>

          <h2>International Shipping</h2>
          <p>Currently, DIONOVA only ships within the Philippines. We are working hard to expand our logistics to support international orders soon.</p>

          <h2>Order Tracking</h2>
          <p>Once your order has been dispatched, you will receive an email containing a tracking number and a link to monitor your delivery status in real-time.</p>
        </div>
      </div>
    </div>
  );
}
