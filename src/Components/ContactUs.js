import React from 'react';

const ContactUs = () => {
  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '20px auto',
        padding: '25px',
        backgroundColor: 'rgba(255, 255, 255, 0.65)', // Translucent white
        backdropFilter: 'blur(10px)', // Adds a frosted glass effect
        borderRadius: '12px',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ color: '#222', marginBottom: '20px', fontSize: '28px', fontWeight: 'bold' }}>
        Contact Us
      </h1>
      <div
        style={{
          textAlign: 'left',
          margin: '0 auto',
          maxWidth: '450px',
          fontSize: '16px',
          color: '#333',
        }}
      >
        <p style={{ margin: '15px 0' }}>
          <strong style={{ color: '#000' }}>📞 Phone:</strong>{' '}
          <a href="tel:+1234567890" style={{ color: '#222', textDecoration: 'none', fontWeight: 'bold' }}>
            +91 - Add Your Phone Number
          </a>
        </p>
        <p style={{ margin: '15px 0' }}>
          <strong style={{ color: '#000' }}>✉️ Email:</strong>{' '}
          <a href="mailto:support@buildyourownpc.ggs" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>
            support@buildyourownpc.ggs
          </a>
        </p>
        <p style={{ margin: '15px 0' }}>
          <strong style={{ color: '#000' }}>🏢 Address:</strong>{' '}
          <span style={{ fontWeight: 'normal', color: '#444' }}>123 Gaming Street, Tech City, PC 45678, USA</span>
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
