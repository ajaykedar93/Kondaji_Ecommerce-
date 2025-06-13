import React, { useContext } from 'react';
import { SettingsContext } from '../../Context/SettingsContext';
import Hero from '../../components/Hero/Hero';
import Menus from '../../components/Menus/Menus';
import WhyKondaji from '../../components/Hero/WhyKondaji';

const Home = () => {
  const { settings, loading } = useContext(SettingsContext);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {settings?.bannerImage && (
        <img
          src={settings.bannerImage}
          alt="Banner"
          className="w-full h-64 object-cover rounded-lg shadow mb-6"
        />
      )}
      <Hero />
      <section id="menus">
        <Menus />
      </section>
      <WhyKondaji />

      {settings?.footerMessage && (
        <footer className="mt-10 text-center text-sm text-gray-500">
          {settings.footerMessage}
        </footer>
      )}
    </div>
  );
};

export default Home;
