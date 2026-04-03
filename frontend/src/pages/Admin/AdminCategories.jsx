import { useState, useEffect } from 'react';
import { Trash2, Plus, Tags } from 'lucide-react';
import api from '../../utils/api';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAdding(true);
    try {
      const res = await api.post('/admin/categories', { name: newCategory });
      setCategories([...categories, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategory('');
    } catch (error) {
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" категориясын өшіруге сенімдісіз бе? Оған байланысты вакансиялар категориясыз қалуы мүмкін.`)) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="loader">Жүктелуде...</div>;

  return (
    <div className="admin-page animate-fade-in">
      <h2>Категорияларды басқару ({categories.length})</h2>

      <form className="add-category-form" onSubmit={handleAddCategory}>
        <Tags size={20} color="#64748b" />
        <input 
          type="text" 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)} 
          placeholder="Жаңа категория атауы (мысалы: IT, Маркетинг)" 
          required 
        />
        <button type="submit" className="btn-primary-admin" disabled={adding}>
          <Plus size={18} />
          {adding ? 'Қосылуда...' : 'Қосу'}
        </button>
      </form>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Категория атауы</th>
              <th>Әрекет</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td className="text-muted">{cat.id}</td>
                <td className="category-name">{cat.name}</td>
                <td>
                  <button className="btn-delete-table" onClick={() => handleDelete(cat.id, cat.name)}>
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

export default AdminCategories;