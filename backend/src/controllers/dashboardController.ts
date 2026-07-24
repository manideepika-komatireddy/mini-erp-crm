import { Request, Response } from "express";
import pool from "../config/database";

// ==========================================
// GET DASHBOARD DATA
// ==========================================

export const getDashboardData = async (
  req: Request,
  res: Response
) => {
  try {
    const customersResult = await pool.query(
      "SELECT COUNT(*) FROM customers"
    );

    const leadsResult = await pool.query(
      "SELECT COUNT(*) FROM leads"
    );

    const productsResult = await pool.query(
      "SELECT COUNT(*) FROM products"
    );

    const salesResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS total_sales
      FROM sales
    `);

    res.json({
      customers: Number(customersResult.rows[0].count),
      leads: Number(leadsResult.rows[0].count),
      products: Number(productsResult.rows[0].count),
      totalSales: Number(salesResult.rows[0].total_sales)
    });

  } catch (error) {
    console.error("Dashboard data error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard data"
    });
  }
};


// ==========================================
// GET SALES OVERVIEW
// ==========================================

export const getSalesOverview = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        TO_CHAR(sale_date, 'Mon') AS month,
        SUM(amount) AS sales
      FROM sales
      GROUP BY
        DATE_TRUNC('month', sale_date),
        TO_CHAR(sale_date, 'Mon')
      ORDER BY
        DATE_TRUNC('month', sale_date)
    `);

    const salesData = result.rows.map((row) => ({
      month: row.month,
      sales: Number(row.sales)
    }));

    res.json(salesData);

  } catch (error) {
    console.error("Sales overview error:", error);

    res.status(500).json({
      message: "Failed to fetch sales overview"
    });
  }
};


// ==========================================
// GET ALL CUSTOMERS
// ==========================================

export const getCustomers = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        company,
        created_at
      FROM customers
      ORDER BY id ASC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Get customers error:", error);

    res.status(500).json({
      message: "Failed to fetch customers"
    });
  }
};


// ==========================================
// ADD CUSTOMER
// ==========================================

export const addCustomer = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      phone,
      company
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !company
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO customers
      (
        name,
        email,
        phone,
        company
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING *
      `,
      [
        name,
        email,
        phone,
        company
      ]
    );

    res.status(201).json({
      message: "Customer added successfully",
      customer: result.rows[0]
    });

  } catch (error) {
    console.error("Add customer error:", error);

    res.status(500).json({
      message: "Failed to add customer"
    });
  }
};


// ==========================================
// ADD LEAD
// ==========================================

export const addLead = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      phone,
      status
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !status
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO leads
      (
        name,
        email,
        phone,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING *
      `,
      [
        name,
        email,
        phone,
        status
      ]
    );

    res.status(201).json({
      message: "Lead added successfully",
      lead: result.rows[0]
    });

  } catch (error) {
    console.error("Add lead error:", error);

    res.status(500).json({
      message: "Failed to add lead"
    });
  }
};


// ==========================================
// ADD PRODUCT
// ==========================================

export const addProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      category,
      price,
      stock
    } = req.body;

    if (
      !name ||
      !category ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO products
      (
        name,
        category,
        price,
        stock
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING *
      `,
      [
        name,
        category,
        price,
        stock
      ]
    );

    res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0]
    });

  } catch (error) {
    console.error("Add product error:", error);

    res.status(500).json({
      message: "Failed to add product"
    });
  }
};


// ==========================================
// RECORD SALE
// ==========================================

export const recordSale = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customer_id,
      amount,
      status
    } = req.body;

    if (
      !customer_id ||
      amount === undefined ||
      !status
    ) {
      return res.status(400).json({
        message:
          "Customer, amount and status are required"
      });
    }

    // Check whether customer exists
    const customerCheck = await pool.query(
      `
      SELECT id
      FROM customers
      WHERE id = $1
      `,
      [customer_id]
    );

    if (customerCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO sales
      (
        customer_id,
        amount,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *
      `,
      [
        customer_id,
        amount,
        status
      ]
    );

    res.status(201).json({
      message: "Sale recorded successfully",
      sale: result.rows[0]
    });

  } catch (error) {
    console.error("Record sale error:", error);

    res.status(500).json({
      message: "Failed to record sale"
    });
  }
};
