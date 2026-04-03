import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, Building, TrendingUp, UserCheck } from 'lucide-react';
// Recharts кітапханасынан керек компоненттерді импорттаймыз
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Статистика жүктелуде...</div>;
  if (!stats) return <div className="error">Мәлімет алу мүмкін болмады.</div>;

  // 1. Статистикалық карточкалар мәліметі
  const cardData = [
    { title: 'Барлық қолданушылар', value: stats.cards.totalUsers, icon: Users, color: '#3b82f6' },
    { title: 'Жұмыс іздеушілер', value: stats.cards.totalSeekers, icon: UserCheck, color: '#10b981' },
    { title: 'Жұмыс берушілер', value: stats.cards.totalEmployers, icon: Building, color: '#f59e0b' },
    { title: 'Бос жұмыс орындары', value: stats.cards.totalJobs, icon: Briefcase, color: '#8b5cf6' },
    { title: 'Өтініштер (Applications)', value: stats.cards.totalApplications, icon: FileText, color: '#ef4444' },
    { title: 'Тіркелген компаниялар', value: stats.cards.totalCompanies, icon: Building, color: '#ec4899' },
  ];

  return (
    <div className="admin-dashboard-page animate-fade-in">
      <div className="admin-header">
        <h2><TrendingUp size={28} color="var(--primary-color)" /> Басқару тақтасы (Admin Dashboard)</h2>
        <p>Сайттың негізгі көрсеткіштері мен статистикасы</p>
      </div>

      {/* 1. КАРТОЧКАЛАР БӨЛІМІ (Stats Cards) */}
      <div className="stats-cards-grid">
        {cardData.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="stats-card" style={{ borderLeftColor: card.color }}>
              <div className="card-icon-wrapper" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                <Icon size={24} />
              </div>
              <div className="card-info">
                <p className="card-title">{card.title}</p>
                <h3 className="card-value">{card.value.toLocaleString()}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. ГРАФИКТЕР БӨЛІМІ (Charts) */}
      <div className="charts-grid">
        
        {/* А) СЫЗЫҚТЫ ГРАФИК (Line Chart) - Жаңа қолданушылар */}
        <div className="chart-container">
          <h3>Соңғы 7 күндегі жаңа қолданушылар динамикасы</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.charts.userDynamics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="count" name="Жаңа юзерлер" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, strokeWidth: 3 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Ә) БАҒАНАЛЫ ГРАФИК (Bar Chart) - Жаңа вакансиялар */}
        <div className="chart-container">
          <h3>Соңғы 7 күндегі жаңа вакансиялар динамикасы</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.charts.jobDynamics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }} cursor={{fill: 'rgba(59, 130, 246, 0.05)'}} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="count" name="Жаңа жұмыстар" fill="#10b981" radius={[8, 8, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;