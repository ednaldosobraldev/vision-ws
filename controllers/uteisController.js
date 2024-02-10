const uteisService = require("../services/uteisService");
const base = "/api/v1";
const login = require("../middlewares/login");

module.exports = (app) => {
  app.get(base + "/consultacep/:cep",  login.opcional, (req, res) => {
    //console.log(req)
    console.warn('****************** ROTA BUSTA CEP *************')
    uteisService.buscarCep(req, res);
    //res.send("Rotas de atendimentos(GET)");
  });
 
};
