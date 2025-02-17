const jwt = require("jsonwebtoken");

exports.obrigatorio = (req, res, next) => {
  console.log("Header Authorization:", req.headers.authorization);
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1]; // Pega o token após "Bearer"

    if (!token) {
      return res
        .status(401)
        .send({ mensagem: "Token de autenticação não fornecido." });
    }

    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.usuarioToken = decode;
    next(); // Chama a próxima função
  } catch (e) {
    return res.status(401).send({ mensagem: "Falha na autenticação!" });
  }
};

exports.opcional = (req, res, next) => {
  console.log("Header Authorization:", req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // Só verifica se o token existir
      const token = authHeader.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_KEY);
      req.usuarioToken = decode;
    }
  } catch (e) {
    // Se houver erro na autenticação, apenas continua sem travar a requisição
  }
  next();
};
