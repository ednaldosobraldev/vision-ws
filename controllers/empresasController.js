const EmpresasService = require("../services/EmpresasService");
const base = "/api/v1";
const login = require("../middlewares/login");

const url = '/empresas'
module.exports = (app) => {
    app.get(base + `${url}/listar/:id_empresa`, login.opcional, (req, res) => {
      EmpresasService.listarEmpresas(req, res);
      //res.send("Rotas de atendimentos(GET)");
    });
    app.put(base + `${url}/atualizar`, login.opcional, (req, res) => {
      EmpresasService.atualizarEmpresa(req, res);
      //res.send("Rotas de atendimentos(GET)");
    });


    app.get(base + `${url}/:id_empresa/:id_escola`, login.opcional, (req, res) => {
      EmpresasService.buscarEscolaPeloId(req, res);
    });
    app.post(base + `${url}/cadastrar`, login.opcional, (req, res) => {
      console.warn("------ escola controller post salvar -----------------");
      EmpresasService.cadastrarEmpresa(req, res);
    });
    app.put(base + `${url}/desativar-empresa/:id`, login.opcional, (req, res) => {
      console.warn("------ desativarEmpresa empresa controller get  -----------------");
      EmpresasService.desativarEmpresa(req, res);
    });
    app.get(base + `${url}/avancar_registro/:id_escola`, login.opcional, (req, res) => {
      console.warn("------ escola avancar_registro get  -----------------");
      EmpresasService.avancarRegistro(req, res);
    });
    app.get(base + `${url}/retroceder_gistro/:id_escola`, login.opcional, (req, res) => {
      console.warn("------ escola retrocederRegistro get  -----------------");
      EmpresasService.retrocederRegistro(req, res);
    });
  };