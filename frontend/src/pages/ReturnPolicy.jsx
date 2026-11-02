
import React from "react";
import {
  FaRotateLeft,
  FaBoxOpen,
  FaMoneyBillTransfer,
  FaBan,
  FaTruckFast,
  FaEnvelope,
  FaShieldHalved,
  FaCircleCheck,
} from "react-icons/fa6";

import "../style/ReturnPolicy.css";

const policies = [
  {
    number: "01",
    title: "Eligibility for Returns",
    icon: <FaBoxOpen />,
    paragraphs: [
      "You may request a return within 30 days of receiving your order, subject to the conditions below.",
      "Items must be unused, in their original condition and packaging, with proof of purchase. Certain products may have additional eligibility requirements.",
    ],
  },
  {
    number: "02",
    title: "Refund Processing",
    icon: <FaMoneyBillTransfer />,
    paragraphs: [
      "Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund.",
      "Approved refunds will be issued to your original payment method. Processing typically takes 5–7 business days after approval, although your bank or payment provider may take additional time.",
    ],
  },
  {
    number: "03",
    title: "Non-Returnable Items",
    icon: <FaBan />,
    paragraphs: [
      "Some items may not be eligible for return, including perishable goods, personalized or custom-made products, digital products, and items damaged or tampered with after delivery.",
      "Exceptions may apply where required by applicable law or where the item arrived damaged, defective, or incorrect.",
    ],
  },
  {
    number: "04",
    title: "Return Shipping Costs",
    icon: <FaTruckFast />,
    paragraphs: [
      "Unless the item is defective, damaged, incorrect, or applicable law requires otherwise, you may be responsible for return shipping costs.",
      "Please contact our support team before sending an item back so we can provide the correct return instructions. Any applicable restocking fees will be disclosed before the return is processed.",
    ],
  },
];

const ReturnPolicy = () => {
  return (
    <main className="rp-page">
      <div className="rp-container">
        <header className="rp-hero">
          <span className="rp-eyebrow">
            <FaRotateLeft />
            SHOPNEST CUSTOMER CARE
          </span>

          <h1>
            Return &amp; <span>Refund Policy</span>
          </h1>

          <p className="rp-hero-description">
            Your satisfaction matters to us. Review our return and refund
            guidelines to understand how to request a return, what
            qualifies, and when you can expect your refund.
          </p>

          <div className="rp-highlights">
            <div className="rp-highlight">
              <div className="rp-highlight-icon">
                <FaRotateLeft />
              </div>
              <div>
                <strong>30-Day Window</strong>
                <span>Return requests within 30 days</span>
              </div>
            </div>

            <div className="rp-highlight">
              <div className="rp-highlight-icon">
                <FaMoneyBillTransfer />
              </div>
              <div>
                <strong>Refund Updates</strong>
                <span>Notification after inspection</span>
              </div>
            </div>

            <div className="rp-highlight">
              <div className="rp-highlight-icon">
                <FaShieldHalved />
              </div>
              <div>
                <strong>Secure Payments</strong>
                <span>Refunds to the original payment method</span>
              </div>
            </div>
          </div>
        </header>

        <section className="rp-guidelines" aria-labelledby="rp-guidelines-title">
          <div className="rp-section-heading">
            <span>IMPORTANT INFORMATION</span>
            <h2 id="rp-guidelines-title">Our return guidelines</h2>
          </div>

          <div className="rp-policy-list">
            {policies.map((policy) => (
              <article className="rp-policy-card" key={policy.number}>
                <div className="rp-policy-icon">{policy.icon}</div>

                <div className="rp-policy-content">
                  <h3>
                    {policy.number}. {policy.title}
                  </h3>

                  {policy.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rp-contact">
          <div className="rp-contact-left">
            <div className="rp-contact-icon">
              <FaEnvelope />
            </div>

            <div>
              <h3>Need help with a return?</h3>
              <p>
                Have a question about your order or refund? Contact our
                support team for assistance with your return request.
              </p>
            </div>
          </div>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=admin76059%40gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rp-contact-button"
          >
            Contact Support <FaEnvelope />
          </a>
        </section>

        <div className="rp-footer-note">
          <FaCircleCheck />
          Thank you for shopping with ShopNest.
        </div>
      </div>
    </main>
  );
};

export default ReturnPolicy;
