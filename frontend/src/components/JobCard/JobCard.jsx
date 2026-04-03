import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, DollarSign, Calendar, Bookmark } from 'lucide-react';
import api from '../../utils/api';
import { buildAssetUrl } from '../../utils/runtimeConfig';
import './JobCard.css';

const JobCard = ({ job, initialIsSaved = false, onRemove }) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/extra/saved-jobs', { jobId: job.id });
      const newSavedState = res.data.isSaved; 
      setIsSaved(newSavedState);
      

      if (!newSavedState && onRemove) {
        onRemove(job.id);
      }
    } catch (err) {
      alert('Сақтау үшін жүйеге кіріңіз');
    }
  };

  return (
    <div className="job-card animate-slide-up">
      <div className="job-card-header">
        <div className="job-logo">
          {job.logo ? <img src={buildAssetUrl(`uploads/${job.logo}`)} alt="logo" /> : <Building size={24} />}
        </div>
        <div className="job-info" style={{ flex: 1 }}>
          <h3>{job.title}</h3>
          <p className="company-name">{job.company}</p>
        </div>
        
        <button 
          onClick={handleToggleSave} 
          style={{ 
            background: 'transparent', 
            color: isSaved ? 'var(--primary-color)' : '#94a3b8',
            transition: 'color 0.3s ease, transform 0.2s ease',
            transform: isSaved ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
        </button>

      </div>
      <div className="job-details">
        <span><DollarSign size={16} /> {job.salary || 'Келісім бойынша'}</span>
        <span><Calendar size={16} /> {new Date(job.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="job-description">{job.description?.substring(0, 100)}...</p>
      <Link to={`/jobs/${job.id}`} className="btn-outline-link">Толығырақ</Link>
    </div>
  );
};

export default JobCard;
