import express = require("express");
import cors = require("cors");

import dashboardRoutes = require("./routes/dashboardRoutes");
import authRoutes = require("./routes/authRoutes");

import createTables from "./config/initDatabase";

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
// SERVER PORT
// ==========================================

const PORT =
  Number(process.env.PORT) || 5000;


// ==========================================
// INITIALIZE DATABASE
// THEN START SERVER
// ==========================================

createTables()
  .then(() => {

    app.listen(
      PORT,
      () => {

        console.log(
          `Backend running on http://localhost:${PORT}`
        );

      }

    );

  })

  .catch((error) => {

    console.error(
      "Failed to initialize database:",
      error
    );

  });


export = app;