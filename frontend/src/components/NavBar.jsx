import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar(){
    const { user, logout, isAuthenticated, isStudent, isClient } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDashboard = () => {
        if (isStudent) {
            navigate('/student-dashboard');
        } else if (isClient) {
            navigate('/client-dashboard');
        }
    };

    return(
        <nav style={styles.nav}>
            <div style={styles.left}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={styles.logoCircle}>FT</div>
                <span style={styles.logoText}>FlexTasks</span>
            </Link>
            </div>
            <ul style={styles.menu}>
                <li><Link to="/" style={styles.menuLink}>Home</Link></li>
                <li>
                    <Link to={{ pathname: '/', hash: '#how-it-works' }} style={styles.menuLink}>
                        How It Works
                    </Link>
                </li>
                <li><a href="#about" style={styles.menuLink}>About</a></li>
                <li><a href="#contact" style={styles.menuLink}>Contact</a></li>
            </ul>
            <div style={styles.right}>
                {isAuthenticated ? (
                    <>
                        <span style={styles.userName}>Hi, {user?.name}</span>
                        <button onClick={handleDashboard} style={styles.dashboard}>
                            Dashboard
                        </button>
                        <button onClick={handleLogout} style={styles.login}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button style={styles.login}>Login</button>
                        </Link>
                        <Link to="/signup" style={{ textDecoration: 'none' }}>
                            <button style={styles.signup}>Sign Up</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
const styles ={
    nav:{
        width:"100%",
        padding:"20px 50px",
        display:"flex",
        alignItems:"center",
        justifyContent: "space-between",
        borderBottom:"#fff",
        position: "sticky",
        top:0,
        zIndex: 100,
        background: "white",
    },
    left: { 
        display: "flex",
        alignItems:"center",
        gap:"12px"
    },
    logoCircle:{
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        background: "#d7747e",
        display: "flex",
        justifyContent: "center",
        alignItems:"center",
        color: "white",
        fontWeight: "bold",
    },
    logoText: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#d7747e" 
    },
    menu: {
    listStyle: "none",
    display: "flex",
    gap: "40px",
    fontSize: "16px",
    color: "#444",
    },
    menuLink: {
        textDecoration: "none",
        color: "#444",
        transition: "color 0.2s",
        cursor: "pointer",
    },
    right: {
        display: "flex", 
        gap: "12px",
        alignItems: "center",
    },
    userName: {
        fontSize: "14px",
        color: "#666",
    },
    dashboard: {
        background: "#e8f5e9",
        padding: "8px 16px",
        borderRadius: "8px",
        color: "#2e7d32",
        border: "none",
        cursor: "pointer",
        fontWeight: "500",
    },
     login: {
    background: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  signup: {
    background: "#d7747e",
    padding: "8px 16px",
    borderRadius: "8px",
    color: "white",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
  },
}