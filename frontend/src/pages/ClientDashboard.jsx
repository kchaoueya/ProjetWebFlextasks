import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfile from '../components/UserProfile';
import ChatModal from '../components/ChatModal';
import RatingModal from '../components/RatingModal';

const TASK_CATEGORIES = [
  { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
  { id: 'cooking', name: 'Cooking', icon: '🍳' },
  { id: 'dog-walking', name: 'Dog Walking', icon: '🐕' },
  { id: 'babysitting', name: 'Babysitting', icon: '👶' },
  { id: 'gardening', name: 'Gardening', icon: '🌱' },
  { id: 'tutoring', name: 'Tutoring', icon: '📚' },
  { id: 'errands', name: 'Errands', icon: '🛒' },
  { id: 'other', name: 'Other', icon: '✨' },
];

export default function ClientDashboard() {
  const { user, logout, isClient } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [myTasks, setMyTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [chatTask, setChatTask] = useState(null);
  const [chatStudent, setChatStudent] = useState(null);
  const [ratingTask, setRatingTask] = useState(null);
  const [ratingStudent, setRatingStudent] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      // Load tasks posted by this client
      const tasksResponse = await fetch(`${backendUrl}/api/tasks?clientId=${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (tasksResponse.ok) {
        const tasks = await tasksResponse.json();
        setMyTasks(tasks);

        // Extract applications from tasks
        const allApps = [];
        tasks.forEach(task => {
          if (task.applicants && task.applicants.length > 0) {
            task.applicants.forEach(app => {
              allApps.push({
                id: app._id,
                taskId: task._id,
                studentId: app.student._id || app.student,
                studentName: app.student.name,
                status: task.student && task.student._id === app.student._id ? 'accepted' : 'pending',
                appliedAt: app.appliedAt
              });
            });
          }
        });
        setApplications(allApps);
      }

      // Load available students
      const studentsResponse = await fetch(`${backendUrl}/api/auth/students`);
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isClient) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isClient, navigate, loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const requiredFields = { title, description, category, price, date, time, address, city, zipCode };
    const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);
    
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ');
      setError(`Please fill in the following required fields: ${fieldNames}`);
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const newTask = {
        title,
        description,
        category,
        budget: parseFloat(price),
        scheduledDate: date,
        scheduledTime: time,
        location: {
          address,
          city,
          zipCode
        },
        estimatedDuration: duration ? parseFloat(duration) : null,
        status: 'open'
      };

      const response = await fetch(`${backendUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to create task');
        return;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('An error occurred while creating the task');
      return;
    }

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setPrice('');
    setDate('');
    setTime('');
    setAddress('');
    setCity('');
    setZipCode('');
    setDuration('');
    setShowForm(false);
    loadData();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenChat = (task) => {
    // Find the assigned student from task data
    if (task.student) {
      setChatTask(task);
      setChatStudent(task.student);
    } else {
      alert('No student has been assigned to this task yet.');
    }
  };

  const handleCompleteTask = async (task) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Mark task as completed
      const response = await fetch(`${backendUrl}/api/tasks/${task._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      });

      if (response.ok) {
        loadData();

        // Open rating modal
        if (task.student) {
          setRatingTask(task);
          setRatingStudent(task.student);
        }
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleRatingSubmit = () => {
    setRatingTask(null);
    setRatingStudent(null);
  };

  const getApplicationsForTask = (taskId) => {
    return applications.filter(a => a.taskId === taskId);
  };

  const handleAcceptApplication = async (applicationId, taskId) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const application = applications.find(a => a.id === applicationId);
      if (!application) return;
      
      // Assign task to student
      const response = await fetch(`${backendUrl}/api/tasks/${taskId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId: application.studentId })
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLocation = (location) => {
    if (typeof location === 'string') {
      return location;
    }
    if (location?.address) {
      return `${location.address}${location.city ? ', ' + location.city : ''}`;
    }
    return 'Location not specified';
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <span style={styles.logo}>👤 FlexTasks</span>
          <span style={styles.roleLabel}>Client Portal</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.userName}>Hi, {user?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div>
              <h1 style={styles.title}>Your Task Dashboard</h1>
              <p style={styles.subtitle}>Post tasks and find reliable students to help</p>
            </div>
            <button onClick={() => setShowForm(true)} style={styles.postBtn}>
              + Post New Task
            </button>
          </div>
        </header>

        {/* Post Task Form Modal */}
        {showForm && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Post a New Task</h2>
                <button onClick={() => setShowForm(false)} style={styles.closeBtn}>✕</button>
              </div>
              
              {error && <div style={styles.error}>{error}</div>}
              
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Task Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                    placeholder="e.g., Help with house cleaning"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select a category</option>
                    {TASK_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.textarea}
                    placeholder="Describe what needs to be done..."
                    rows={4}
                  />
                </div>

                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Price ($)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={styles.input}
                      placeholder="25"
                      min="1"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Duration (hours)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      style={styles.input}
                      placeholder="2"
                      min="0.5"
                      step="0.5"
                    />
                  </div>
                </div>

                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Date *</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Time *</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Address *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={styles.input}
                    placeholder="e.g., 123 Main Street"
                  />
                </div>

                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={styles.input}
                      placeholder="e.g., Boston"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>ZIP Code *</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      style={styles.input}
                      placeholder="02101"
                    />
                  </div>
                </div>

                <div style={styles.formButtons}>
                  <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitBtn}>
                    Post Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* My Tasks */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Your Posted Tasks ({myTasks.length})</h2>

          {myTasks.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>📝</span>
              <h3 style={styles.emptyTitle}>No tasks posted yet</h3>
              <p style={styles.emptyText}>Click &quot;Post New Task&quot; to get started!</p>
            </div>
          ) : (
            <div style={styles.tasksGrid}>
              {myTasks.map(task => {
                const taskApplications = getApplicationsForTask(task._id);
                return (
                  <div key={task._id} style={styles.taskCard}>
                    <div style={styles.taskHeader}>
                      <span style={styles.taskCategory}>
                        {TASK_CATEGORIES.find(c => c.id === task.category)?.icon || '📋'}{' '}
                        {TASK_CATEGORIES.find(c => c.id === task.category)?.name || task.category}
                      </span>
                      <span style={{
                        ...styles.statusBadge,
                        background: task.status === 'open' ? '#e8f5e9' :
                                   task.status === 'completed' ? '#e3f2fd' : '#fff3e0',
                        color: task.status === 'open' ? '#2e7d32' :
                               task.status === 'completed' ? '#1565c0' : '#f57c00',
                      }}>
                        {task.status === 'open' ? 'Open' :
                         task.status === 'completed' ? 'Completed' : 'Assigned'}
                      </span>
                    </div>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <p style={styles.taskDescription}>{task.description}</p>
                    <div style={styles.taskDetails}>
                      <span>💰 ${task.budget}</span>
                      {task.estimatedDuration && <span>⏱️ {task.estimatedDuration}h</span>}
                      <span>📍 {formatLocation(task.location)}</span>
                      <span>📅 {formatDate(task.scheduledDate)}</span>
                      <span>⏰ {task.scheduledTime}</span>
                    </div>

                    {task.status === 'assigned' && (
                      <div style={styles.taskActions}>
                        <button
                          onClick={() => handleOpenChat(task)}
                          style={styles.chatButton}
                        >
                          💬 Chat with Student
                        </button>
                        <button
                          onClick={() => handleCompleteTask(task)}
                          style={styles.completeButton}
                        >
                          ✓ Mark as Complete
                        </button>
                      </div>
                    )}

                    {task.status === 'completed' && (
                      <div style={styles.completedBanner}>
                        <span>✓ Task Completed</span>
                      </div>
                    )}

                    {taskApplications.length > 0 && (
                      <div style={styles.applicationsSection}>
                        <h4 style={styles.applicationsTitle}>
                          Applications ({taskApplications.length})
                        </h4>
                        {taskApplications.map(app => (
                          <div key={app.id} style={styles.applicationCard}>
                            <div style={styles.applicationInfo}>
                              <span
                                style={styles.applicantName}
                                onClick={() => setSelectedUserId(app.studentId)}
                              >
                                🎓 {app.studentName}
                              </span>
                              <span style={styles.applicationDate}>
                                Applied {formatDate(app.appliedAt)}
                              </span>
                            </div>
                            {app.status === 'pending' && task.status === 'open' ? (
                              <button
                                onClick={() => handleAcceptApplication(app.id, task._id)}
                                style={styles.acceptBtn}
                              >
                                Accept
                              </button>
                            ) : (
                              <span style={{
                                ...styles.applicationStatus,
                                color: app.status === 'accepted' ? '#2e7d32' : '#888',
                              }}>
                                {app.status === 'accepted' ? '✓ Accepted' : app.status === 'rejected' ? 'Not selected' : 'Pending'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Browse Students */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Available Students ({students.length})</h2>
          <p style={styles.browseSubtitle}>Browse skilled students to match with your tasks</p>

          {students.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🎓</span>
              <h3 style={styles.emptyTitle}>No students available</h3>
              <p style={styles.emptyText}>Check back later for available students!</p>
            </div>
          ) : (
            <div style={styles.studentsGrid}>
              {students.slice(0, 8).map(student => (
                <div key={student._id} style={styles.studentCard}>
                  <div style={styles.studentAvatar}>
                    {student.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <h3 style={styles.studentName}>{student.name}</h3>
                  <div style={styles.studentRating}>
                    <span style={styles.star}>★</span>
                    <span>{student.averageRating?.toFixed(1) || '0.0'}</span>
                    <span style={styles.reviews}>({student.totalRatings || 0})</span>
                  </div>
                  {student.skills && student.skills.length > 0 && (
                    <div style={styles.studentSkills}>
                      {student.skills.slice(0, 2).map(skill => (
                        <span key={skill} style={styles.skillTag}>{skill}</span>
                      ))}
                    </div>
                  )}
                  {student.hourlyRate && (
                    <p style={styles.studentRate}>${student.hourlyRate}/hr</p>
                  )}
                  <button
                    onClick={() => setSelectedUserId(student._id)}
                    style={styles.viewStudentBtn}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfile 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}

      {/* Chat Modal */}
      {chatTask && chatStudent && (
        <ChatModal 
          task={chatTask}
          currentUser={user}
          otherUser={chatStudent}
          onClose={() => {
            setChatTask(null);
            setChatStudent(null);
          }}
        />
      )}

      {/* Rating Modal */}
      {ratingTask && ratingStudent && (
        <RatingModal 
          task={ratingTask}
          ratedUser={ratingStudent}
          ratedBy={user}
          onSubmit={handleRatingSubmit}
          onClose={() => {
            setRatingTask(null);
            setRatingStudent(null);
          }}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
  },
  nav: {
    background: 'white',
    padding: '16px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#d7747e',
  },
  roleLabel: {
    background: '#e3f2fd',
    color: '#1565c0',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userName: {
    fontSize: '16px',
    color: '#333',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    marginBottom: '40px',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
  },
  postBtn: {
    background: '#d7747e',
    color: 'white',
    padding: '14px 28px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#888',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
  },
  select: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    background: 'white',
  },
  textarea: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  formButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
    marginTop: '16px',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #ddd',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  submitBtn: {
    background: '#d7747e',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '16px',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  section: {
    marginTop: '40px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '24px',
  },
  tasksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '24px',
  },
  taskCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  taskCategory: {
    background: '#f0f0f0',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  taskDescription: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '16px',
  },
  taskDetails: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    fontSize: '14px',
    color: '#888',
    marginBottom: '16px',
  },
  applicationsSection: {
    borderTop: '1px solid #eee',
    paddingTop: '16px',
  },
  applicationsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
  },
  applicationCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  applicationInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  applicantName: {
    fontWeight: '500',
    color: '#333',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  applicationDate: {
    fontSize: '12px',
    color: '#888',
  },
  acceptBtn: {
    background: '#2e7d32',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
  },
  applicationStatus: {
    fontSize: '14px',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#666',
  },
  taskActions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  chatButton: {
    flex: 1,
    background: '#2e7d32',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
  },
  completeButton: {
    flex: 1,
    background: '#1976d2',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
  },
  completedBanner: {
    marginTop: '16px',
    padding: '12px',
    background: '#e3f2fd',
    color: '#1565c0',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '500',
  },
  browseSubtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px',
  },
  studentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  studentCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
  },
  studentAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#d7747e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 auto 12px',
  },
  studentName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  studentRating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginBottom: '12px',
  },
  star: {
    color: '#ffc107',
  },
  reviews: {
    color: '#666',
    fontSize: '12px',
  },
  studentSkills: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  skillTag: {
    background: '#e3f2fd',
    color: '#1565c0',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '500',
  },
  studentRate: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#d7747e',
    marginBottom: '12px',
  },
  viewStudentBtn: {
    background: '#d7747e',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '12px',
  },
};
