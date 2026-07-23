import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://mini-erp-crm-backend-zpdv.onrender.com";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}

type Page =
  | "dashboard"
  | "admin"
  | "manager"
  | "employee"
  | "sales"
  | "users"
  | "profile";

function App() {
  // ==========================================
  // AUTH STATE
  // ==========================================

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [loading, setLoading] = useState<boolean>(
    () => !!localStorage.getItem("token")
  );

  const [activePage, setActivePage] =
    useState<Page>("dashboard");

  const [message, setMessage] = useState("");

  // ==========================================
  // AUTH FORM STATE
  // ==========================================

  const [isRegistering, setIsRegistering] =
    useState(false);

  const [authLoading, setAuthLoading] =
    useState(false);

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  // ==========================================
  // AUTH INPUT
  // ==========================================

  const handleAuthInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setAuthForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // LOGIN / REGISTER
  // ==========================================

  const handleAuthSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setAuthLoading(true);
    setMessage("");

    const endpoint = isRegistering
      ? "/api/auth/register"
      : "/api/auth/login";

    const body = isRegistering
      ? {
          name: authForm.name,
          email: authForm.email,
          password: authForm.password,
          role: authForm.role,
        }
      : {
          email: authForm.email,
          password: authForm.password,
        };

    try {
      const response = await fetch(
        `${API_URL}${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(body),
        }
      );

      const result: AuthResponse =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.message ||
            "Authentication failed"
        );

        return;
      }

      // ========================================
      // REGISTER SUCCESS
      // ========================================

      if (isRegistering) {
        setMessage(
          "Registration successful. Please login."
        );

        setIsRegistering(false);

        setAuthForm({
          name: "",
          email: authForm.email,
          password: "",
          role: "employee",
        });

        return;
      }

      // ========================================
      // LOGIN SUCCESS
      // ========================================

      if (
        result.token &&
        result.user
      ) {
        localStorage.setItem(
          "token",
          result.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(result.user)
        );

        setToken(result.token);

        setUser(result.user);

        setActivePage(
          "dashboard"
        );

        setMessage(
          "Login successful"
        );
      }
    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      setMessage(
        "Could not connect to backend"
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // ==========================================
  // API REQUEST HELPER
  // ==========================================

  const apiRequest = async (
    endpoint: string
  ) => {
    if (!token) {
      throw new Error(
        "Authentication token missing"
      );
    }

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
  };

  // ==========================================
  // VERIFY LOGIN
  // ==========================================

  const loadDashboard = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const result =
        await apiRequest(
          "/api/dashboard"
        );

      if (result.user) {
        setUser(result.user);

        localStorage.setItem(
          "user",
          JSON.stringify(
            result.user
          )
        );
      }

      setMessage(
        result.message ||
          "Dashboard loaded successfully"
      );
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      setToken(null);

      setUser(null);

      setMessage(
        "Session expired. Please login again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (token) {
      loadDashboard();
    } else {
      setLoading(false);
    }
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

    setToken(null);

    setUser(null);

    setActivePage(
      "dashboard"
    );

    setMessage("");
  };

  // ==========================================
  // OPEN ROLE PAGE
  // ==========================================

  const openRolePage = async (
    endpoint: string,
    page: Page,
    errorMessage: string
  ) => {
    try {
      const result =
        await apiRequest(
          endpoint
        );

      setActivePage(page);

      setMessage(
        result.message
      );
    } catch (error) {
      console.error(
        "Access error:",
        error
      );

      setMessage(
        errorMessage
      );
    }
  };

  // ==========================================
  // PAGE TITLE
  // ==========================================

  const getPageTitle = () => {
    switch (activePage) {
      case "admin":
        return "Admin Dashboard";

      case "manager":
        return "Manager Dashboard";

      case "employee":
        return "Employee Dashboard";

      case "sales":
        return "Sales";

      case "users":
        return "User Management";

      case "profile":
        return "Profile";

      default:
        return "Dashboard";
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
  // LOGIN / REGISTER PAGE
  // ==========================================

  if (!token || !user) {
    return (
      <div className="app">
        <main className="main-content">
          <div
            className="overview-card"
            style={{
              maxWidth: "500px",
              margin: "80px auto",
            }}
          >
            <h1>
              Mini ERP CRM
            </h1>

            <h2>
              {isRegistering
                ? "Create Account"
                : "Login"}
            </h2>

            <p>
              {isRegistering
                ? "Create a new account to access the ERP CRM."
                : "Login to access your ERP CRM dashboard."}
            </p>

            <form
              onSubmit={
                handleAuthSubmit
              }
            >
              {isRegistering && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={
                    authForm.name
                  }
                  onChange={
                    handleAuthInputChange
                  }
                  required
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={
                  authForm.email
                }
                onChange={
                  handleAuthInputChange
                }
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={
                  authForm.password
                }
                onChange={
                  handleAuthInputChange
                }
                required
              />

              {isRegistering && (
                <select
                  name="role"
                  value={
                    authForm.role
                  }
                  onChange={
                    handleAuthInputChange
                  }
                >
                  <option value="employee">
                    Employee
                  </option>

                  <option value="manager">
                    Manager
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              )}

              <button
                type="submit"
                disabled={
                  authLoading
                }
              >
                {authLoading
                  ? "Please wait..."
                  : isRegistering
                  ? "Create Account"
                  : "Login"}
              </button>
            </form>

            {message && (
              <p className="form-message">
                {message}
              </p>
            )}

            <div
              style={{
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(
                    !isRegistering
                  );

                  setMessage("");
                }}
              >
                {isRegistering
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (
    <div className="app">

      {/* SIDEBAR */}

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

          {user.role === "admin" && (
            <a
              className={
                activePage === "admin"
                  ? "active"
                  : ""
              }
              onClick={() =>
                openRolePage(
                  "/api/dashboard/admin",
                  "admin",
                  "Admin access denied"
                )
              }
            >
              Admin Dashboard
            </a>
          )}

          {(user.role === "admin" ||
            user.role ===
              "manager") && (
            <a
              className={
                activePage === "manager"
                  ? "active"
                  : ""
              }
              onClick={() =>
                openRolePage(
                  "/api/dashboard/manager",
                  "manager",
                  "Manager access denied"
                )
              }
            >
              Manager Dashboard
            </a>
          )}

          {(user.role === "admin" ||
            user.role === "manager" ||
            user.role ===
              "employee") && (
            <a
              className={
                activePage === "employee"
                  ? "active"
                  : ""
              }
              onClick={() =>
                openRolePage(
                  "/api/dashboard/employee",
                  "employee",
                  "Employee access denied"
                )
              }
            >
              Employee Dashboard
            </a>
          )}

          {(user.role === "admin" ||
            user.role ===
              "manager") && (
            <a
              className={
                activePage === "sales"
                  ? "active"
                  : ""
              }
              onClick={() =>
                openRolePage(
                  "/api/dashboard/sales",
                  "sales",
                  "Only Admin and Manager can access Sales"
                )
              }
            >
              Sales
            </a>
          )}

          {user.role === "admin" && (
            <a
              className={
                activePage === "users"
                  ? "active"
                  : ""
              }
              onClick={() =>
                openRolePage(
                  "/api/dashboard/users",
                  "users",
                  "Only administrators can access User Management"
                )
              }
            >
              User Management
            </a>
          )}

        </nav>

        <div className="sidebar-bottom">

          <a
            onClick={() =>
              openRolePage(
                "/api/dashboard/profile",
                "profile",
                "Unable to load profile"
              )
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

      {/* MAIN CONTENT */}

      <main className="main-content">

        {/* HEADER */}

        <header className="header">

          <div>

            <h1>
              {getPageTitle()}
            </h1>

            <p>
              Welcome back,{" "}
              {user.name || user.email}.
            </p>

          </div>

          <div className="profile">

            <div className="avatar">
              {(user.name ||
                user.email)
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {user.name ||
                  user.email}
              </strong>

              <span>
                {user.role}
              </span>

            </div>

          </div>

        </header>

        {/* DASHBOARD CARDS */}

        <section className="dashboard-cards">

          <div className="card">

            <div className="card-icon">
              🔐
            </div>

            <div>

              <p>
                Access Level
              </p>

              <h2>
                {user.role ===
                "admin"
                  ? "Full"
                  : user.role ===
                    "manager"
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

          <div className="card">

            <div className="card-icon">
              👤
            </div>

            <div>

              <p>
                Role
              </p>

              <h2>
                {user.role}
              </h2>

            </div>

          </div>

        </section>

        {/* OVERVIEW */}

        <section className="overview">

          <div className="overview-card">

            <h2>
              Account Overview
            </h2>

            <div className="overview-item">

              <span>
                Name
              </span>

              <strong>
                {user.name}
              </strong>

            </div>

            <div className="overview-item">

              <span>
                Email
              </span>

              <strong>
                {user.email}
              </strong>

            </div>

            <div className="overview-item">

              <span>
                Role
              </span>

              <strong>
                {user.role}
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

          {/* AVAILABLE ACTIONS */}

          <div className="overview-card">

            <h2>
              Available Actions
            </h2>

            {user.role ===
              "admin" && (
              <button
                type="button"
                onClick={() =>
                  openRolePage(
                    "/api/dashboard/admin",
                    "admin",
                    "Admin access denied"
                  )
                }
              >
                Open Admin Dashboard
              </button>
            )}

            {(user.role ===
              "admin" ||
              user.role ===
                "manager") && (
              <button
                type="button"
                onClick={() =>
                  openRolePage(
                    "/api/dashboard/manager",
                    "manager",
                    "Manager access denied"
                  )
                }
              >
                Open Manager Dashboard
              </button>
            )}

            {(user.role ===
              "admin" ||
              user.role ===
                "manager" ||
              user.role ===
                "employee") && (
              <button
                type="button"
                onClick={() =>
                  openRolePage(
                    "/api/dashboard/employee",
                    "employee",
                    "Employee access denied"
                  )
                }
              >
                Open Employee Dashboard
              </button>
            )}

            {(user.role ===
              "admin" ||
              user.role ===
                "manager") && (
              <button
                type="button"
                onClick={() =>
                  openRolePage(
                    "/api/dashboard/sales",
                    "sales",
                    "Only Admin and Manager can access Sales"
                  )
                }
              >
                Access Sales
              </button>
            )}

            {user.role ===
              "admin" && (
              <button
                type="button"
                onClick={() =>
                  openRolePage(
                    "/api/dashboard/users",
                    "users",
                    "Only administrators can access User Management"
                  )
                }
              >
                Manage Users
              </button>
            )}

          </div>

        </section>

        {/* SERVER MESSAGE */}

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