const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class EscolasService {
  async atualizarEscola(req, res) {}
  async deletarEscola(req, res) {}
  async inativarEscola(req, res) {}
  async listarEscolas(req, res) {
    console.log("-------------- listaescolas geral --------------------");
    let id_empresa = req.params.id_empresa;
    try {
      const rs = await pg.execute(
        "SELECT " +
          "e.nome_escola, " +
          "e.id_escola, " +
          "e.rua, " +
          "e.numero, " +
          "e.bairro, " +
          "e.cidade, " +
          "e.uf, " +
          "e.cep, " +
          "e.telefone1, " +
          "e.telefone2, " +
          "e.ativo " +
          "FROM " +
          "escolas e " +
          "WHERE " +
          "e.id_empresa = $1",
        [id_empresa]
      );
      const linhas = rs.rows.length;
      // for (let i = 0; i < linhas; i++) {
      //   /*if (rs.rows[i].ativo == true) {
      //     rs.rows[i].ativo = "S";
      //   } else {
      //     rs.rows[i].ativo = "N";
      //   }*/
      // }

      if (linhas > 0) {
        const retorno = {
          tamanho: linhas,
          escolas: rs.rows,
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
  async buscarEscolaPeloId(req, res) {
    const id_empresa = req.params.id_empresa;
    const id_escola = req.params.id_escola;
    try {
      const rs = await pg.execute(
        "SELECT " +
          "e.nome_escola, " +
          "e.id_escola, " +
          "e.rua, " +
          "e.numero, " +
          "e.bairro, " +
          "e.cidade, " +
          "e.uf, " +
          "e.cep, " +
          "e.telefone1, " +
          "e.telefone2, " +
          "e.ativo " +
          "FROM " +
          "escolas e " +
          "WHERE " +
          "e.id_empresa = $1 " +
          "AND e.id_escola = $2",
        [id_empresa, id_escola]
      );
      res.status(200).json(rs.rows[0]);
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async cadastrarEscola(req, res) {
    console.log(req.body);
    const data_cadastro = new moment().format("YYYY-MM-DD HH:mm:ss");
    const data_alt = new moment().format("YYYY-MM-DD HH:mm:ss");
    const escola = req.body;
    const escolaFinal = { ...escola, data_cadastro, data_alt };
    //console.log(escola)
    try {
      //const sql = "INSERT INTO atendimentos SET ?";
      const sql =
        "INSERT INTO escolas (nome_escola, cep, rua, numero, bairro, " +
        "cidade, uf, telefone1, telefone2, ativo, id_empresa, data_cadastro, data_alt) " +
        "values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id_escola, nome_escola";
      const resultInsert = await pg.execute(sql, [
        escola.nome_escola,
        escola.cep,
        escola.rua,
        escola.numero,
        escola.bairro,
        escola.cidade,
        escola.uf,
        escola.telefone1,
        escola.telefone2,
        escola.ativo,
        escola.id_empresa,
        data_cadastro,
        data_alt,
      ]);
      const response = {
        mensagem: "Escola cadastrada com sucesso",
        escola_cadastrada: {
          id_escola: resultInsert.rows[0].id_escola,
          nome_escola: escola.nome_escola,
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
  async desativarEscola(req, res) {
    console.log("--------------------- DESATIVAR ESCOLAS --------------------");
    let idEscola = req.params.id;
    console.log("---------- id perfil passad back: " + idEscola);

    try {
      let sqlAtivo = "SELECT ativo FROM usuarios_niveis WHERE id_nivel = $1";
      let rsSqlAtivo = await pg.execute(sqlAtivo, [idEscola]);
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

  async avancarRegistro(req, res) {
    const id_empresa = req.params.id_empresa;
    const id_escola = req.params.id_escola;
    let sqlFind =
      "SELECT " +
      "min(e.id_escola) proximo " +
      "FROM " +
      "escolas e " +
      "WHERE " +
      "e.id_empresa = $1 " +
      "AND e.id_escola = $2";
    try {
      let rsFind = await pg.execute(sqlFind, [id_empresa, id_escola]);

      let linhasFind = rsFind.rowCount;
      if (linhasFind > 0) {
        let sqlBusca =
          "SELECT " +
          "e.nome_escola, " +
          "e.id_escola, " +
          "e.rua, " +
          "e.numero, " +
          "e.bairro, " +
          "e.cidade, " +
          "e.uf, " +
          "e.cep, " +
          "e.telefone1, " +
          "e.telefone2, " +
          "e.ativo " +
          "FROM " +
          "escolas e " +
          "WHERE " +
          "e.id_empresa = $1 " +
          "AND e.id_escola = $2";
        try {
          const rs = await pg.execute(sqlBusca, [id_empresa, id_escola]);
          res.status(200).json(rs.rows[0]);
        } catch (error) {
          res.status(401).json(error);
        }
      }
    } catch (error) {
      res.status(401).json(erro);
    }
  }
  async retrocederRegistro(req, res) {}
}

module.exports = new EscolasService();
