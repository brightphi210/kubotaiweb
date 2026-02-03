import { FaTwitter, FaFacebook, FaInstagram, FaTelegram, FaDiscord } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { IoLocationSharp } from 'react-icons/io5';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Tasks', href: '#tasks' },
      { name: 'Rewards', href: '#rewards' },
      { name: 'Referrals', href: '#referrals' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'FAQ', href: '#faq' },
    ],
  };

  const socialLinks = [
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: FaTelegram, href: '#', label: 'Telegram', color: 'hover:text-blue-500' },
    { icon: FaDiscord, href: '#', label: 'Discord', color: 'hover:text-indigo-500' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-neutral-950 border-t border-gray-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2 group mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl sm:text-2xl">K</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                Kubotai
              </span>
            </a>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm">
              Earn tokens by completing tasks and referring friends. Join thousands of users already earning rewards on Kubotai.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400">
                <HiMail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm break-all">support@kubotai.com</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-400">
                <IoLocationSharp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm">Available Worldwide</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-gray-400 ${social.color} transform hover:scale-110 transition-all duration-300`}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} Kubotai. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <a href="#privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs sm:text-sm transition-colors duration-300">
                Privacy
              </a>
              <a href="#terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs sm:text-sm transition-colors duration-300">
                Terms
              </a>
              <a href="#cookies" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs sm:text-sm transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;