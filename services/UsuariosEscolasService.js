const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class UsuariosEscolasService {
  async cadastrarUsuarioEscola(req, res) {}
  async atualizarUsuarioEscola(req, res) {}
  async deletarUsuarioEscola(req, res) {}
  async inativarUsuarioEscola(req, res) {}
  async listarUsuariosEscolas(req, res) {
    console.log("-------------- lista usuarios Escolas Geral --------------------");
    const id_empresa = req.params.id_empresa;
    const sql = `SELECT u.nome, u.email, u.ativo FROM usuarios_escolas u where u.id_empresa = ${id_empresa}`;
    console.log(sql);
    try {
      const rs = await pg.execute(sql);
      const linhas = rs.rows.length;
      for (let i = 0; i < linhas; i++) {
        if (rs.rows[i].ativo == true) {
          rs.rows[i].ativo = "S";
        } else {
          rs.rows[i].ativo = "N";
        }
      }
      if (linhas > 0) {
        const retorno = {
          tamanho: linhas,
          usuarios: rs.rows,
        };
        res.status(200).json(retorno);
      } else {
        res.status(401).json(erro);
      }
      /**/
    } catch (error) {
      return res.status(500).send({
        mensagem: "Nenhum usuário encontrado!",
      });
    }

  }
  async buscarUsuarioEscola(req, res) {}
}
module.exports = new UsuariosEscolasService();
