import jwt from "jsonwebtoken";

// Middleware to protect routes and attach logged-in user ID
export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // debugging to Check for Authorization header
    // console.log("Auth Middleware: Authorization header:", authHeader);

    // Check if Authorization header is present
    if (!authHeader) {
      console.error("Auth Middleware Error: No Authorization header sent");
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Check if the header starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      console.error(
        "Auth Middleware Error: Authorization header missing 'Bearer ' prefix",
      );
      return res.status(401).json({
        success: false,
        message: "Malformed token format",
      });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    if (!token) {
      console.error(
        "Auth Middleware Error: Token is empty after splitting header",
      );
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // 3Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error(
        "Auth Middleware Error: JWT verification failed -",
        err.message,
      );
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 4Attach user ID to request object
    req.user = { id: decoded.id };

    // Continue to the next middleware or controller
    next();
  } catch (err) {
    // Catch any unexpected errors
    console.error("Auth Middleware Unexpected Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
