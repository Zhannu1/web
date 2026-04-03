import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Eye, EyeOff, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Register.css'; 

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'USER' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      return toast.error('Электрондық пошта пішімі қате.');
    }
    if (formData.password.length < 8) {
      return toast.error('Құпия сөз кемінде 8 таңбадан тұруы керек.');
    }
    if (formData.password !== confirmPassword) {
      return toast.error('Құпия сөздер сәйкес келмейді.');
    }

    try {
      await api.post('/auth/register', formData);
      toast.success('Сәтті тіркелдіңіз! Енді жүйеге кіріңіз.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Тіркелу кезінде қате орын алды');
    }
  };

  return (
    <div className="auth-container animate-slide-up">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-header">
          <UserPlus size={40} color="var(--primary-color)" />
          <h1>Тіркелу</h1>
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
            placeholder="Құпия сөз (кемі 8 таңба)" 
            required 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="input-group">
          <input 
            type={showConfirm ? "text" : "password"} 
            placeholder="Құпия сөзді қайталаңыз" 
            required 
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="input-group role-select-group"> 
          <User size={20} className="input-icon-left" />
          
          <ChevronDown size={18} className="custom-select-arrow" /> 
          
          <select onChange={(e) => setFormData({...formData, role: e.target.value})} required>
            <option value="USER">Жұмыс іздеуші</option>
            <option value="EMPLOYER">Жұмыс беруші</option>
          </select>
        </div>

        <button type="submit" className="auth-btn">Тіркелу</button>
        <p className="auth-footer">Аккаунтыңыз бар ма? <Link to="/login">Кіру</Link></p>
      </form>
    </div>
  );
};

export default Register;