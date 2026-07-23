import express = require("express");
import cors = require("cors");
import * as dotenv from "dotenv";
import pool from "./config/database";
import dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Home API
app.get("/", (req, res) => {
  res.json({
    message: "ERP CRM Backend is running"
  });
});

// Database connection test
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "PostgreSQL connected successfully",
      time: result.rows[0].now
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

// Dashboard API
app.use("/api/dashboard", dashboardRoutes);

// Temporary sample data API
app.get("/api/seed", async (req, res) => {
  try {
    // Insert customers
    await pool.query(`
      INSERT INTO customers (name, email, phone, company)
      VALUES
        ('Anita Sharma', 'anita@example.com', '9876543210', 'ABC Technologies'),
        ('Rahul Kumar', 'rahul@example.com', '9876543211', 'XYZ Solutions'),
        ('Priya Reddy', 'priya@example.com', '9876543212', 'Reddy Enterprises'),
        ('Arjun Rao', 'arjun@example.com', '9876543213', 'Rao Industries'),
        ('Sneha Patel', 'sneha@example.com', '9876543214', 'Patel Systems')
      ON CONFLICT (email) DO NOTHING;
    `);

    // Insert leads
    await pool.query(`
      INSERT INTO leads (name, email, phone, status)
      VALUES
        ('Kiran Kumar', 'kiran@example.com', '9876543220', 'New'),
        ('Meena Reddy', 'meena@example.com', '9876543221', 'Contacted'),
        ('Vijay Rao', 'vijay@example.com', '9876543222', 'Qualified'),
        ('Lakshmi Devi', 'lakshmi@example.com', '9876543223', 'New'),
        ('Suresh Babu', 'suresh@example.com', '9876543224', 'Converted')
      ON CONFLICT DO NOTHING;
    `);

    // Insert products
    await pool.query(`
      INSERT INTO products (name, category, price, stock)
      VALUES
        ('Laptop', 'Electronics', 50000, 10),
        ('Monitor', 'Electronics', 15000, 20),
        ('Keyboard', 'Accessories', 2000, 50),
        ('Mouse', 'Accessories', 1000, 75),
        ('Printer', 'Electronics', 12000, 15)
      ON CONFLICT DO NOTHING;
    `);

    // Insert sales
    await pool.query(`
      INSERT INTO sales (customer_id, amount, status)
      SELECT id, 50000, 'Completed'
      FROM customers
      WHERE email = 'anita@example.com'
      LIMIT 1;

      INSERT INTO sales (customer_id, amount, status)
      SELECT id, 15000, 'Completed'
      FROM customers
      WHERE email = 'rahul@example.com'
      LIMIT 1;

      INSERT INTO sales (customer_id, amount, status)
      SELECT id, 20000, 'Completed'
      FROM customers
      WHERE email = 'priya@example.com'
      LIMIT 1;
    `);

    res.json({
      message: "Sample data inserted successfully"
    });

  } catch (error) {
    console.error("Error inserting sample data:", error);

    res.status(500).json({
      message: "Failed to insert sample data"
    });
  }
});

export = app;