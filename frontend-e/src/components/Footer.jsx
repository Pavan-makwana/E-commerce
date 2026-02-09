import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-10">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand Info */}
          <div>
            <h2 className="text-2xl font-extrabold text-yellow-400 mb-4">
              E-SHOP<span className="text-white">.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop shop for the best deals on electronics, fashion, and more. 
              Quality products, fast delivery, and 24/7 support.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-yellow-400 transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-yellow-400 transition">Shop All</Link></li>
              <li><Link to="/cart" className="hover:text-yellow-400 transition">My Cart</Link></li>
              <li><Link to="/login" className="hover:text-yellow-400 transition">Login / Register</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Care</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/returns" className="hover:text-yellow-400 transition">Returns & Refunds</Link></li>
              <li><a href="#" className="hover:text-yellow-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-400 shrink-0" />
                <span>123 Market Street, Ahmedabad, Gujarat, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-400 shrink-0" />
                <span>support@eshop.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} E-Commerce System. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;