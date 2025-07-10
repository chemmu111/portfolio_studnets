import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const MotionLink = motion(Link);

const Home: React.FC = () => {
  const heading = [
    { text: 'Be ', color: 'white' },
    { text: 'Technically', color: 'purple' },
    { text: ' Awesome', color: 'white' },
  ];
  const headingLetters = heading.flatMap((part, i) =>
    part.text.split('').map((char, j) => ({
      char,
      color: part.color,
      key: `${i}-${j}`,
      index: i === 0 ? j : i === 1 ? heading[0].text.length + j : heading[0].text.length + heading[1].text.length + j,
    }))
  );

  return (
    <div className="min-h-screen bg-black transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-black transition-colors duration-300 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated blurry gradient blobs background */}
        {/* Deep purple blob (bottom left) */}
        <motion.div
          className="absolute -bottom-16 sm:-bottom-32 -left-16 sm:-left-32 w-[400px] sm:w-[500px] lg:w-[700px] h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br from-[#3b007d] via-[#1a0033] to-black opacity-60 blur-3xl z-0"
          animate={{ y: [0, 40, 0], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ pointerEvents: 'none' }}
        />
        {/* Indigo blob (center right) */}
        <motion.div
          className="absolute top-1/3 right-0 w-[300px] sm:w-[400px] lg:w-[500px] h-[250px] sm:h-[300px] lg:h-[400px] bg-gradient-to-tr from-indigo-900 via-[#3b007d] to-black opacity-50 blur-3xl z-0"
          animate={{ y: [0, -30, 0], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ pointerEvents: 'none' }}
        />
        {/* Subtle white light glow (top right) */}
        <motion.div
          className="absolute -top-12 sm:-top-24 right-0 w-[200px] sm:w-[250px] lg:w-[350px] h-[120px] sm:h-[150px] lg:h-[200px] bg-gradient-to-br from-white/60 to-transparent opacity-40 blur-2xl z-0"
          animate={{ opacity: [0.3, 0.5, 0.3], x: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          style={{ pointerEvents: 'none' }}
        />
        {/* Foreground content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl mx-auto text-center">
          <h1
            className="main-heading-hover text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center mb-6 select-none"
            style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.1, wordBreak: 'break-word' }}
          >
            <span className="main-heading-word be-awesome" style={{ color: '#fff', transition: 'color 0.4s' }}>Be </span>
            <span
              className="main-heading-word technically shake-on-hover"
              style={{ color: '#a259ff', transition: 'color 0.4s' }}
            >
              Technically
            </span>
            <span className="main-heading-word be-awesome" style={{ color: '#fff', transition: 'color 0.4s' }}> Awesome</span>
          </h1>
          <h3
            className="max-w-2xl mx-auto text-white text-center font-medium mb-8 mt-4 px-2 text-base sm:text-lg md:text-xl leading-relaxed"
            style={{ fontWeight: 500 }}
          >
            Push past your boundaries by identifying and overcoming the limitations holding you back — it's time to debug your limits.
          </h3>
          
          {/* View Portfolio Button */}
          <div className="w-full flex justify-center">
            <MotionLink
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer select-none text-sm sm:text-base"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ textDecoration: 'none' }}
            >
              <span>View Portfolio</span>
              <motion.span
                className="text-base sm:text-lg"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ↓
              </motion.span>
            </MotionLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;