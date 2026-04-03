import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, GraduationCap, Star, Plus, Trash2, Save, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import './EditProfile.css';

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(null);

  const [skills, setSkills] = useState(['']);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    api.get('/profile/me').then(res => {
      if (res.data && res.data.Resume) {
        const resume = res.data.Resume;
        setFullName(resume.fullName || '');
        
        try {
          const parsedSkills = typeof resume.skills === 'string' ? JSON.parse(resume.skills) : resume.skills;
          const parsedExp = typeof resume.experience === 'string' ? JSON.parse(resume.experience) : resume.experience;
          const parsedEdu = typeof resume.education === 'string' ? JSON.parse(resume.education) : resume.education;

          if (parsedSkills?.length) setSkills(parsedSkills);
          if (parsedExp?.length) setExperience(parsedExp);
          if (parsedEdu?.length) setEducation(parsedEdu);
        } catch (e) {
          console.error("JSON parse error", e);
        }
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const addExperience = () => {
    setExperience([...experience, { company: '', position: '', startDate: '', endDate: '', description: '' }]);
  };
  const updateExperience = (index, field, value) => {
    const newExp = [...experience];
    newExp[index][field] = value;
    setExperience(newExp);
  };
  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, { institution: '', degree: '', startYear: '', endYear: '' }]);
  };
  const updateEducation = (index, field, value) => {
    const newEdu = [...education];
    newEdu[index][field] = value;
    setEducation(newEdu);
  };
  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addSkill = () => setSkills([...skills, '']);
  const updateSkill = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };
  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {

      const cleanSkills = skills.filter(s => s.trim() !== '');

      const formData = new FormData();
      formData.append('fullName', fullName);
      if (avatar) formData.append('avatar', avatar);

      formData.append('skills', JSON.stringify(cleanSkills));
      formData.append('experience', JSON.stringify(experience));
      formData.append('education', JSON.stringify(education));

      await api.post('/profile/resume', formData);
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Сақтау кезінде қате орын алды.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader">Жүктелуде...</div>;

  return (
    <div className="edit-profile-page animate-fade-in">
      <div className="edit-profile-header">
        <h2>Түйіндемені өңдеу (Резюме)</h2>
        <button onClick={() => navigate('/profile')} className="btn-close-edit">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        
        <div className="form-section">
          <h3><User size={20} /> Негізгі ақпарат</h3>
          <div className="input-group">
            <label>Аты-жөніңіз</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="Мысалы: Асан Үсенов" 
              required 
            />
          </div>
          <div className="input-group">
            <label>Фото (Аватар)</label>
            <input type="file" onChange={(e) => setAvatar(e.target.files[0])} accept="image/*" />
          </div>
        </div>

        <div className="form-section">
          <h3><Briefcase size={20} /> Жұмыс тәжірибесі</h3>
          {experience.map((exp, index) => (
            <div key={index} className="dynamic-block">
              <button type="button" className="btn-remove" onClick={() => removeExperience(index)}>
                <Trash2 size={18} /> Өшіру
              </button>
              
              <div className="grid-2">
                <div className="input-group">
                  <label>Мекеме атауы</label>
                  <input type="text" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} placeholder="Мысалы: Kaspi Bank" required />
                </div>
                <div className="input-group">
                  <label>Лауазымы</label>
                  <input type="text" value={exp.position} onChange={(e) => updateExperience(index, 'position', e.target.value)} placeholder="Мысалы: Frontend Developer" required />
                </div>
              </div>
              
              <div className="grid-2">
                <div className="input-group">
                  <label>Бастаған уақыты</label>
                  <input type="month" value={exp.startDate} onChange={(e) => updateExperience(index, 'startDate', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Аяқтаған уақыты</label>
                  <input type="month" value={exp.endDate} onChange={(e) => updateExperience(index, 'endDate', e.target.value)} />
                  <small style={{color: '#94a3b8'}}>Қазір жұмыс істесеңіз, бос қалдырыңыз</small>
                </div>
              </div>

              <div className="input-group">
                <label>Атқарған міндеттеріңіз</label>
                <textarea value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} rows="3" placeholder="Немен айналыстыңыз, қандай жетістіктерге жеттіңіз?"></textarea>
              </div>
            </div>
          ))}
          <button type="button" className="btn-add-dynamic" onClick={addExperience}>
            <Plus size={18} /> Тәжірибе қосу
          </button>
        </div>

        <div className="form-section">
          <h3><GraduationCap size={20} /> Білімі (Оқу орындары)</h3>
          {education.map((edu, index) => (
            <div key={index} className="dynamic-block">
              <button type="button" className="btn-remove" onClick={() => removeEducation(index)}>
                <Trash2 size={18} /> Өшіру
              </button>
              
              <div className="grid-2">
                <div className="input-group">
                  <label>Оқу орны</label>
                  <input type="text" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} placeholder="Мысалы: ЕҰУ" required />
                </div>
                <div className="input-group">
                  <label>Мамандығы / Дәрежесі</label>
                  <input type="text" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} placeholder="Мысалы: Бакалавр, Ақпараттық жүйелер" required />
                </div>
              </div>
              
              <div className="grid-2">
                <div className="input-group">
                  <label>Түскен жылы</label>
                  <input type="number" min="1950" max="2030" value={edu.startYear} onChange={(e) => updateEducation(index, 'startYear', e.target.value)} placeholder="2018" required />
                </div>
                <div className="input-group">
                  <label>Бітірген жылы</label>
                  <input type="number" min="1950" max="2030" value={edu.endYear} onChange={(e) => updateEducation(index, 'endYear', e.target.value)} placeholder="2022" />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn-add-dynamic" onClick={addEducation}>
            <Plus size={18} /> Оқу орнын қосу
          </button>
        </div>

        <div className="form-section">
          <h3><Star size={20} /> Негізгі дағдылар</h3>
          <div className="skills-edit-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-input-wrapper">
                <input type="text" value={skill} onChange={(e) => updateSkill(index, e.target.value)} placeholder="Мысалы: React.js" />
                <button type="button" onClick={() => removeSkill(index)} className="btn-remove-skill"><X size={16}/></button>
              </div>
            ))}
          </div>
          <button type="button" className="btn-add-dynamic" onClick={addSkill} style={{marginTop: '1rem', width: 'auto'}}>
            <Plus size={18} /> Дағды қосу
          </button>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/profile')} className="btn-outline">Болдырмау</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Сақталуда...' : <><Save size={20} /> Түйіндемені сақтау</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;