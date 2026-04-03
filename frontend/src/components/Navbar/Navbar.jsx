import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sun, Moon, Menu, X, Briefcase, User, ClipboardList, PlusSquare, Bookmark, Bell, MessageSquare } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(false);

const handleLogout = () => {
    logout(); 
    toggleMenu(); 
    
    toast.success('Жүйеден сәтті шықтыңыз!'); 
    
    setTimeout(() => {
      window.location.href = '/'; 
    }, 600); 
  };

  return (
    <header className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo" onClick={toggleMenu}>
          <span>JobPortal</span>
        </Link>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/jobs" onClick={toggleMenu} className="nav-icon-link">
            <Briefcase size={18}/> Вакансии
          </Link>
          
          {user ? (
            <>
              {user.role === 'USER' && (
                <>
                  <Link to="/saved-jobs" onClick={toggleMenu} className="nav-icon-link">
                    <Bookmark size={18} /> Сақталғандар
                  </Link>
                  <Link to="/my-applications" onClick={toggleMenu} className="nav-icon-link">
                    <ClipboardList size={18} /> Өтініштерім
                  </Link>
                  <Link to="/chat" onClick={toggleMenu} className="nav-icon-link">
                    <MessageSquare size={18} /> Хабарламалар (Чат)
                  </Link>
                </>
              )}

              {user.role === 'EMPLOYER' && (
                <>
                  <Link to="/my-jobs" onClick={toggleMenu} className="nav-icon-link">
                    <Briefcase size={18} /> Менің вакансияларым
                  </Link>
                  <Link to="/create-job" onClick={toggleMenu} className="nav-icon-link">
                    <PlusSquare size={18} /> Жұмыс қосу
                  </Link>
                </>
              )}

              {user.role === 'ADMIN' && (
                <Link to="/admin" onClick={toggleMenu} className="nav-icon-link">
                  <Shield  size={18} /> Админ
                </Link>
              )}
              
              <Link to="/notifications" onClick={toggleMenu} className="nav-icon-link">
                <Bell size={18} /> Хабарламалар
              </Link>
              
              <Link to="/profile" onClick={toggleMenu} className="nav-icon-link">
                <User size={18} /> Профиль
              </Link>
              
              <button className="btn-logout" onClick={handleLogout}>Шығу</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu}>Кіру</Link>
              <Link to="/register" className="btn-primary" onClick={toggleMenu}>Тіркелу</Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;