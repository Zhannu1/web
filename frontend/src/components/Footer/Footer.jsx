import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Briefcase size={24} color="var(--primary-color)" />
            <span>JobPortal</span>
          </Link>
          <p>Қазақстандағы ең үздік жұмыс іздеу және карьералық өсу платформасы.</p>
        </div>

        <div className="footer-links">
          <h3>Пайдалы сілтемелер</h3>
          <Link to="/jobs">Жұмыс іздеу</Link>
          <Link to="/register">Тіркелу</Link>
          <Link to="/login">Жүйеге кіру</Link>
        </div>

        <div className="footer-contact">
          <h3>Байланыс</h3>
          <p><MapPin size={16} /> Астана қаласы</p>
          <p><Phone size={16} /> +7 (700) 000-00-00</p>
          <p><Mail size={16} /> mails3rvice@inbox.ru </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className='a'>
          <p>&copy; {new Date().getFullYear()} JobPortal. Барлық құқықтар қорғалған.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;