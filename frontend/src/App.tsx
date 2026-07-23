```tsx
import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://mini-erp-crm-backend-zpdv.onrender.com";

interface User {
  id: number;
  email: string;
  role: string;
}

interface DashboardResponse {
  message: string;
  user: User;
}

function App() {
  // ==========================================
  // STATE
  // ==========================================

  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  // ==========================================
  // GET TOKEN
  // ==========================================

  const token = localStorage.getItem("token");

  // ==========================================
  // API REQUEST HELPER
  // ==========================================

  const apiRequest = async (
    endpoint: string
  ) => {
    try {
      const response = await fetch(
        `${API_URL}${endpoint}`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Request failed"
        );
      }

      return result;

    } catch (error) {
      console.error(
        "API Error:",
        error
      );

      throw error;
    }
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  const loadDashboard =
    async () => {

      if (!token) {
        setMessage(
          "No login token found. Please login first."
        );

        setLoading(false);

        return;
      }

      try {

        const result =
          await apiRequest(
            "/api/dashboard"
          );

        setUser(
          result.user
        );

        setMessage(
          result.message
        );

      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        );

        setMessage(
          "Unable to load dashboard. Please login again."
        );

        localStorage.removeItem(
          "token"
        );

      } finally {

        setLoading(false);

      }
    };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadDashboard();

  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);

    window.location.reload();

  };

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  const openAdminDashboard =
    async () => {

      try {

        const result =
          await apiRequest(
            "/api/dashboard/admin"
          );

        setActivePage(
          "admin"
        );

        setMessage(
          result.message
        );

      } catch (error) {

        setMessage(
          "Admin access denied"
        );

      }
    };

  // ==========================================
  // MANAGER DASHBOARD
  // ==========================================

  const openManagerDashboard =
    async () => {

      try {

        const result =
          await apiRequest(
            "/api/dashboard/manager"
          );

        setActivePage(
          "manager"
        );

        setMessage(
          result.message
        );

      } catch (error) {

        setMessage(
          "Manager access denied"
        );

      }
    };

  // ==========================================
  // EMPLOYEE DASHBOARD
  // ==========================================

  const openEmployeeDashboard =
    async () => {

      try {

        const result =
          await apiRequest(
            "/api/dashboard/employee"
          );

        setActivePage(
          "employee"
        );

        setMessage(
          result.message
        );

      } catch (error) {

        setMessage(
          "Employee access denied"
        );

      }
    };

  // ==========================================
  // USER MANAGEMENT
  // ADMIN ONLY
  // ==========================================

  const openUserManagement =
    async () => {

      try {

        const result =
          await apiRequest(
            "/api/dashboard/users"
          );

        setActivePage(
          "users"
        );

        setMessage(
          result.message
        );

      } catch (error) {

        setMessage(
          "Only administrators can access User Management"
        );

      }
    };

  // ==========================================
  // SALES
  // ADMIN + MANAGER
  // ==========================================

  const openSales =
    async () => {

      try {

        const result =
          await apiRequest(
            "/api/dashboard/sales"
          );

        setActivePage(
          "sales"
        );

        setMessage(
          result.message
        );

      } catch (error) {

        setMessage(
          "Only Admin and Manager can access Sales"
        );

      }
    };

  // ==========================================
  // PROFILE
  // ==========================================

  const openProfile =
    async () => {

      try {

        const result =
          await apiRequest(
            "/api/dashboard/profile"
          );

        setActivePage(
          "profile"
        );

        setMessage(
          result.message
        );

      } catch (error) {

        setMessage(
          "Unable to load profile"
        );

      }
    };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (

      <div className="app">

        <main className="main-content">

          <div className="overview-card">

            <h2>
              Loading Dashboard...
            </h2>

            <p>
              Connecting to backend...
            </p>

          </div>

        </main>

      </div>

    );

  }

  // ==========================================
  // NO TOKEN
  // ==========================================

  if (!token) {

    return (

      <div className="app">

        <main className="main-content">

          <div className="overview-card">

            <h1>
              Mini ERP CRM
            </h1>

            <h2>
              Authentication Required
            </h2>

            <p>
              Please login to access your dashboard.
            </p>

            <p className="form-message">
              {message}
            </p>

          </div>

        </main>

      </div>

    );

  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="app">

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="sidebar">

        <div className="logo">
          Mini ERP CRM
        </div>

        <nav>

          <a
            className={
              activePage === "dashboard"
                ? "active"
                : ""
            }
            onClick={() => {

              setActivePage(
                "dashboard"
              );

              loadDashboard();

            }}
          >
            Dashboard
          </a>


          {/* ADMIN */}

          {user?.role === "admin" && (

            <a
              className={
                activePage === "admin"
                  ? "active"
                  : ""
              }
              onClick={
                openAdminDashboard
              }
            >
              Admin Dashboard
            </a>

          )}


          {/* MANAGER */}

          {(user?.role === "admin" ||
            user?.role === "manager") && (

            <a
              className={
                activePage === "manager"
                  ? "active"
                  : ""
              }
              onClick={
                openManagerDashboard
              }
            >
              Manager Dashboard
            </a>

          )}


          {/* EMPLOYEE */}

          {(user?.role === "admin" ||
            user?.role === "manager" ||
            user?.role === "employee") && (

            <a
              className={
                activePage === "employee"
                  ? "active"
                  : ""
              }
              onClick={
                openEmployeeDashboard
              }
            >
              Employee Dashboard
            </a>

          )}


          {/* SALES */}

          {(user?.role === "admin" ||
            user?.role === "manager") && (

            <a
              className={
                activePage === "sales"
                  ? "active"
                  : ""
              }
              onClick={
                openSales
              }
            >
              Sales
            </a>

          )}


          {/* USER MANAGEMENT */}

          {user?.role === "admin" && (

            <a
              className={
                activePage === "users"
                  ? "active"
                  : ""
              }
              onClick={
                openUserManagement
              }
            >
              User Management
            </a>

          )}

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <a
            onClick={
              openProfile
            }
          >
            Profile
          </a>

          <a
            onClick={
              handleLogout
            }
          >
            Logout
          </a>

        </div>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="main-content">


        {/* HEADER */}

        <header className="header">

          <div>

            <h1>
              {activePage === "dashboard"
                ? "Dashboard"
                : activePage === "admin"
                ? "Admin Dashboard"
                : activePage === "manager"
                ? "Manager Dashboard"
                : activePage === "employee"
                ? "Employee Dashboard"
                : activePage === "sales"
                ? "Sales"
                : activePage === "users"
                ? "User Management"
                : "Profile"}
            </h1>

            <p>
              Welcome back! Here's your
              Mini ERP CRM workspace.
            </p>

          </div>


          {/* PROFILE */}

          <div className="profile">

            <div className="avatar">

              {user?.email
                ?.charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <strong>
                {user?.email}
              </strong>

              <span>
                {user?.role}
              </span>

            </div>

          </div>

        </header>


        {/* =====================================
            DASHBOARD CARDS
        ====================================== */}

        <section className="dashboard-cards">


          <div className="card">

            <div className="card-icon">
              🔐
            </div>

            <div>

              <p>
                Your Role
              </p>

              <h2>
                {user?.role
                  ?.toUpperCase()}
              </h2>

            </div>

          </div>


          <div className="card">

            <div className="card-icon">
              👤
            </div>

            <div>

              <p>
                User ID
              </p>

              <h2>
                {user?.id}
              </h2>

            </div>

          </div>


          <div className="card">

            <div className="card-icon">
              🛡️
            </div>

            <div>

              <p>
                Access Level
              </p>

              <h2>

                {user?.role === "admin"
                  ? "Full"
                  : user?.role === "manager"
                  ? "Manager"
                  : "Employee"}

              </h2>

            </div>

          </div>


          <div className="card">

            <div className="card-icon">
              ✅
            </div>

            <div>

              <p>
                Status
              </p>

              <h2>
                Active
              </h2>

            </div>

          </div>


        </section>


        {/* =====================================
            CURRENT PAGE
        ====================================== */}

        <section className="overview">


          {/* ACCESS INFORMATION */}

          <div className="overview-card">

            <h2>
              {activePage === "dashboard"
                ? "Dashboard Overview"
                : "Access Information"}
            </h2>


            <div className="overview-item">

              <span>
                Logged in as
              </span>

              <strong>
                {user?.email}
              </strong>

            </div>


            <div className="overview-item">

              <span>
                Role
              </span>

              <strong>
                {user?.role}
              </strong>

            </div>


            <div className="overview-item">

              <span>
                Current Page
              </span>

              <strong>
                {activePage}
              </strong>

            </div>


            <div className="overview-item">

              <span>
                Authentication
              </span>

              <strong>
                JWT Authenticated
              </strong>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="overview-card">

            <h2>
              Available Actions
            </h2>


            {user?.role === "admin" && (

              <button
                type="button"
                onClick={
                  openAdminDashboard
                }
              >
                Open Admin Dashboard
              </button>

            )}


            {(user?.role === "admin" ||
              user?.role === "manager") && (

              <button
                type="button"
                onClick={
                  openManagerDashboard
                }
              >
                Open Manager Dashboard
              </button>

            )}


            {(user?.role === "admin" ||
              user?.role === "manager" ||
              user?.role === "employee") && (

              <button
                type="button"
                onClick={
                  openEmployeeDashboard
                }
              >
                Open Employee Dashboard
              </button>

            )}


            {(user?.role === "admin" ||
              user?.role === "manager") && (

              <button
                type="button"
                onClick={
                  openSales
                }
              >
                Access Sales
              </button>

            )}


            {user?.role === "admin" && (

              <button
                type="button"
                onClick={
                  openUserManagement
                }
              >
                Manage Users
              </button>

            )}

          </div>


        </section>


        {/* =====================================
            SERVER MESSAGE
        ====================================== */}

        {message && (

          <div className="overview-card">

            <h2>
              Server Response
            </h2>

            <p>
              {message}
            </p>

          </div>

        )}


      </main>

    </div>

  );

}

export default App;
```
