import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.user = { id: tokenDecode.id }; // ✅ attach userId to req.user
      next();
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default userAuth;
