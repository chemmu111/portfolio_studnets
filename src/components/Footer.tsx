import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      className="pt-8 sm:pt-10 pb-4 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 border-t"
      style={{
        background: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%)', // from-purple-600 to-indigo-700
        color: '#fff',
        borderTop: '1px solid #fff',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8 pb-6 sm:pb-8">
        {/* Contact Info */}
        <div className="flex-1 w-full lg:w-auto mb-4 lg:mb-0">
          <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Contact Info</h3>
          <div className="text-xs sm:text-sm leading-relaxed space-y-1 sm:space-y-2">
            <div>Phone: <a href="tel:+918075772921" className="hover:underline text-white/80 hover:text-white break-all">+91 8075772921</a></div>
            <div>Email: <a href="mailto:techschool@harisandcoacademy.com" className="hover:underline text-white/80 hover:text-white break-all">techschool@harisandcoacademy.com</a></div>
            <div className="leading-relaxed">Address:<br />
              SECOND FLOOR, 4 Wing Avenue,<br />
              Panniyankara Kozhikode, Kerala, 673001
            </div>
          </div>
        </div>
        {/* Navigation Links */}
        <nav className="flex-1 w-full lg:w-auto flex flex-col items-start lg:items-center mb-4 lg:mb-0">
          <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Navigation</h3>
          <ul className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
            <li><a href="/" className="hover:text-white/80 transition-colors">Home</a></li>
            <li><a href="/portfolio" className="hover:text-white/80 transition-colors">Student Portfolio</a></li>
          </ul>
        </nav>
        {/* Social Media */}
        <div className="flex-1 w-full lg:w-auto flex flex-col items-start lg:items-end">
          <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Social Media</h3>
          <ul className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm items-start lg:items-end">
            <li><a href="https://www.facebook.com/share/1C9kziF2fT/?mibextid=qi2Omg" className="hover:text-white/80 transition-colors">Facebook</a></li>
            <li><a href="https://www.instagram.com/haca.techschool?igsh=ZTB3cHg4YTNraTdj" className="hover:text-white/80 transition-colors">Instagram</a></li>
            <li><a href="https://youtube.com/@techschoolhaca?si=pcnIlCB4vQi-f88h" className="hover:text-white/80 transition-colors">YouTube</a></li>
          </ul>
        </div>
      </div>                
      {/* Bottom Line */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-4 sm:pt-6 text-xs text-white/80">
        <div>© 2025 Created by HACA. All rights reserved.</div>
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;