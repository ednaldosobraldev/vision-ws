const MarcasService = require("../services/MarcasService");
const base = "/api/v1";
const login = require("../middlewares/login");

const url = '/marcas'
module.exports = (app) => {
    app.get(base + `${url}/listar/:id_empresa`, login.obrigatorio, (req, res) => {
      MarcasService.listarMarcas(req, res);
      //res.send("Rotas de atendimentos(GET)");
    });

    app.post(base + `${url}/cadastrar`, login.obrigatorio, (req, res) => {
      console.warn("------ marca controller post salvar -----------------");
      MarcasService.cadastrarMarca(req, res);
    });

    app.put(base + `${url}/atualizar`, login.obrigatorio, (req, res) => {
      console.warn("------ atualizar Marca controller put  -----------------");
      MarcasService.atualizarMarca(req, res);
    });
     
    app.put(base + `${url}/desativar-marca/:id`, login.obrigatorio, (req, res) => {
      console.warn("------ desativarMarca controller put  -----------------");
      MarcasService.desativarMarca(req, res);
    });
    app.delete(base + `${url}/deletar-marca/:id`, login.obrigatorio, (req, res) => {
      console.warn("------ deletar controller put  -----------------");
      MarcasService.deletarMarca(req, res);
    });


    // app.get(base + `${url}/:id_empresa/:id_escola`, login.opcional, (req, res) => {
    //   EmpresasService.buscarEscolaPeloId(req, res);
    // });
   
    // app.get(base + `${url}/avancar_registro/:id_escola`, login.opcional, (req, res) => {
    //   console.warn("------ escola avancar_registro get  -----------------");
    //   EmpresasService.avancarRegistro(req, res);
    // });
    // app.get(base + `${url}/retroceder_gistro/:id_escola`, login.opcional, (req, res) => {
    //   console.warn("------ escola retrocederRegistro get  -----------------");
    //   EmpresasService.retrocederRegistro(req, res);
    // });
  };