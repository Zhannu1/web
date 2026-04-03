import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, DollarSign, Calendar, Briefcase, ChevronLeft, Send, CheckCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { buildAssetUrl } from '../../utils/runtimeConfig';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
        if (user) {
          const apps = await api.get('/applications/my-applications');
          const alreadyApplied = apps.data.some(app => app.jobId === id);
          setApplied(alreadyApplied);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post('/applications', { jobId: id });
      setApplied(true);
      setMessage('Өтінішіңіз сәтті жіберілді!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Қате орын алды');
    }
  };

  if (loading) return <div className="loader">Жүктелуде...</div>;
  if (!job) return <div className="container">Вакансия табылмады</div>;

  return (
    <div className="job-details-page animate-fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Артқа
      </button>

      <div className="job-details-container">
        <div className="job-main-card">
          <div className="job-header-flex">
            <div className="job-logo-large">
              {job.logo ? <img src={buildAssetUrl(`uploads/${job.logo}`)} alt="logo" /> : <Building size={40} />}
            </div>
            <div className="job-title-group">
              <h1>{job.title}</h1>
              <p className="company-link">{job.company}</p>
            </div>
          </div>

          <div className="job-meta-grid">
            <div className="meta-item">
              <DollarSign size={20} />
              <div>
                <span>Жалақы</span>
                <p>{job.salary || 'Келісім бойынша'}</p>
              </div>
            </div>
            <div className="meta-item">
              <Briefcase size={20} />
              <div>
                <span>Түрі</span>
                <p>Толық жұмыс күні</p>
              </div>
            </div>
            <div className="meta-item">
              <Calendar size={20} />
              <div>
                <span>Жарияланды</span>
                <p>{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="job-description-content">
            <h3>Жұмыс сипаттамасы</h3>
            <p>{job.description}</p>
          </div>

          {user?.role !== 'EMPLOYER' && (
            <div className="apply-section">
              {applied ? (
                <div className="applied-badge">
                  <CheckCircle size={20} /> Сіз өтініш жібердіңіз
                </div>
              ) : (
                <button className="apply-btn" onClick={handleApply}>
                  <Send size={20} /> Жұмысқа орналасу
                </button>
              )}
              {message && <p className="status-msg">{message}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
