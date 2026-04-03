import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, PlusCircle } from 'lucide-react';
import api from '../../utils/api';
import './MyJobs.css';

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/my-jobs').then(res => {
      setMyJobs(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loader">Жүктелуде...</div>;

  return (
    <div className="my-jobs-page animate-fade-in">
      <div className="my-jobs-header">
        <h2>Менің вакансияларым</h2>
        <Link to="/create-job" className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <PlusCircle size={20} /> Жаңа жұмыс қосу
        </Link>
      </div>

      <div className="my-jobs-grid">
        {myJobs.length === 0 ? (
          <p style={{ color: '#64748b' }}>Сіз әлі ешқандай жұмыс жарияламадыңыз.</p>
        ) : (
          myJobs.map(job => (
            <div key={job.id} className="my-job-card">
              <h3><Briefcase size={20} /> {job.title}</h3>
              <p className="job-date">Жарияланды: {new Date(job.createdAt).toLocaleDateString()}</p>
              
              <div className="job-stats">
                <Users size={18} />
                <span>Үміткерлер: <strong>{job.Applications?.length || 0}</strong></span>
              </div>

              <Link to={`/employer/applications/${job.id}`} className="btn-outline" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>
                Өтініштерді көру
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyJobs;