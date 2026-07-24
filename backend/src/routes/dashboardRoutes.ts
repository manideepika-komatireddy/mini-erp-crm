import express = require("express");

import {
  authenticateToken,
  authorizeRoles
} from "../middleware/authMiddleware";

import {
  getDashboardData,
  getSalesOverview,
  getCustomers,
  addCustomer,
  addLead,
  addProduct,
  recordSale
} from "../controllers/dashboardController";

const router = express.Router();


// ==========================================
// MAIN DASHBOARD DATA
// ==========================================

router.get(
  "/",
  authenticateToken,
  getDashboardData
);


// ==========================================
// SALES OVERVIEW
// ==========================================

router.get(
  "/sales",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  getSalesOverview
);


// ==========================================
// GET ALL CUSTOMERS
// ==========================================
// All logged-in users can view customers

router.get(
  "/customers",
  authenticateToken,
  getCustomers
);


// ==========================================
// ADD CUSTOMER
// ==========================================
// Admin and Manager only

router.post(
  "/customers",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  addCustomer
);


// ==========================================
// ADD LEAD
// ==========================================
// Admin and Manager only

router.post(
  "/leads",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  addLead
);


// ==========================================
// ADD PRODUCT
// ==========================================
// Admin only

router.post(
  "/products",
  authenticateToken,
  authorizeRoles("admin"),
  addProduct
);


// ==========================================
// RECORD SALE
// ==========================================
// Admin and Manager only

router.post(
  "/sales",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  recordSale
);


// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
  "/admin",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {

    res.json({
      message: "Welcome to Admin Dashboard",
      access: "Full access",
      user: (req as any).user
    });

  }
);


// ==========================================
// MANAGER DASHBOARD
// ==========================================

router.get(
  "/manager",
  authenticateToken,
  authorizeRoles("admin", "manager"),
  (req, res) => {

    res.json({
      message: "Welcome to Manager Dashboard",
      access: "Manager access",
      user: (req as any).user
    });

  }
);


// ==========================================
// EMPLOYEE DASHBOARD
// ==========================================

router.get(
  "/employee",
  authenticateToken,
  authorizeRoles(
    "admin",
    "manager",
    "employee"
  ),
  (req, res) => {

    res.json({
      message: "Welcome to Employee Dashboard",
      access: "Employee access",
      user: (req as any).user
    });

  }
);


// ==========================================
// USER MANAGEMENT
// ==========================================
// Admin only

router.get(
  "/users",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {

    res.json({
      message: "User management accessed",
      access: "Admin only",
      user: (req as any).user
    });

  }
);


// ==========================================
// PROFILE
// ==========================================
// All logged-in users

router.get(
  "/profile",
  authenticateToken,
  (req, res) => {

    res.json({
      message: "User profile accessed",
      user: (req as any).user
    });

  }
);


// ==========================================
// EXPORT ROUTER
// ==========================================

export = router;