import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Image as ImageIcon, Layout } from 'lucide-react';
import api from '../../utils/api';
import './CreateJob.css';

const CreateJob = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    salary: '',
    categoryId: ''
  });
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    api.get('/extra/categories').then(res => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (logo) data.append('logo', logo);

    try {
      await api.post('/jobs', data);
      navigate('/jobs');
    } catch (err) {
      alert('Қате орын алды');
    }
  };

  return (
    <div className="create-job-page animate-slide-up">
      <div className="form-card">
        <div className="form-header">
          <PlusCircle size={32} color="var(--primary-color)" />
          <h1>Жаңа вакансия қосу</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group-stack">
            <label>Жұмыс атауы</label>
            <input type="text" required onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="input-row">
            <div className="input-group-stack">
              <label>Компания аты</label>
              <input type="text" required onChange={e => setFormData({...formData, company: e.target.value})} />
            </div>
            <div className="input-group-stack">
              <label>Жалақы</label>
              <input type="text" placeholder="Мыс: 400 000 KZT" onChange={e => setFormData({...formData, salary: e.target.value})} />
            </div>
          </div>

          <div className="input-group-stack">
            <label>Категория</label>
            <select required onChange={e => setFormData({...formData, categoryId: e.target.value})}>
              <option value="">Таңдаңыз</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="input-group-stack">
            <label>Толық сипаттама</label>
            <textarea rows="6" required onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div className="file-upload">
            <label htmlFor="logo-upload" className="file-label">
              <ImageIcon size={20} /> {logo ? logo.name : 'Компания логотипін жүктеу'}
            </label>
            <input id="logo-upload" type="file" hidden onChange={e => setLogo(e.target.files[0])} />
          </div>

          <button type="submit" className="submit-btn">Жариялау</button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;