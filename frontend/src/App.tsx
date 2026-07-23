import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./App.css";


// ==========================================
// INTERFACES
// ==========================================

interface DashboardData {
  customers: number;
  leads: number;
  products: number;
  totalSales: number;
}

interface SalesData {
  month: string;
  sales: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
}


// ==========================================
// APP
// ==========================================

function App() {

  // ========================================
  // DASHBOARD STATE
  // ========================================

  const [data, setData] =
    useState<DashboardData>({
      customers: 0,
      leads: 0,
      products: 0,
      totalSales: 0,
    });


  const [salesData, setSalesData] =
    useState<SalesData[]>([]);


  const [customers, setCustomers] =
    useState<Customer[]>([]);


  // ========================================
  // MODAL STATE
  // ========================================

  const [showCustomerForm, setShowCustomerForm] =
    useState(false);

  const [showLeadForm, setShowLeadForm] =
    useState(false);

  const [showProductForm, setShowProductForm] =
    useState(false);

  const [showSaleForm, setShowSaleForm] =
    useState(false);


  // ========================================
  // MESSAGE
  // ========================================

  const [message, setMessage] =
    useState("");


  // ========================================
  // CUSTOMER FORM
  // ========================================

  const [customerForm, setCustomerForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      company: "",
    });


  // ========================================
  // LEAD FORM
  // ========================================

  const [leadForm, setLeadForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      status: "New",
    });


  // ========================================
  // PRODUCT FORM
  // ========================================

  const [productForm, setProductForm] =
    useState({
      name: "",
      category: "",
      price: "",
      stock: "",
    });


  // ========================================
  // SALE FORM
  // ========================================

  const [saleForm, setSaleForm] =
    useState({
      customer_id: "",
      amount: "",
      status: "Completed",
    });


  // ========================================
  // FETCH DASHBOARD
  // ========================================

  const fetchDashboardData = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/dashboard"
      );

      const result =
        await response.json();

      setData(result);

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      );

    }

  };


  // ========================================
  // FETCH SALES
  // ========================================

  const fetchSalesData = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/dashboard/sales-overview"
      );

      const result =
        await response.json();

      setSalesData(result);

    } catch (error) {

      console.error(
        "Sales error:",
        error
      );

    }

  };


  // ========================================
  // FETCH CUSTOMERS
  // ========================================

  const fetchCustomers = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/dashboard/customers"
      );

      if (!response.ok) {
        return;
      }

      const result =
        await response.json();

      setCustomers(result);

    } catch (error) {

      console.error(
        "Customers error:",
        error
      );

    }

  };


  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    fetchDashboardData();

    fetchSalesData();

    fetchCustomers();

  }, []);


  // ========================================
  // CLOSE ALL FORMS
  // ========================================

  const closeAllForms = () => {

    setShowCustomerForm(false);

    setShowLeadForm(false);

    setShowProductForm(false);

    setShowSaleForm(false);

    setMessage("");

  };


  // ========================================
  // CUSTOMER INPUT
  // ========================================

  const handleCustomerInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value,
    } = event.target;


    setCustomerForm(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );

  };


  // ========================================
  // LEAD INPUT
  // ========================================

  const handleLeadInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target;


    setLeadForm(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );

  };


  // ========================================
  // PRODUCT INPUT
  // ========================================

  const handleProductInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value,
    } = event.target;


    setProductForm(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );

  };


  // ========================================
  // SALE INPUT
  // ========================================

  const handleSaleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target;


    setSaleForm(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );

  };


  // ========================================
  // ADD CUSTOMER
  // ========================================

  const handleAddCustomer = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setMessage(
      "Adding customer..."
    );


    try {

      const response =
        await fetch(
          "http://localhost:5000/api/dashboard/customers",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                customerForm
              ),

          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        setMessage(
          result.message ||
          "Failed to add customer"
        );

        return;

      }


      setMessage(
        "Customer added successfully!"
      );


      setCustomerForm({

        name: "",

        email: "",

        phone: "",

        company: "",

      });


      await fetchDashboardData();

      await fetchCustomers();


      setTimeout(() => {

        closeAllForms();

      }, 1200);


    } catch (error) {

      console.error(
        "Add customer error:",
        error
      );


      setMessage(
        "Could not connect to backend"
      );

    }

  };


  // ========================================
  // ADD LEAD
  // ========================================

  const handleAddLead = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setMessage(
      "Adding lead..."
    );


    try {

      const response =
        await fetch(
          "http://localhost:5000/api/dashboard/leads",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                leadForm
              ),

          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        setMessage(
          result.message ||
          "Failed to add lead"
        );

        return;

      }


      setMessage(
        "Lead added successfully!"
      );


      setLeadForm({

        name: "",

        email: "",

        phone: "",

        status: "New",

      });


      await fetchDashboardData();


      setTimeout(() => {

        closeAllForms();

      }, 1200);


    } catch (error) {

      console.error(
        "Add lead error:",
        error
      );


      setMessage(
        "Could not connect to backend"
      );

    }

  };


  // ========================================
  // ADD PRODUCT
  // ========================================

  const handleAddProduct = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setMessage(
      "Adding product..."
    );


    try {

      const response =
        await fetch(
          "http://localhost:5000/api/dashboard/products",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                productForm
              ),

          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        setMessage(
          result.message ||
          "Failed to add product"
        );

        return;

      }


      setMessage(
        "Product added successfully!"
      );


      setProductForm({

        name: "",

        category: "",

        price: "",

        stock: "",

      });


      await fetchDashboardData();


      setTimeout(() => {

        closeAllForms();

      }, 1200);


    } catch (error) {

      console.error(
        "Add product error:",
        error
      );


      setMessage(
        "Could not connect to backend"
      );

    }

  };


  // ========================================
  // RECORD SALE
  // ========================================

  const handleRecordSale = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setMessage(
      "Recording sale..."
    );


    try {

      const response =
        await fetch(
          "http://localhost:5000/api/dashboard/sales",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                saleForm
              ),

          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        setMessage(
          result.message ||
          "Failed to record sale"
        );

        return;

      }


      setMessage(
        "Sale recorded successfully!"
      );


      setSaleForm({

        customer_id: "",

        amount: "",

        status: "Completed",

      });


      await fetchDashboardData();

      await fetchSalesData();


      setTimeout(() => {

        closeAllForms();

      }, 1200);


    } catch (error) {

      console.error(
        "Record sale error:",
        error
      );


      setMessage(
        "Could not connect to backend"
      );

    }

  };


  // ========================================
  // UI
  // ========================================

  return (

    <div className="app">


      {/* ==================================
          SIDEBAR
      ================================== */}

      <aside className="sidebar">

        <div className="logo">
          Mini ERP CRM
        </div>


        <nav>

          <a
            className="active"
            onClick={closeAllForms}
          >
            Dashboard
          </a>


          <a
            onClick={() => {

              closeAllForms();

              setShowCustomerForm(true);

            }}
          >
            Customers
          </a>


          <a
            onClick={() => {

              closeAllForms();

              setShowLeadForm(true);

            }}
          >
            Leads
          </a>


          <a
            onClick={() => {

              closeAllForms();

              setShowProductForm(true);

            }}
          >
            Products
          </a>


          <a
            onClick={() => {

              closeAllForms();

              setShowSaleForm(true);

            }}
          >
            Sales
          </a>

        </nav>


        <div className="sidebar-bottom">

          <a>
            Settings
          </a>

          <a>
            Logout
          </a>

        </div>

      </aside>


      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <main className="main-content">


        {/* HEADER */}

        <header className="header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back! Here's what's
              happening with your business.
            </p>

          </div>


          <div className="profile">

            <div className="avatar">
              M
            </div>


            <div>

              <strong>
                Admin
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

        </header>


        {/* ==================================
            DASHBOARD CARDS
        ================================== */}

        <section className="dashboard-cards">


          <div className="card">

            <div className="card-icon">
              👥
            </div>

            <div>

              <p>
                Total Customers
              </p>

              <h2>
                {data.customers}
              </h2>

            </div>

          </div>


          <div className="card">

            <div className="card-icon">
              🎯
            </div>

            <div>

              <p>
                Total Leads
              </p>

              <h2>
                {data.leads}
              </h2>

            </div>

          </div>


          <div className="card">

            <div className="card-icon">
              📦
            </div>

            <div>

              <p>
                Total Products
              </p>

              <h2>
                {data.products}
              </h2>

            </div>

          </div>


          <div className="card">

            <div className="card-icon">
              💰
            </div>

            <div>

              <p>
                Total Sales
              </p>

              <h2>
                ₹
                {data.totalSales.toLocaleString()}
              </h2>

            </div>

          </div>


        </section>


        {/* ==================================
            SALES CHART
        ================================== */}

        <section className="chart-section">

          <div className="chart-card">

            <div className="chart-header">

              <h2>
                Sales Overview
              </h2>

              <p>
                Monthly sales performance
              </p>

            </div>


            <div className="chart-container">


              {salesData.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height={350}
                >

                  <LineChart
                    data={salesData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="month"
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              ) : (

                <p className="no-data">
                  No sales data available
                </p>

              )}


            </div>

          </div>

        </section>


        {/* ==================================
            BOTTOM SECTION
        ================================== */}

        <section className="overview">


          {/* BUSINESS OVERVIEW */}

          <div className="overview-card">

            <h2>
              Business Overview
            </h2>


            <div className="overview-item">

              <span>
                Customers
              </span>

              <strong>
                {data.customers}
              </strong>

            </div>


            <div className="overview-item">

              <span>
                Leads
              </span>

              <strong>
                {data.leads}
              </strong>

            </div>


            <div className="overview-item">

              <span>
                Products
              </span>

              <strong>
                {data.products}
              </strong>

            </div>


            <div className="overview-item">

              <span>
                Total Revenue
              </span>

              <strong>
                ₹
                {data.totalSales.toLocaleString()}
              </strong>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="overview-card">

            <h2>
              Quick Actions
            </h2>


            <button
              type="button"
              onClick={() => {

                closeAllForms();

                setShowCustomerForm(true);

              }}
            >
              Add Customer
            </button>


            <button
              type="button"
              onClick={() => {

                closeAllForms();

                setShowLeadForm(true);

              }}
            >
              Add Lead
            </button>


            <button
              type="button"
              onClick={() => {

                closeAllForms();

                setShowProductForm(true);

              }}
            >
              Add Product
            </button>


            <button
              type="button"
              onClick={() => {

                closeAllForms();

                setShowSaleForm(true);

              }}
            >
              Record Sale
            </button>


          </div>


        </section>


      </main>


      {/* ==================================
          ADD CUSTOMER MODAL
      ================================== */}

      {showCustomerForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Add Customer
              </h2>


              <button
                type="button"
                className="close-button"
                onClick={closeAllForms}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleAddCustomer
              }
            >


              <input
                type="text"
                name="name"
                placeholder="Customer Name"
                value={
                  customerForm.name
                }
                onChange={
                  handleCustomerInputChange
                }
                required
              />


              <input
                type="email"
                name="email"
                placeholder="Email"
                value={
                  customerForm.email
                }
                onChange={
                  handleCustomerInputChange
                }
                required
              />


              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={
                  customerForm.phone
                }
                onChange={
                  handleCustomerInputChange
                }
                required
              />


              <input
                type="text"
                name="company"
                placeholder="Company"
                value={
                  customerForm.company
                }
                onChange={
                  handleCustomerInputChange
                }
                required
              />


              <button
                type="submit"
                className="submit-button"
              >
                Add Customer
              </button>


              {message && (

                <p className="form-message">
                  {message}
                </p>

              )}


            </form>

          </div>

        </div>

      )}


      {/* ==================================
          ADD LEAD MODAL
      ================================== */}

      {showLeadForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Add Lead
              </h2>


              <button
                type="button"
                className="close-button"
                onClick={closeAllForms}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleAddLead
              }
            >


              <input
                type="text"
                name="name"
                placeholder="Lead Name"
                value={
                  leadForm.name
                }
                onChange={
                  handleLeadInputChange
                }
                required
              />


              <input
                type="email"
                name="email"
                placeholder="Email"
                value={
                  leadForm.email
                }
                onChange={
                  handleLeadInputChange
                }
                required
              />


              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={
                  leadForm.phone
                }
                onChange={
                  handleLeadInputChange
                }
                required
              />


              <select
                name="status"
                value={
                  leadForm.status
                }
                onChange={
                  handleLeadInputChange
                }
                required
              >

                <option value="New">
                  New
                </option>

                <option value="Contacted">
                  Contacted
                </option>

                <option value="Qualified">
                  Qualified
                </option>

                <option value="Converted">
                  Converted
                </option>

              </select>


              <button
                type="submit"
                className="submit-button"
              >
                Add Lead
              </button>


              {message && (

                <p className="form-message">
                  {message}
                </p>

              )}


            </form>

          </div>

        </div>

      )}


      {/* ==================================
          ADD PRODUCT MODAL
      ================================== */}

      {showProductForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Add Product
              </h2>


              <button
                type="button"
                className="close-button"
                onClick={closeAllForms}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleAddProduct
              }
            >


              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={
                  productForm.name
                }
                onChange={
                  handleProductInputChange
                }
                required
              />


              <input
                type="text"
                name="category"
                placeholder="Category"
                value={
                  productForm.category
                }
                onChange={
                  handleProductInputChange
                }
                required
              />


              <input
                type="number"
                name="price"
                placeholder="Price"
                value={
                  productForm.price
                }
                onChange={
                  handleProductInputChange
                }
                min="0"
                required
              />


              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={
                  productForm.stock
                }
                onChange={
                  handleProductInputChange
                }
                min="0"
                required
              />


              <button
                type="submit"
                className="submit-button"
              >
                Add Product
              </button>


              {message && (

                <p className="form-message">
                  {message}
                </p>

              )}


            </form>

          </div>

        </div>

      )}


      {/* ==================================
          RECORD SALE MODAL
      ================================== */}

      {showSaleForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>
                Record Sale
              </h2>


              <button
                type="button"
                className="close-button"
                onClick={closeAllForms}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleRecordSale
              }
            >


              <select
                name="customer_id"
                value={
                  saleForm.customer_id
                }
                onChange={
                  handleSaleInputChange
                }
                required
              >

                <option value="">
                  Select Customer
                </option>


                {customers.map(
                  (customer) => (

                    <option
                      key={
                        customer.id
                      }
                      value={
                        customer.id
                      }
                    >

                      {customer.name}

                    </option>

                  )
                )}

              </select>


              <input
                type="number"
                name="amount"
                placeholder="Sale Amount"
                value={
                  saleForm.amount
                }
                onChange={
                  handleSaleInputChange
                }
                min="0"
                required
              />


              <select
                name="status"
                value={
                  saleForm.status
                }
                onChange={
                  handleSaleInputChange
                }
                required
              >

                <option value="Completed">
                  Completed
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>


              <button
                type="submit"
                className="submit-button"
              >
                Record Sale
              </button>


              {message && (

                <p className="form-message">
                  {message}
                </p>

              )}


            </form>

          </div>

        </div>

      )}


    </div>

  );

}


export default App;