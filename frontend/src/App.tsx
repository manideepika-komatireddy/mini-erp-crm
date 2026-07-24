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

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
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
  | "customers"
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
  // CUSTOMER STATE
  // ==========================================

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [showCustomerModal, setShowCustomerModal] =
    useState(false);

  const [customerLoading, setCustomerLoading] =
    useState(false);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

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
    const { name, value } = event.target;

    setAuthForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CUSTOMER INPUT
  // ==========================================

  const handleCustomerInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setCustomerForm((previous) => ({
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
            "Content-Type": "application/json",
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

        setActivePage("dashboard");

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
  // API REQUEST HELPER - GET
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
  // API REQUEST HELPER - POST
  // ==========================================

  const apiPostRequest = async (
    endpoint: string,
    body: unknown
  ) => {
    if (!token) {
      throw new Error(
        "Authentication token missing"
      );
    }

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify(body),
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
  // LOAD DASHBOARD
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
  // LOAD CUSTOMERS
  // ==========================================

  const loadCustomers = async () => {
    try {
      setCustomerLoading(true);

      const result =
        await apiRequest(
          "/api/dashboard/customers"
        );

      setCustomers(result);

      setMessage(
        "Customers loaded successfully"
      );
    } catch (error) {
      console.error(
        "Load customers error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load customers"
      );
    } finally {
      setCustomerLoading(false);
    }
  };

  // ==========================================
  // ADD CUSTOMER
  // ==========================================

  const handleAddCustomer = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setCustomerLoading(true);

      const result =
        await apiPostRequest(
          "/api/dashboard/customers",
          customerForm
        );

      setMessage(
        result.message ||
          "Customer added successfully"
      );

      setCustomerForm({
        name: "",
        email: "",
        phone: "",
        company: "",
      });

      setShowCustomerModal(false);

      await loadCustomers();

    } catch (error) {
      console.error(
        "Add customer error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to add customer"
      );
    } finally {
      setCustomerLoading(false);
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

    setCustomers([]);

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
  // OPEN CUSTOMERS PAGE
  // ==========================================

  const openCustomersPage = async () => {
    setActivePage("customers");

    await loadCustomers();
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

      case "customers":
        return "Customers";

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
      <div className="login-page">

        <div className="login-card">

          <div className="login-logo">

            <div className="login-logo-icon">
              ERP
            </div>

            <h1>
              Mini ERP CRM
            </h1>

          </div>

          <div className="login-header">

            <h2>
              {isRegistering
                ? "Create Account"
                : "Welcome Back"}
            </h2>

            <p>
              {isRegistering
                ? "Create your account to get started."
                : "Sign in to access your dashboard."}
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleAuthSubmit}
          >

            {isRegistering && (
              <div className="login-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={authForm.name}
                  onChange={
                    handleAuthInputChange
                  }
                  required
                />

              </div>
            )}

            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={authForm.email}
                onChange={
                  handleAuthInputChange
                }
                required
              />

            </div>

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={authForm.password}
                onChange={
                  handleAuthInputChange
                }
                required
              />

            </div>

            {isRegistering && (
              <div className="login-field">

                <label htmlFor="role">
                  Role
                </label>

                <select
                  id="role"
                  name="role"
                  value={authForm.role}
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

              </div>
            )}

            <button
              className="login-button"
              type="submit"
              disabled={authLoading}
            >
              {authLoading
                ? "Please wait..."
                : isRegistering
                ? "Create Account"
                : "Sign In"}
            </button>

          </form>

          {message && (
            <p
              className={`login-message ${
                message
                  .toLowerCase()
                  .includes("successful")
                  ? "login-success"
                  : "login-error"
              }`}
            >
              {message}
            </p>
          )}

          <div className="login-switch">

            <span>
              {isRegistering
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

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
                ? "Sign In"
                : "Create Account"}
            </button>

          </div>

        </div>

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

          <a
            className={
              activePage === "customers"
                ? "active"
                : ""
            }
            onClick={
              openCustomersPage
            }
          >
            Customers
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
            user.role === "manager") && (
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
            user.role === "employee") && (
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
            user.role === "manager") && (
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

        {/* ==========================================
            CUSTOMERS PAGE
        ========================================== */}

        {activePage === "customers" ? (

          <section className="overview">

            <div className="overview-card">

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >

                <h2>
                  Customer Management
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setShowCustomerModal(true)
                  }
                >
                  Add Customer
                </button>

              </div>

              {customerLoading &&
                customers.length === 0 ? (

                <p>
                  Loading customers...
                </p>

              ) : customers.length === 0 ? (

                <p>
                  No customers found.
                </p>

              ) : (

                <div
                  style={{
                    overflowX: "auto",
                  }}
                >

                  <table
                    style={{
                      width: "100%",
                      borderCollapse:
                        "collapse",
                    }}
                  >

                    <thead>

                      <tr>

                        <th>
                          ID
                        </th>

                        <th>
                          Name
                        </th>

                        <th>
                          Email
                        </th>

                        <th>
                          Phone
                        </th>

                        <th>
                          Company
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {customers.map(
                        (customer) => (

                          <tr
                            key={
                              customer.id
                            }
                          >

                            <td>
                              {customer.id}
                            </td>

                            <td>
                              {customer.name}
                            </td>

                            <td>
                              {customer.email}
                            </td>

                            <td>
                              {customer.phone}
                            </td>

                            <td>
                              {customer.company}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </section>

        ) : (

          <>

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

                <button
                  type="button"
                  onClick={
                    openCustomersPage
                  }
                >
                  Manage Customers
                </button>

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

          </>

        )}

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

      {/* ==========================================
          ADD CUSTOMER MODAL
      ========================================== */}

      {showCustomerModal && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >

          <div
            className="overview-card"
            style={{
              width: "90%",
              maxWidth: "500px",
            }}
          >

            <h2>
              Add New Customer
            </h2>

            <form
              onSubmit={
                handleAddCustomer
              }
            >

              <div className="login-field">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    customerForm.name
                  }
                  onChange={
                    handleCustomerInputChange
                  }
                  required
                />

              </div>

              <div className="login-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    customerForm.email
                  }
                  onChange={
                    handleCustomerInputChange
                  }
                  required
                />

              </div>

              <div className="login-field">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={
                    customerForm.phone
                  }
                  onChange={
                    handleCustomerInputChange
                  }
                  required
                />

              </div>

              <div className="login-field">

                <label>
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={
                    customerForm.company
                  }
                  onChange={
                    handleCustomerInputChange
                  }
                  required
                />

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >

                <button
                  type="submit"
                  disabled={
                    customerLoading
                  }
                >
                  {customerLoading
                    ? "Adding..."
                    : "Add Customer"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCustomerModal(
                      false
                    );

                    setCustomerForm({
                      name: "",
                      email: "",
                      phone: "",
                      company: "",
                    });
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;
