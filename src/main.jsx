import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { AuthProvider } from './Context/AuthContext';
import { CartProvider } from './Context/CartContext';
import { SettingsProvider } from './Context/SettingsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
