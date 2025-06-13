import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    banner_image: '',
    banner_text: '',
    contact_email: '',
    phone: '',
    address: '',
    footer_message: '',
    facebook_url: '',
    instagram_url: '',
    whatsapp_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); 

  useEffect(() => {
    axios
      .get('https://kondaji-express-api.onrender.com/api/settings')
      .then((res) => {
        setSettings({
          site_name: res.data.site_name || '',
          banner_image: res.data.banner_image || '',
          banner_text: res.data.banner_text || '',
          contact_email: res.data.contact_email || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          footer_message: res.data.footer_message || '',
          facebook_url: res.data.facebook_url || '',
          instagram_url: res.data.instagram_url || '',
          whatsapp_url: res.data.whatsapp_url || '',
        });
        setLoading(false);
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'Failed to load site settings.' });
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    axios
      .put('https://kondaji-express-api.onrender.com/api/settings', settings)
      .then(() => {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'Failed to save settings.' });
      })
      .finally(() => setSaving(false));
  };

  if (loading)
    return <p className="text-center text-gray-500 py-10">Loading site settings...</p>;

  return (
    <div className="max-w-4xl mx-auto my-16 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">⚙️ Site Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-7">
        {[
          { label: 'Site Name (Navbar)', name: 'site_name', type: 'text', placeholder: 'Kondaji Chivda' },
          { label: 'Banner Image URL', name: 'banner_image', type: 'url', placeholder: 'https://example.com/banner.jpg' },
          { label: 'Banner Text', name: 'banner_text', type: 'textarea', placeholder: 'Your catchy banner tagline here...' },
          { label: 'Contact Email', name: 'contact_email', type: 'email', placeholder: 'support@kondajichivda.com' },
          { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91-22-12345678' },
          { label: 'Company Address', name: 'address', type: 'textarea', placeholder: '123 Kondaji Street, Pune, Maharashtra, India' },
          { label: 'Footer Message', name: 'footer_message', type: 'text', placeholder: '© 2025 Kondaji Chivda – All Rights Reserved' },
          { label: 'Facebook URL', name: 'facebook_url', type: 'url', placeholder: 'https://facebook.com/kondajichivda' },
          { label: 'Instagram URL', name: 'instagram_url', type: 'url', placeholder: 'https://instagram.com/kondajichivda' },
          { label: 'WhatsApp URL', name: 'whatsapp_url', type: 'url', placeholder: 'https://wa.me/9146963805' },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-lg font-semibold mb-2">
              {label}
              <span className="ml-1 text-gray-400 text-base italic">(optional)</span>
            </label>
            {type === 'textarea' ? (
              <textarea
                id={name}
                name={name}
                rows="3"
                placeholder={placeholder}
                value={settings[name]}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={settings[name]}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
          </div>
        ))}

        <div className="text-center mt-10">
          <button
            type="submit"
            disabled={saving}
            className={`bg-red-600 text-white font-semibold px-12 py-3 rounded-lg shadow-lg hover:bg-red-700 transition duration-300 ${
              saving ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>

      {message.text && (
        <div
          className={`mt-8 p-4 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-400'
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}
          role="alert"
          aria-live="polite"
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default SiteSettings;
