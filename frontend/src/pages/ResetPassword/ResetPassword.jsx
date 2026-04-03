import { useState, useEffect } from 'react';
import { Lock, Key, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../utils/api';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';

  const [formData, setFormData] = useState({ email: emailFromState, code: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!emailFromState) {
      navigate('/forgot-password');
    }
  }, [emailFromState, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword.length < 8) {
      return setError('Құпия сөз кемінде 8 таңбадан тұруы керек.');
    }

    try {
      await api.post('/auth/reset-password', formData);
      setMessage('Пароль сәтті өзгертілді!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Код қате немесе ескірген');
    }
  };

  return (
    <div className="auth-container animate-slide-up">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h1>Жаңа құпия сөз</h1>
          <p style={{color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem'}}>
            Поштаға келген кодты енгізіңіз ({formData.email})
          </p>
        </div>
        
        {message && <div style={{color: 'green', marginBottom: '1rem', textAlign: 'center'}}>{message}</div>}
        {error && <div className="auth-error">{error}</div>}
        
        <div className="input-group">
          <input 
            type="text" 
            placeholder="6-санды код" 
            required 
            onChange={(e) => setFormData({...formData, code: e.target.value})} 
          />
        </div>
        
        <div className="input-group">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Жаңа құпия сөз" 
            required 
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <button type="submit" className="auth-btn">Сақтау</button>
        <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
          <Link to="/login" style={{color: 'var(--primary-color)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
            <ArrowLeft size={16} /> Кіру бетіне оралу
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;