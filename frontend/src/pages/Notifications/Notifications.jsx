import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../../utils/api';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/extra/notifications').then(res => setNotifications(res.data));
  }, []);

  return (
    <div className="notifications-page animate-fade-in">
      <h2 className="notif-header">
        <Bell size={24} /> Хабарламалар
      </h2>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <p className="empty-notif">Әзірге хабарлама жоқ</p>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="notif-card">
              <p>{notif.message}</p>
              <span className="notif-date">{new Date(notif.createdAt).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;