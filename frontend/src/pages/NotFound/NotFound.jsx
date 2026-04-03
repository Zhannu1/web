import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page animate-fade-in">
      <h1>404</h1>
      <h2>Бет табылмады</h2>
      <p>Кешіріңіз, сіз іздеген бет жойылған немесе мекенжайы қате енгізілген болуы мүмкін.</p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
        <Home size={20} /> Басты бетке қайту
      </Link>
    </div>
  );
};

export default NotFound;