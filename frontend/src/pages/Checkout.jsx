import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [local, setLocal] = useState({ message: '', error: '' });
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const saveOrder = async (paymentId) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.qty,
          price: item.price
        })),
        totalAmount: totalPrice,
        address,
        paymentId
      })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Order saving failed (${response.status})`);
    }

    dispatch(clearCart());
    navigate('/ordersuccess');
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const orderResponse = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });
      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        setLocal({ message: '', error: orderData.message || 'Payment failed to initialize' });
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'ShopNest',
        description: 'Test Transaction',
        order_id: orderData.order.id,
        handler: async (paymentResponse) => {
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentResponse)
          });

          if (!verifyResponse.ok) {
            setLocal({ message: '', error: 'Payment verification failed' });
            return;
          }

          try {
            await saveOrder(paymentResponse.razorpay_payment_id);
          } catch (error) {
            setLocal({ message: '', error: error.message });
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },
        theme: { color: '#f97316' }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setLocal({ message: '', error: 'Payment failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!user) {
      setLocal({ message: '', error: 'Please login first.' });
      navigate('/login');
      return;
    }
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {local.message && <p style={{ color: '#10b981' }}>{local.message}</p>}
      {local.error && <p style={{ color: '#ef4444' }}>{local.error}</p>}
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          {[
            ['fullName', 'Full Name'],
            ['street', 'Street'],
            ['city', 'City'],
            ['postalCode', 'Postal Code'],
            ['country', 'Country']
          ].map(([field, placeholder]) => (
            <input
              key={field}
              type="text"
              placeholder={placeholder}
              required
              value={address[field]}
              onChange={(event) =>
                setAddress({ ...address, [field]: event.target.value })
              }
            />
          ))}
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" disabled={loading} className={`btn${loading ? ' is-loading' : ''}`}>
              {loading ? 'Connecting to payment...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
