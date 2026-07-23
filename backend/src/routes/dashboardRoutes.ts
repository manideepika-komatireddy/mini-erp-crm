import express = require("express");

import {
  authenticateToken,
  authorizeRoles
} from "../middleware/authMiddleware";

const router = express.Router();


// ==========================================
// TEST DASHBOARD ROUTE
// ==========================================
// Any logged-in user can access

router.get(
  "/",
  authenticateToken,
  (req, res) => {

    res.json({
      message:
        "Dashboard accessed successfully",

      user:
        (req as any).user
    });

  }
);


// ==========================================
// ADMIN DASHBOARD
// ==========================================
// Only ADMIN can access

router.get(
  "/admin",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {

    res.json({

      message:
        "Welcome to Admin Dashboard",

      access:
        "Full access",

      user:
        (req as any).user

    });

  }
);


// ==========================================
// MANAGER DASHBOARD
// ==========================================
// ADMIN and MANAGER can access

router.get(
  "/manager",
  authenticateToken,
  authorizeRoles(
    "admin",
    "manager"
  ),
  (req, res) => {

    res.json({

      message:
        "Welcome to Manager Dashboard",

      access:
        "Manager access",

      user:
        (req as any).user

    });

  }
);


// ==========================================
// EMPLOYEE DASHBOARD
// ==========================================
// ADMIN, MANAGER and EMPLOYEE can access

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

      message:
        "Welcome to Employee Dashboard",

      access:
        "Employee access",

      user:
        (req as any).user

    });

  }
);


// ==========================================
// ADMIN ONLY - USER MANAGEMENT
// ==========================================

router.get(
  "/users",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {

    res.json({

      message:
        "User management accessed",

      access:
        "Admin only",

      user:
        (req as any).user

    });

  }
);


// ==========================================
// ADMIN + MANAGER - SALES
// ==========================================

router.get(
  "/sales",
  authenticateToken,
  authorizeRoles(
    "admin",
    "manager"
  ),
  (req, res) => {

    res.json({

      message:
        "Sales data accessed",

      access:
        "Admin and Manager",

      user:
        (req as any).user

    });

  }
);


// ==========================================
// ALL AUTHENTICATED USERS - PROFILE
// ==========================================

router.get(
  "/profile",
  authenticateToken,
  (req, res) => {

    res.json({

      message:
        "User profile accessed",

      user:
        (req as any).user

    });

  }
);


// ==========================================
// EXPORT ROUTER
// ==========================================

export = router;