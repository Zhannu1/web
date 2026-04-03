import { useState, useEffect } from 'react';
import { Trash2, User, Mail, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';
import './AdminTable.css'; 

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Бұл қолданушыны өшіруге сенімдісіз бе? Оның барлық мәліметтері жойылады!")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="loader">Жүктелуде...</div>;

  return (
    <div className="admin-page animate-fade-in">
      <h2>Қолданушыларды басқару ({users.length})</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Қолданушы</th>
              <th>Email</th>
              <th>Рөлі</th>
              <th>Тіркелген күні</th>
              <th>Әрекет</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="text-muted">{user.id.substring(0, 8)}...</td>
                <td>
                  <div className="user-cell">
                    <User size={18} />
                    {user.email.split('@')[0]}
                  </div>
                </td>
                <td>
                  <div className="mail-cell">
                    <Mail size={16} color="#64748b" />
                    {user.email}
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td className="text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-delete-table" onClick={() => handleDelete(user.id)}>
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

export default AdminUsers;