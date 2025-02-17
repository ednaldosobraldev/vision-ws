const UsuariosService = require("../services/usuariosService");
const base = "/api/v1";
const login = require("../middlewares/login");

module.exports = (app) => {
  app.get(base + "/usuarios/lista/:id_empresa", login.obrigatorio, (req, res) => {
    UsuariosService.listaUsuarios(req, res);
    //res.send("Rotas de atendimentos(GET)");
  });

  app.get(base + "/usuarios/niveis", login.obrigatorio, (req, res) => {
    UsuariosService.listaNiveis(req, res);
  });

  app.post(base + "/usuarios/login", login.opcional, (req, res) => {
    console.log("------ usuarios controller login -----------------");
    UsuariosService.login(req, res);
  });

  app.post(base + "/usuarios/gerarsenha", login.obrigatorio, (req, res) => {
    console.log("---------  usuarios controller gerar senha ----------");
    console.log(req.body);
    UsuariosService.gerarSenha(req, res);
  });

  app.post(base + "/usuarios/salvar", login.obrigatorio, (req, res) => {
    const usuario = req.body;
    console.log("------ usuario controller post salvar -----------------");
    UsuariosService.salvarUsuario(usuario, res);
  });

  app.patch(base + "/usuarios/:id", login.obrigatorio, (req, res) => {
    console.log("---------  usuarios controller atualizar usuario ----------");
    const id = parseInt(req.params.id);
    res.send(id);
    const valores = req.body;

    UsuariosService.alterar(id, valores, res);
  });

  app.delete(base + "/usuarios/:id", login.obrigatorio, (req, res) => {
    console.log("---------  usuarios controller deletar usuario ----------");
    const id = req.params.id;
    res.status(200).send("implementar deletar usuario");
  });
};
