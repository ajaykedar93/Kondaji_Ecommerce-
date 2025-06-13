import React from 'react';
import familyIcon from '../../assets/Images/family.png';
import qualityIcon from '../../assets/Images/quality.png';
import traditionIcon from '../../assets/Images/tradition.png';
import { motion } from 'framer-motion';

const WhyKondaji = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#fffdf6] via-[#fff5f5] to-[#fff0f4]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-16">
          Why <span className="text-[#e11d48] drop-shadow-md">Kondaji Chivda</span> Stands Out
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[{
            icon: familyIcon,
            title: '100+ Years Legacy',
            desc: 'Handed down since 1918, our heritage speaks of trust, tradition, and timeless flavor.',
          }, {
            icon: qualityIcon,
            title: 'Premium Quality',
            desc: 'We select only the finest ingredients — ensuring every bite delivers freshness and crispness.',
          }, {
            icon: traditionIcon,
            title: 'Unmatched Taste',
            desc: 'A flavor crafted over generations. Maharashtrian roots blended with modern excellence.',
          }].map((item, index) => (
            <motion.div
              key={index}
              className="relative p-8 bg-white rounded-3xl border border-[#ffdde3] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-3 right-3 w-4 h-4 bg-[#ffc0cb] rounded-full"></div>
              <img
                src={item.icon}
                alt={item.title}
                className="h-20 mx-auto mb-6 animate-bounce-slow"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-[#e11d48] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyKondaji;