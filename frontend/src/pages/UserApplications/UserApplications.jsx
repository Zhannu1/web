import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import api from '../../utils/api';
import './UserApplications.css';

const UserApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const statusTranslate = {
    'PENDING': 'Күтілуде',
    'ACCEPTED': 'Қабылданды',
    'REJECTED': 'Бас тартылды'
  };

  useEffect(() => {
    api.get('/applications/my-applications').then(res => {
      setApps(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loader">Жүктелуде...</div>;

  return (
    <div className="user-apps-page animate-fade-in">
      <h2>Менің өтініштерім</h2>
      <div className="user-apps-grid">
        {apps.map(app => (
          <div key={app.id} className="user-app-card">
            <div className="app-job-header">
              <Briefcase size={20} color="var(--primary-color)" />
              <h4>{app.Job?.title}</h4>
            </div>
            <p className="app-company">{app.Job?.company}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div className={`app-status-tag ${app.status.toLowerCase()}`}>
                {app.status === 'PENDING' && <Clock size={14} />}
                {app.status === 'ACCEPTED' && <CheckCircle size={14} />}
                {app.status === 'REJECTED' && <XCircle size={14} />}
                {statusTranslate[app.status] || app.status}
              </div>

              {app.status === 'ACCEPTED' && (
                <button 
                  onClick={() => navigate('/chat', { state: { autoSelectId: app.Job.userId } })}
                  style={{ background: 'var(--primary-color)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', display: 'flex', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  <MessageSquare size={16} /> Чатқа өту
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserApplications;