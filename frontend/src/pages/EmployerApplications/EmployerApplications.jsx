import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, User, MessageSquare, Briefcase, GraduationCap, Star, FileText } from 'lucide-react';
import api from '../../utils/api';
import { buildAssetUrl } from '../../utils/runtimeConfig';
import './EmployerApplications.css';

const EmployerApplications = () => {
  const statusTranslate = {
    'PENDING': 'Күтілуде',
    'ACCEPTED': 'Қабылданды',
    'REJECTED': 'Бас тартылды'
  };

  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);

  // Деплой кезінде суреттерді дұрыс алу үшін:
  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}`, { status });
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status } : app
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const parseJSON = (data) => {
    if (!data) return [];
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch (e) { return []; }
    }
    return data;
  };

  const renderTimeline = (data, type) => {
    const parsedData = parseJSON(data);
    if (!parsedData || parsedData.length === 0) return <p className="empty-text">Мәлімет жоқ</p>;

    return (
      <div className="timeline-container">
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

  if (loading) return <div className="loader">Жүктелуде...</div>;

  return (
    <div className="employer-apps-page animate-fade-in">
      <h2>Үміткерлер тізімі</h2>
      
      <div className="apps-list">
        {applications.length === 0 ? (
          <p className="no-data">Әзірге өтініштер түспеген.</p>
        ) : (
          applications.map(app => {
            const resume = app.Resume || {};
            const skillsParsed = parseJSON(resume.skills);
            const skillsPreview = skillsParsed.slice(0, 3).join(', '); 

            return (
              <div key={app.id} className="app-card">
                <div className="app-user-info">
                  <div className="app-avatar">
                    {resume.avatar ? <img src={buildAssetUrl(`uploads/${resume.avatar}`)} alt="avatar" /> : <User size={24} />}
                  </div>
                  <div>
                    <h4>{resume.fullName || app.User?.email.split('@')[0]}</h4>
                    <p className="app-email">{app.User?.email}</p>
                  </div>
                </div>

                <div className="app-skills-preview">
                  {skillsPreview ? `Дағдылар: ${skillsPreview}${skillsParsed.length > 3 ? '...' : ''}` : 'Дағдылар көрсетілмеген'}
                </div>

                <div className="app-actions">
                  <button className="btn-view-resume" onClick={() => setSelectedResume(resume)}>
                    <FileText size={16} /> Резюме
                  </button>

                  <span className={`status-label ${app.status.toLowerCase()}`}>
                    {statusTranslate[app.status] || app.status}
                  </span>
                                    
                  {app.status === 'PENDING' && (
                    <div className="action-btns">
                      <button className="btn-accept" onClick={() => updateStatus(app.id, 'ACCEPTED')} title="Қабылдау">
                        <Check size={18} />
                      </button>
                      <button className="btn-reject" onClick={() => updateStatus(app.id, 'REJECTED')} title="Бас тарту">
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  {app.status === 'ACCEPTED' && (
                    <button 
                      className="btn-chat"
                      onClick={() => navigate('/chat', { state: { autoSelectId: app.User.id } })}
                    >
                      <MessageSquare size={16} /> Чат
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedResume && (
        <div className="modal-overlay" onClick={() => setSelectedResume(null)}>
          <div className="modal-content resume-modal animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Үміткер түйіндемесі</h2>
              <button className="btn-close" onClick={() => setSelectedResume(null)}><X size={24} /></button>
            </div>
            
            <div className="modal-body resume-modal-body">
              <div className="resume-header">
                <div className="resume-avatar-large">
                  {selectedResume.avatar ? <img src={buildAssetUrl(`uploads/${selectedResume.avatar}`)} alt="Avatar" /> : <User size={48} />}
                </div>
                <div>
                  <h3>{selectedResume.fullName || 'Аты-жөні көрсетілмеген'}</h3>
                </div>
              </div>

              <div className="content-section">
                <h3><Briefcase size={20} color="var(--primary-color)" /> Жұмыс тәжірибесі</h3>
                {renderTimeline(selectedResume.experience, 'experience')}
              </div>

              <div className="content-section">
                <h3><GraduationCap size={20} color="var(--primary-color)" /> Білімі</h3>
                {renderTimeline(selectedResume.education, 'education')}
              </div>

              <div className="content-section">
                <h3><Star size={20} color="var(--primary-color)" /> Дағдылары</h3>
                <div className="skills-wrapper">
                  {parseJSON(selectedResume.skills).length > 0 ? (
                    parseJSON(selectedResume.skills).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))
                  ) : (
                    <p className="empty-text">Көрсетілмеген</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;
