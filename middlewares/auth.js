require("dotenv").config();

verify.use((req, res, next) => {
  const token = req.headers["access-token"];

  if (token) {
    jwt.verify(token, process.send.SECRET_JWT, (err, decoded) => {
      if (err) {
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
