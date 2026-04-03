import { useState, useEffect } from 'react';
import { Trash2, Briefcase, Building, Mail } from 'lucide-react';
import api from '../../utils/api';
import './AdminTable.css';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/admin/jobs');
      setJobs(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Бұл вакансияны өшіруге сенімдісіз бе?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs(jobs.filter(job => job.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="loader">Жүктелуде...</div>;

  return (
    <div className="admin-page animate-fade-in">
      <h2>Вакансияларды басқару ({jobs.length})</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Лауазым</th>
              <th>Компания</th>
              <th>Жұмыс беруші</th>
              <th>Қосылған күні</th>
              <th>Әрекет</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td className="text-muted">{job.id.substring(0, 8)}...</td>
                <td>
                  <div className="job-cell">
                    <Briefcase size={18} color="var(--primary-color)" />
                    {job.title}
                  </div>
                </td>
                <td>
                  <div className="company-cell">
                    <Building size={16} color="#64748b" />
                    {job.company}
                  </div>
                </td>
                <td>
                  <div className="mail-cell">
                    <Mail size={16} color="#64748b" />
                    {job.employer?.email}
                  </div>
                </td>
                <td className="text-muted">{new Date(job.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-delete-table" onClick={() => handleDelete(job.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobs;