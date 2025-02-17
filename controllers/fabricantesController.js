const FabricantesService = require("../services/FabricantesService");
const base = "/api/v1";
const login = require("../middlewares/login");

const url = "/fabricantes";
module.exports = (app) => {
  app.post(base + `${url}/cadastrar`, login.obrigatorio, (req, res) => {
    console.warn("------ fabricantes controller post salvar -----------------");
    FabricantesService.cadastrarFabricante(req, res);
  });

  app.put(base + `${url}/atualizar`, login.obrigatorio, (req, res) => {
    console.warn("------ fabricantes controller put atualizar ----------");
    FabricantesService.atualizarFabricante(req, res);
  });

  app.get(
    base + `${url}/listar_resumido/:id_empresa`,
    login.obrigatorio,
    (req, res) => {
      console.warn("------ fabricantes controller get listar_resumido -----");
      FabricantesService.listarFabricantesResumido(req, res);
    }
  );
  app.get(base + `${url}/listar/:id_empresa`, login.obrigatorio, (req, res) => {
    console.warn("------ fabricantes controller get listar_completo --------");
    FabricantesService.listarFabricantes(req, res);
  });

  app.put(base + `${url}/desativar/:id`, login.obrigatorio, (req, res) => {
    console.warn("------ fabricantes controller desativar --------");
    FabricantesService.desativarFabricante(req, res);
  });
  
  
  app.delete(base + `${url}/deletar/:id`, login.obrigatorio, (req, res) => {
    console.warn("------ fabricantes controller deletar --------");
    FabricantesService.deletarFabricante(req, res);
  });
  
};
