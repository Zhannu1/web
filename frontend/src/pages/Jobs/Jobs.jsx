import { useState, useEffect } from 'react';
import { Search, Filter, Loader2, X } from 'lucide-react';
import api from '../../utils/api';
import JobCard from '../../components/JobCard/JobCard';
import './Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        page,
        limit: 6,
      });
      
      if (selectedCategory) {
        query.append('categoryId', selectedCategory);
      }

      const res = await api.get(`/jobs?${query.toString()}`);
      setJobs(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/extra/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  const fetchSavedJobs = async () => {
    try {
      if (localStorage.getItem('token')) {
        const res = await api.get('/extra/saved-jobs');
        setSavedJobIds(res.data.map(item => item.jobId));
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchCategories();
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [page, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const applyFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
    setIsFilterOpen(false);
  };

  const clearFilter = () => {
    setSelectedCategory('');
    setPage(1);
    setIsFilterOpen(false);
  };

  return (
    <div className="jobs-page animate-fade-in">
      <section className="search-section">
        <form onSubmit={handleSearch} className="search-bar">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Жұмыс іздеу..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="btn-filter" onClick={() => setIsFilterOpen(true)}>
            <Filter size={20} />
          </button>
          <button type="submit" className="btn-search">Іздеу</button>
        </form>
      </section>

      {isFilterOpen && (
        <div className="modal-overlay" onClick={() => setIsFilterOpen(false)}>
          <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Фильтр</h2>
              <button className="btn-close" onClick={() => setIsFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="filter-group">
                <label>Категория бойынша</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => applyFilter(e.target.value)}
                >
                  <option value="">Барлық категориялар</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-outline" onClick={clearFilter}>
                Тазарту
              </button>
              <button className="btn-primary" onClick={() => setIsFilterOpen(false)}>
                Қолдану
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="jobs-container">
        {loading ? (
          <div className="loader"><Loader2 className="spin" size={40} /></div>
        ) : (
          <>
            <div className="jobs-grid">
              {jobs.length === 0 ? (
                <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b'}}>
                  Вакансиялар табылмады
                </div>
              ) : (
                jobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    initialIsSaved={savedJobIds.includes(job.id)} 
                  />
                ))
              )}
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i + 1} 
                    className={page === i + 1 ? 'active' : ''}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;