const EscolasService = require("../services/escolasService");
const base = "/api/v1";
const login = require("../middlewares/login");

module.exports = (app) => {
  app.get(base + "/escolas/lista/:id_empresa", login.opcional, (req, res) => {
    EscolasService.listarEscolas(req, res);
    //res.send("Rotas de atendimentos(GET)");
  });
  app.get(base + "/escolas/:id_empresa/:id_escola", login.opcional, (req, res) => {
    EscolasService.buscarEscolaPeloId(req, res);
  });
  app.post(base + "/escolas/cadastrar", login.opcional, (req, res) => {
    console.warn("------ escola controller post salvar -----------------");
    EscolasService.cadastrarEscola(req, res);
  });
  app.get(base + "/escolas/desativarEscola/:id_escola", login.opcional, (req, res) => {
    console.warn("------ desativarEscola escola controller get  -----------------");
    EscolasService.desativarEscola(req, res);
  });
  app.get(base + "/escolas/avancar_registro/:id_escola", login.opcional, (req, res) => {
    console.warn("------ escola avancar_registro get  -----------------");
    EscolasService.avancarRegistro(req, res);
  });
  app.get(base + "/escolas/retroceder_gistro/:id_escola", login.opcional, (req, res) => {
    console.warn("------ escola retrocederRegistro get  -----------------");
    EscolasService.retrocederRegistro(req, res);
  });
};
