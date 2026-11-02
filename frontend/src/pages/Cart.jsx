import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, addToCart } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext';
import '../style/cart.css';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQty = (item, qty) => {
    if (qty > 0) {
      dispatch(addToCart({ ...item, qty }));
      showToast('Cart updated.');
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="cart-empty-state">
          <div className="cart-empty-icon" aria-hidden="true">🛒</div>
          <span className="cart-empty-label">YOUR CART</span>
          <h3>Your cart is waiting for something great.</h3>
          <p>Explore our products and add your favorites to get started.</p>
          <Link to="/shop" className="cart-empty-button">Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  <div className="qty-controls">
                    <button onClick={() => handleUpdateQty(item, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => handleUpdateQty(item, item.qty + 1)}>+</button>
                  </div>
                  <button onClick={() => handleRemove(item.productId)} className="btn-remove">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
            <button onClick={() => navigate('/checkout')} className="btn btn-checkout">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
