import express = require("express");
import bcrypt = require("bcryptjs");
import jwt = require("jsonwebtoken");
import pool = require("../config/database");


// ==========================================
// REGISTER USER
// ==========================================

export const register = async (
  req: express.Request,
  res: express.Response
) => {

  try {

    console.log("REGISTER REQUEST BODY:", req.body);

    const {
      name,
      email,
      password,
      role
    } = req.body || {};


    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, email and password are required"
      });
    }


    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const existingUser =
      await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        `,
        [email]
      );


    if (
      existingUser.rows.length > 0
    ) {

      return res.status(409).json({
        message:
          "User with this email already exists"
      });

    }


    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // ==========================================
    // CREATE USER
    // ==========================================

    const result =
      await pool.query(
        `
        INSERT INTO users
        (
          name,
          email,
          password,
          role
        )

        VALUES
        (
          $1,
          $2,
          $3,
          $4
        )

        RETURNING
          id,
          name,
          email,
          role
        `,
        [
          name,
          email,
          hashedPassword,
          role || "user"
        ]
      );


    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return res.status(201).json({

      message:
        "User registered successfully",

      user:
        result.rows[0]

    });


  } catch (error) {

    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({

      message:
        "Failed to register user"

    });

  }

};



// ==========================================
// LOGIN USER
// ==========================================

export const login = async (
  req: express.Request,
  res: express.Response
) => {

  try {

    const {
      email,
      password
    } = req.body || {};


    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({
        message:
          "Email and password are required"
      });

    }


    // ==========================================
    // FIND USER
    // ==========================================

    const result =
      await pool.query(
        `
        SELECT
          id,
          name,
          email,
          password,
          role

        FROM users

        WHERE email = $1
        `,
        [email]
      );


    if (
      result.rows.length === 0
    ) {

      return res.status(401).json({
        message:
          "Invalid email or password"
      });

    }


    const user =
      result.rows[0];


    // ==========================================
    // COMPARE PASSWORD
    // ==========================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {

      return res.status(401).json({
        message:
          "Invalid email or password"
      });

    }


    // ==========================================
    // JWT SECRET
    // ==========================================

    const JWT_SECRET =
      process.env.JWT_SECRET ||
      "mini-erp-crm-secret";


    // ==========================================
    // CREATE TOKEN
    // ==========================================

    const token =
      jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },

        JWT_SECRET,

        {
          expiresIn: "1d"
        }
      );


    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return res.json({

      message:
        "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });


  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({

      message:
        "Failed to login"

    });

  }

};