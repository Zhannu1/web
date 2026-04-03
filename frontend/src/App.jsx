import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Jobs from './pages/Jobs/Jobs';
import JobDetails from './pages/JobDetails/JobDetails';
import CreateJob from './pages/CreateJob/CreateJob';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/EditProfile/EditProfile';
import EmployerApplications from './pages/EmployerApplications/EmployerApplications';
import UserApplications from './pages/UserApplications/UserApplications';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import SavedJobs from './pages/SavedJobs/SavedJobs';
import Notifications from './pages/Notifications/Notifications';
import Chat from './pages/Chat/Chat';
import NotFound from './pages/NotFound/NotFound';
import MyJobs from './pages/MyJobs/MyJobs';

import AdminLayout from './pages/Admin/AdminLayout';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminJobs from './pages/Admin/AdminJobs';
import AdminCategories from './pages/Admin/AdminCategories';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--card-bg)',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)',
            },
          }} 
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/chat" element={<Chat />} />
            
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/my-applications" element={<UserApplications />} />
            <Route path="/employer/applications/:jobId" element={<EmployerApplications />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;