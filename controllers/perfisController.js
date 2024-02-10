const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");
const login = require("../middlewares/login");

const perfisService = require("../services/PerfisService");
const base = "/api/v1";

module.exports = (app) => {
  app.get(base + "/perfis/listar/:id_empresa", (req, res) => {
    perfisService.listarPerfis(req, res);
  });
  app.get(base + "/perfis/buscaultimocodigo/:id_empresa", (req, res) => {
    perfisService.buscarUltimoCodigoPerfil(req, res);
  });

  app.post(base + "/perfis/cadastrar", login.opcional, (req, res) => {
    //const perfil = req.body;
    console.log("----------- perfil controller post salvar -----------------");
    console.log(req.body);
    perfisService.cadastrarPerfil(req, res);
  });

  app.post(base + "/perfis/atualizar", login.opcional, (req, res) => {
    console.log("---------  perfis controller atualizar perfil ----------");

    perfisService.atualizarPerfil(req, res);
  });
  
  app.patch(base + "/perfis/desativarPerfil/:id", login.opcional, (req, res) => {
    console.log("---------  perfis controller desativar perfil ----------");
    perfisService.desativarPerfil(req, res);
  });
  app.delete(base + "/perfis/:id", login.opcional, (req, res) => {
    console.log("---------  perfis controller deletar perfil ----------");
    perfisService.deletarPerfil(req, res);
  });
};
