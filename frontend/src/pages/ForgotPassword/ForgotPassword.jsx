import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('Код поштаңызға жіберілді. Енді жаңа пароль орнатыңыз.');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Қате орын алды');
    }
  };

  return (
    <div className="auth-container animate-slide-up">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h1>Құпия сөзді қалпына келтіру</h1>
        </div>
        {message && <div style={{color: 'green', marginBottom: '1rem', textAlign: 'center'}}>{message}</div>}
        {error && <div className="auth-error">{error}</div>}
        
        <div className="input-group">
          <input type="email" placeholder="Тіркелген Email" required onChange={(e) => setEmail(e.target.value)} />
        </div>
        
        <button type="submit" className="auth-btn">Код жіберу</button>
        <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
          <Link to="/login" style={{color: 'var(--primary-color)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
            <ArrowLeft size={16} /> Артқа
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;