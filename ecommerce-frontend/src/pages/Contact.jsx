import React, { useState } from 'react';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPaperPlane,
  FaQuestionCircle,
} from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Subject line is required';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please provide a detailed inquiry message';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Message must contain at least 15 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }
  };

  const faqs = [
    {
      q: 'How does the RapidMiner Recommendation System work?',
      a: 'The platform integrates association rules mined from historical shopping baskets via RapidMiner Studio. The backend analytics engine evaluates product co-occurrences using FP-Growth metrics (Confidence >= 0.5, Lift > 1.2) to deliver smart suggestions.',
    },
    {
      q: 'How long does standard delivery take?',
      a: 'Orders typically ship within 24-48 hours. Express domestic shipments arrive in 2-3 business days, while international deliveries take 5-7 business days.',
    },
    {
      q: 'How is user data and authentication secured?',
      a: 'All authentication transactions use bcrypt salted password hashing and stateless JSON Web Tokens (JWT) transmitted via HTTP Bearer headers.',
    },
  ];

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Have questions about your order, our API integration, or RapidMiner algorithmic intelligence? Our support engineers are here to assist.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'start',
        marginBottom: '5rem',
      }}>
        {/* Contact Form with Validation */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send Us a Message</h2>

          {submitted && (
            <div style={{
              padding: '1.25rem',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}>
              <FaCheckCircle size={22} />
              <div>
                <strong>Inquiry Submitted Successfully!</strong>
                <div style={{ fontSize: '0.85rem' }}>Thank you. Our team will respond to your email within 24 hours.</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">Full Name *</label>
              <input
                id="contact-name"
                type="text"
                className="form-input"
                placeholder="Sebastian Roshan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">Email Address *</label>
              <input
                id="contact-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject" className="form-label">Subject *</label>
              <input
                id="contact-subject"
                type="text"
                className="form-input"
                placeholder="Order tracking, RapidMiner API question, etc."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
              {errors.subject && <div className="form-error">{errors.subject}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="contact-message" className="form-label">Message *</label>
              <textarea
                id="contact-message"
                className="form-textarea"
                rows={5}
                placeholder="Please describe your question or issue in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              {errors.message && <div className="form-error">{errors.message}</div>}
            </div>

            <button
              type="submit"
              id="contact-submit-btn"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <FaPaperPlane size={14} /> Send Message
            </button>
          </form>
        </div>

        {/* Contact Info Cards & FAQ */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                fontSize: '1.2rem',
              }}>
                <FaEnvelope />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Direct Support Email</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>support@nexusstore.io</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)',
                fontSize: '1.2rem',
              }}>
                <FaPhoneAlt />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Toll-Free Phone</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>+91 (800) 456-7890 (Mon-Fri 9am-6pm IST)</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(236, 72, 153, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ec4899',
                fontSize: '1.2rem',
              }}>
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Headquarters</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>42 Silicon Boulevard, Tech Corridor, Bengaluru</p>
              </div>
            </div>
          </div>

          {/* Quick FAQ Section */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaQuestionCircle color="var(--accent-primary)" /> Frequently Asked Questions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
                      {activeFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <div style={{
                      padding: '0 1rem 1rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.75rem',
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
