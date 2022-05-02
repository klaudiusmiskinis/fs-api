require("dotenv").config();

verifyAccess.use((req, res, next) => {
  const token = req.headers["access-token"];
  if (token) {
    jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
      if (err) {
        console.log('Invalid');
        return res.json({ mensaje: "Invalid token." });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send({
      mensaje: "Token not provided.",
    });
  }
});
