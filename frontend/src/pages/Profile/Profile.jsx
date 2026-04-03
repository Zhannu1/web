import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { User, Edit, Briefcase, GraduationCap, Star } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { buildAssetUrl } from '../../utils/runtimeConfig';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/profile/me').then(res => {
      if (res.data.role === 'USER') {
        setProfileData(res.data.Resume);
      } else {
        setProfileData(res.data.Company);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loader">Жүктелуде...</div>;

  const renderTimeline = (data, type) => {
    if (!data) return <p style={{color: '#64748b'}}>Мәлімет жоқ</p>;
    
    let parsedData = [];
    try {
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.error("JSON parse қатесі:", e);
    }

    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return <p style={{color: '#64748b'}}>Мәлімет жоқ</p>;
    }

    return (
      <div className="timeline-container animate-slide-up">
        <div className="timeline">
          {parsedData.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>
              
              {type === 'experience' ? (
                <>
                  <span className="timeline-date">{item.startDate} — {item.endDate || 'Қазіргі уақыт'}</span>
                  <h4 className="timeline-title">{item.position}</h4>
                  <p className="timeline-subtitle">{item.company}</p>
                  <p className="timeline-desc">{item.description}</p>
                </>
              ) : (
                <>
                  <span className="timeline-date">{item.startYear} — {item.endYear || 'Қазіргі уақыт'}</span>
                  <h4 className="timeline-title">{item.degree}</h4>
                  <p className="timeline-subtitle">{item.institution}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = (skills) => {
    if (!skills) return <p style={{color: '#64748b'}}>Көрсетілмеген</p>;
    
    let parsedSkills = [];
    try {
      parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    } catch (e) {
      console.error("JSON parse қатесі:", e);
    }

    if (!Array.isArray(parsedSkills) || parsedSkills.length === 0) {
      return <p style={{color: '#64748b'}}>Көрсетілмеген</p>;
    }
    
    return (
      <div className="skills-wrapper">
        {parsedSkills.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {profileData?.avatar ? (
            <img src={buildAssetUrl(`uploads/${profileData.avatar}`)} alt="Avatar" />
          ) : (
            <User size={64} />
          )}
        </div>
        <div className="profile-main-info">
          <h2>{profileData?.fullName || user.email.split('@')[0]}</h2>
          <p>{user.email}</p>
          <span className="role-badge">{user.role}</span>
        </div>
        <Link to="/edit-profile" className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Edit size={18} /> Өңдеу
        </Link>
      </div>

      {user.role === 'USER' && profileData && (
        <div className="resume-content">
          
          <div className="content-section">
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
              <Briefcase size={24} color="var(--primary-color)" /> Жұмыс тәжірибесі
            </h3>
            {renderTimeline(profileData.experience, 'experience')}
          </div>

          <div className="content-section">
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
              <GraduationCap size={24} color="var(--primary-color)" /> Білімі
            </h3>
            {renderTimeline(profileData.education, 'education')}
          </div>

          <div className="content-section">
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
              <Star size={24} color="var(--primary-color)" /> Негізгі дағдылар (Skills)
            </h3>
            {renderSkills(profileData.skills)}
          </div>

        </div>
      )}
    </div>
  );
};

export default Profile;
