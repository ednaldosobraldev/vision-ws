const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class PerfisService {
  async cadastrarPerfil(req, res) {
    console.log("-------- CADASTRAR PERFIL ---------");
    //console.log(req.body);
    const data_cadastro = new moment().format("YYYY-MM-DD HH:mm:ss");
    const data_alt = new moment().format("YYYY-MM-DD HH:mm:ss");
    const perfil = req.body;
    //console.log('************ perfil inicio ********************************')
    //console.log(perfil);
    // console.log('************ perfil fim ********************************')
    // const escolaFinal = { ...escola, data_cadastro, data_alt };

    try {
      //const sql = "INSERT INTO atendimentos SET ?";
      const sql =
        "INSERT INTO usuarios_niveis (codigo_nivel, descricao_nivel, id_empresa, ativo, data_cadastro, data_alt) " +
        "values ($1,$2,$3,$4,$5,$6) RETURNING id_nivel, descricao_nivel";
      const rs = await pg.execute(sql, [
        perfil.codigo_nivel,
        perfil.descricao_nivel,
        perfil.id_empresa,
        perfil.ativo,
        data_cadastro,
        data_alt,
      ]);
      const response = {
        mensagem: "Perfil cadastrado com sucesso",
        perfil: {
          id_nivel: rs.rows[0].id_nivel,
          codigo_nivel: perfil.codigo_nivel,
          descricao_nivel: perfil.descricao_nivel,
          data_cadastro: data_cadastro,
        },
      };
      res.status(201).send(response);
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .send("tabela: " + error.table + " campo: " + error.column);
    }
  }
  /********************* ATUALIZAR PERFIL  ***********************/
  async atualizarPerfil(req, res) {
    const perfil = req.body;
    console.log("-------- ATUALIZA PERFIL ---------");
    let id_nivel = perfil.id_nivel;
    let codigo_nivel = perfil.codigo_nivel;
    let descricao_nivel = perfil.descricao_nivel;
    let ativo = perfil.ativo;
    console.log(perfil);

    try {
      const sql =
        "UPDATE usuarios_niveis SET codigo_nivel = $1, descricao_nivel = $2, ativo = $3 WHERE id_nivel = $4";
      const rs = await pg.execute(sql, [
        codigo_nivel,
        descricao_nivel,
        ativo,
        id_nivel,
      ]);

      const response = {
        mensagem: "Perfil atualizado com sucesso!",
        codigo_nivel: codigo_nivel,
        descricao_nivel: descricao_nivel,
      };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .send("tabela: " + error.table + " campo: " + error.column);
    }
  }
  /********************* BUSCA ULTIMO CODIGO PERFIL  ***********************/
  async buscarUltimoCodigoPerfil(req, res) {
    console.log("-------- BUSCA ULTIMO CODIGO PERFIL ---------");
    let id_empresa = req.params.id_empresa;

    try {
      let sql =
        "SELECT MAX(codigo_nivel) FROM usuarios_nivel WHERE id_empresa = $1";
      const rs = await pg.execute(sql, [id_empresa]);
      const linhas = rs.rows.length;
      if (linhas) {
        const response = {
          codigo_nivel: rs.rows[0].codigo_nivel,
        };
        return res.status(200).send(response);
      }
    } catch (error) {
      return res.status(500).send({
        mensagem: "Nenhum dado encontrado!",
      });
    }
  }
  async desativarPerfil(req, res) {
    console.log("--------------------- DESATIVAR PERFIL --------------------");
    let idPerfil = req.params.id;
    console.log("---------- id perfil passad back: " + idPerfil);

    try {
      let sqlAtivo = "SELECT ativo FROM usuarios_niveis WHERE id_nivel = $1";
      let rsSqlAtivo = await pg.execute(sqlAtivo, [idPerfil]);
      let linhasAtivo = rsSqlAtivo.rowCount;
      if (linhasAtivo > 0) {
        let rsAtivo = rsSqlAtivo.rows[0].ativo;
        console.log("rsAtivo encontrado: " + rsAtivo);
        rsAtivo = !rsAtivo;

        let sqlUpdate =
          "UPDATE usuarios_niveis SET ativo = $1 WHERE id_nivel = $2";
        let rsUpdate = await pg.execute(sqlUpdate, [rsAtivo, idPerfil]);
        let linhasUpdate = rsUpdate.rowCount;
        if (linhasUpdate > 0) {
          console.log(
            "----------------------- atualizado --------------------"
          );
          const response = {
            mensagem: "Registro Ativado/Inativado com sucesso.",
          };
          return res.status(200).send(response);
        } else {
          const response = {
            mensagem: "Não foi possível Ativado/Inativado o registro.",
          };
          return res.status(401).send(response);
        }
      }
    } catch (error) {
      return res.status(500).send({
        mensagem: "Nenhum dado encontrado!",
      });
    }
  }

  async deletarPerfil(req, res) {
    console.log("--------------------- DELETAR PERFIL --------------------");
    let idPerfil = +req.params.id;
    console.log("---------- id perfil passad back: " + idPerfil);

    try {
      let sqlCheck = "SELECT * FROM usuarios WHERE id_nivel = $1";
      let rsCheck = await pg.execute(sqlCheck, [idPerfil]);
      let linhasSqlCheck = rsCheck.rowCount;
      if (!linhasSqlCheck) {
        let sqlDelete = "DELETE FROM usuarios_niveis WHERE id_nivel = $1";
        await pg.execute(sqlDelete, [idPerfil]);

        return res.status(200).send({
          mensagem: "Registro excluido com sucesso.",
        });
      } else {
        return res.status(403).send({
          mensagem: "Não foi possível exlcuir o registro.",
        });
      }
    } catch (error) {
      return res.status(500).send({
        mensagem: "Nenhum dado encontrado!",
      });
    }
  }
  async listarPerfis(req, res) {
    console.log("-------------- listaperfis geral --------------------");
    let id_empresa = req.params.id_empresa;
    try {
      const rs = await pg.execute(
        "SELECT " +
          "u.id_nivel, " +
          "u.descricao_nivel, " +
          "u.codigo_nivel, " +
          "u.ativo " +
          "FROM " +
          "usuarios_niveis u " +
          "WHERE " +
          "u.id_empresa = $1 ORDER BY u.descricao_nivel",
        [id_empresa]
      );
      const linhas = rs.rows.length;
      if (linhas > 0) {
        const retorno = {
          tamanho: linhas,
          perfis: rs.rows,
        };
        res.status(200).json(retorno);
      } else {
        res.status(401).json(erro);
      }
      /**/
    } catch (error) {
      return res.status(500).send({
        mensagem: "Nenhum dado encontrado!",
      });
    }
  }
  async buscarPerfil(req, res) {}
}
module.exports = new PerfisService();
