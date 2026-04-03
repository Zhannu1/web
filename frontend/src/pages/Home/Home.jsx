import { Link } from 'react-router-dom';
import { Search, Briefcase, Zap, Users, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section animate-fade-in">
        <div className="hero-content">
          <h1 className="hero-title">
            Өз арманыңыздағы жұмысты <span>бүгін</span> табыңыз
          </h1>
          <p className="hero-subtitle">
            Қазақстанның үздік компанияларынан мыңдаған вакансиялар мен мансаптық мүмкіндіктер.
          </p>
          {/* <div className="hero-buttons">
            <Link to="/jobs" className="btn-primary hero-btn">
              <Search size={20} /> Жұмыс іздеу
            </Link>
            <Link to="/create-job" className="btn-outline hero-btn">
              <Briefcase size={20} /> Вакансия жариялау
            </Link>
          </div>*/}
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title animate-slide-up">Неліктен бізді таңдайды?</h2>
        <div className="features-grid">
          <div className="feature-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="feature-icon zap-icon">
              <Zap size={32} />
            </div>
            <h3>Жылдам іздеу</h3>
            <p>Өзіңізге қажетті вакансияларды санаулы секундтарда тауып, бірден өтініш қалдырыңыз.</p>
          </div>
          
          <div className="feature-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="feature-icon users-icon">
              <Users size={32} />
            </div>
            <h3>Тікелей байланыс</h3>
            <p>Жұмыс берушілермен ешқандай делдалсыз, тікелей платформа арқылы байланысқа шығыңыз.</p>
          </div>
          
          <div className="feature-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="feature-icon trending-icon">
              <TrendingUp size={32} />
            </div>
            <h3>Мансаптық өсу</h3>
            <p>Үздік компанияларға жұмысқа орналасып, өз карьераңызды жаңа деңгейге көтеріңіз.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;