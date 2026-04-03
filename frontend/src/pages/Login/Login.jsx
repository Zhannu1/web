import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.token, res.data.user);
      toast.success('Жүйеге сәтті кірдіңіз!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email немесе құпия сөз қате');
    }
  };

  return (
    <div className="auth-container animate-slide-up">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <LogIn size={40} color="var(--primary-color)" />
          <h1>Кіру</h1>
        </div>

        <div className="input-group">
          <input 
            type="email" 
            placeholder="Email" 
            required 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="input-group">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Құпия сөз" 
            required 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit" className="auth-btn">Кіру</button>
        <p className="auth-footer">Аккаунтыңыз жоқ па? <Link to="/register">Тіркелу</Link></p>
      </form>
    </div>
  );
};

export default Login;