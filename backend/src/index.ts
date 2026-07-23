import express = require("express");
import cors = require("cors");

import dashboardRoutes = require("./routes/dashboardRoutes");
import authRoutes = require("./routes/authRoutes");

const app = express();

console.log("🔥 THIS IS THE BACKEND INDEX.TS FILE");


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors()
);

app.use(
  express.json()
);


// ==========================================
// DASHBOARD ROUTES
// ==========================================

app.use(
  "/api/dashboard",
  dashboardRoutes
);


// ==========================================
// AUTH ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);


// ==========================================
// TEST ROUTE
// ==========================================

app.get(
  "/",
  (req, res) => {
    res.json({
      message:
        "Mini ERP CRM Backend Running"
    });
  }
);


// ==========================================
// START SERVER
// ==========================================

const PORT =Number(process.env.PORT) || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Backend running on http://localhost:${PORT}`
    );
  }
);

export = app;