import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings once on mount
  useEffect(() => {
    axios.get('https://kondaji-express-api.onrender.com/api/settings')
      .then(res => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Function to update settings after admin changes
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
