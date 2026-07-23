import express = require("express");
import jwt = require("jsonwebtoken");


// ==========================================
// AUTHENTICATE JWT TOKEN
// ==========================================

export const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {

  try {

    // Get Authorization header

    const authHeader =
      req.headers.authorization;


    // Check if token exists

    if (!authHeader) {

      return res.status(401).json({
        message:
          "Access denied. Token required."
      });

    }


    // Expected format:
    // Bearer TOKEN

    const token =
      authHeader.split(" ")[1];


    if (!token) {

      return res.status(401).json({
        message:
          "Invalid authorization format"
      });

    }


    // JWT Secret

    const JWT_SECRET =
      process.env.JWT_SECRET ||
      "mini-erp-crm-secret";


    // Verify token

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );


    // Store user information

    (req as any).user =
      decoded;


    // Continue

    next();


  } catch (error) {

    return res.status(403).json({

      message:
        "Invalid or expired token"

    });

  }

};



// ==========================================
// ROLE-BASED ACCESS CONTROL
// ==========================================

export const authorizeRoles = (
  ...allowedRoles: string[]
) => {

  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {

    const user =
      (req as any).user;


    // Check authenticated user

    if (!user) {

      return res.status(401).json({

        message:
          "Authentication required"

      });

    }


    // Check role

    if (
      !allowedRoles.includes(
        user.role
      )
    ) {

      return res.status(403).json({

        message:
          "Access denied. Insufficient permissions."

      });

    }


    // Continue

    next();

  };

};