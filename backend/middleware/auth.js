const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const cookieToken = req.cookies?.token;
    const bodyToken = req.body?.token;

    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "").trim();
    } else if (cookieToken) {
      token = cookieToken;
    } else if (bodyToken) {
      token = bodyToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

exports.isUser = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "This route is protected for users only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role check failed",
    });
  }
};
exports.isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "This route is protected for admins only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin role check failed",
    });
  }
};
