import { useState, useEffect } from 'react';
import api from '../../utils/api';
import JobCard from '../../components/JobCard/JobCard';
import './SavedJobs.css';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/extra/saved-jobs').then(res => {
      setSavedJobs(res.data);
      setLoading(false);
    });
  }, []);


  const handleRemove = (jobId) => {
    setSavedJobs(prev => prev.filter(item => item.jobId !== jobId));
  };

  if (loading) return <div className="loader">Жүктелуде...</div>;

  return (
    <div className="saved-jobs-page animate-fade-in">
      <h2 className="saved-jobs-title">Сақталған вакансиялар</h2>
      <div className="saved-jobs-grid">
        {savedJobs.length === 0 ? (
          <p className="empty-saved">Ештеңе сақталмаған</p>
        ) : (
          savedJobs.map(item => (
            <JobCard 
              key={item.id} 
              job={item.Job} 
              initialIsSaved={true} 
              onRemove={handleRemove} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SavedJobs;