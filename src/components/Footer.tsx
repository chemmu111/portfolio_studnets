import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      className="pt-10 pb-4 px-4 mt-16 border-t"
      style={{
        background: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%)', // from-purple-600 to-indigo-700
        color: '#fff',
        borderTop: '1px solid #fff',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8">
        {/* Contact Info */}
        <div className="flex-1 min-w-[220px] mb-6 md:mb-0">
          <h3 className="text-lg font-bold mb-2">Contact Info</h3>
          <div className="text-sm leading-relaxed space-y-1">
            <div>Phone: <a href="tel:+918075772921" className="hover:underline text-white/80 hover:text-white">+91 8075772921</a></div>
            <div>Email: <a href="mailto:techschool@harisandcoacademy.com" className="hover:underline text-white/80 hover:text-white">techschool@harisandcoacademy.com</a></div>
            <div>Address:<br />
              SECOND FLOOR, 4 Wing Avenue,<br />
              Panniyankara Kozhikode, Kerala, 673001
            </div>
          </div>
        </div>
        {/* Navigation Links */}
        <nav className="flex-1 min-w-[180px] flex flex-col items-center">
          <h3 className="text-lg font-bold mb-2">Navigation</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><a href="/" className="hover:text-white/80 transition-colors">Home</a></li>
            <li><a href="/portfolio" className="hover:text-white/80 transition-colors">Student Portfolio</a></li>
          </ul>
        </nav>
        {/* Social Media */}
        <div className="flex-1 min-w-[180px] flex flex-col items-end md:items-end">
          <h3 className="text-lg font-bold mb-2">Social Media</h3>
          <ul className="flex flex-col gap-2 text-sm items-end md:items-end">
            <li><a href="https://www.facebook.com/share/1C9kziF2fT/?mibextid=qi2Omg" className="hover:text-white/80 transition-colors">Facebook</a></li>
            <li><a href="https://www.instagram.com/haca.techschool?igsh=ZTB3cHg4YTNraTdj" className="hover:text-white/80 transition-colors">Instagram</a></li>
            <li><a href="https://youtube.com/@techschoolhaca?si=pcnIlCB4vQi-f88h" className="hover:text-white/80 transition-colors">YouTube</a></li>
          </ul>
        </div>
      </div>                
      {/* Bottom Line */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-6 text-xs text-white/80">
        <div>© 2025 Created by HACA. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;