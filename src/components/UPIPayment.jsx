import React, { useState } from 'react';
import './UPIPayment.css';
import './UPIPayment.css';

const UPIPayment = ({ amount, orderId, onSuccess, onCancel }) => {
  const [paymentStep, setPaymentStep] = useState('instructions'); // instructions, qr, confirmation
  const [transactionId, setTransactionId] = useState('');

  const upiId = 'darshanvasoya75@gmail.com'; // Your UPI ID
  const merchantName = 'LVS Machine and Tools';
  
  // Generate UPI payment URL
  const upiUrl = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=Order Payment - ${orderId}`;
  
  // Generate QR code URL (using a QR code service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  const handlePayNow = () => {
    // Try to open UPI app
    try {
      window.open(upiUrl, '_blank');
      setPaymentStep('confirmation');
    } catch (error) {
      // If can't open UPI app, show QR code
      setPaymentStep('qr');
    }
  };

  const handlePaymentConfirm = () => {
    if (!transactionId.trim()) {
      alert('Please enter the transaction ID');
      return;
    }
    onSuccess(transactionId);
  };

  return (
    <div className="upi-payment-modal">
      <div className="upi-payment-content">
        <div className="upi-header">
          <h3>UPI Payment</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        {paymentStep === 'instructions' && (
          <div className="payment-instructions">
            <div className="payment-details">
              <h4>Payment Details</h4>
              <div className="detail-row">
                <span>Pay To:</span>
                <span>{upiId}</span>
              </div>
              <div className="detail-row">
                <span>Merchant:</span>
                <span>{merchantName}</span>
              </div>
              <div className="detail-row">
                <span>Amount:</span>
                <span>₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="detail-row">
                <span>Order ID:</span>
                <span>{orderId}</span>
              </div>
            </div>

            <div className="payment-options">
              <button className="btn-pay-now" onClick={handlePayNow}>
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY5NTAwIi8+Cjwvc3ZnPgo=" alt="UPI" />
                Pay with UPI App
              </button>
              
              <div className="divider">OR</div>
              
              <button className="btn-qr-code" onClick={() => setPaymentStep('qr')}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <path d="m14 19 2 2 4-4"/>
                </svg>
                Scan QR Code
              </button>
            </div>
          </div>
        )}

        {paymentStep === 'qr' && (
          <div className="qr-code-section">
            <h4>Scan QR Code to Pay</h4>
            <div className="qr-code-container">
              <img src={qrCodeUrl} alt="UPI QR Code" className="qr-code" />
            </div>
            <p className="qr-instructions">
              Open any UPI app (PhonePe, GPay, Paytm, etc.) and scan this QR code to complete the payment
            </p>
            <button className="btn-paid" onClick={() => setPaymentStep('confirmation')}>
              I have paid
            </button>
          </div>
        )}

        {paymentStep === 'confirmation' && (
          <div className="payment-confirmation">
            <div className="success-icon">✓</div>
            <h4>Payment Initiated</h4>
            <p>Please enter your UPI transaction ID to confirm the payment</p>
            
            <div className="transaction-input">
              <label>Transaction ID / UPI Reference Number</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>

            <div className="confirmation-buttons">
              <button className="btn-confirm" onClick={handlePaymentConfirm}>
                Confirm Payment
              </button>
              <button className="btn-cancel" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UPIPayment;