const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");

class FabricantesService {
  async atualizarFabricante(req, res) {
    const data_cadastro = new moment().format("YYYY-MM-DD HH:mm:ss");
    const data_alt = new moment().format("YYYY-MM-DD HH:mm:ss");
    let fabricante = req.body;

    console.log(fabricante);
    console.log("ID do fabricante recebido:", fabricante.id_fabricante);

    try {
      const sqlUpdate =
        "UPDATE fabricantes SET fantasia = $1, razao = $2, contato = $3, cnpj_cpf = $4, cep = $5, rua = $6, " +
        "bairro = $7, cidade = $8, uf = $9, numero = $10, telefone = $11, celular = $12, website = $13, ativo = $14, data_alt = $15 " +
        "WHERE id_fabricante = $16";

      console.log(sqlUpdate);
      const resultUpdate = await pg.execute(sqlUpdate, [
        fabricante.fantasia,
        fabricante.razao,
        fabricante.contato,
        fabricante.cnpj_cpf,
        fabricante.cep,
        fabricante.rua,
        fabricante.bairro,
        fabricante.cidade,
        fabricante.uf,
        fabricante.numero,
        fabricante.telefone,
        fabricante.celular,
        fabricante.website,
        fabricante.ativo,
        data_alt,
        fabricante.id_fabricante,
      ]);
      const response = {
        mensagem: "Fabricante atualizado com Sucesso",
        marca_cadastrada: {
          id_fabricante: fabricante.id_fabricante,
          razao: fabricante.razao,
          data_cadastro: data_cadastro,
        },
      };

      if (resultUpdate.rowCount > 0) {
        console.log("Nenhum fabricante atualizado. Verifique o ID.");
      }
      res.status(201).send(response);
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .send("tabela: " + error.table + " campo: " + error.column);
    }
  }
  async cadastrarFabricante(req, res) {
    const data_cadastro = new moment().format("YYYY-MM-DD HH:mm:ss");
    const data_alt = new moment().format("YYYY-MM-DD HH:mm:ss");
    let fabricante = req.body;
    console.log(fabricante);

    try {
      //const sql = "INSERT INTO atendimentos SET ?";
      const sql =
        "INSERT INTO fabricantes (id_empresa, fantasia, razao, contato, cnpj_cpf, cep, rua, " +
        "bairro, cidade, uf, numero, telefone, celular, website, ativo, data_cadastro, data_alt) " +
        "values ($1,$2,$3,$4,$5,$6) RETURNING id_fabricante, razao";
      const resultInsert = await pg.execute(sql, [
        fabricante.id_empresa,
        fabricante.fantasia.toUpperCase(),
        fabricante.razao.toUpperCase(),
        fabricante.contato.toUpperCase(),
        fabricante.cnpj_cpf,
        fabricante.cep,
        fabricante.rua,
        fabricante.bairro,
        fabricante.cidade.toUpperCase(),
        fabricante.uf,
        fabricante.numero,
        fabricante.telefone,
        fabricante.celular,
        fabricante.website,
        fabricante.ativo,
        data_cadastro,
        data_alt,
      ]);
      const response = {
        mensagem: "Fabricante Cadastradao com Sucesso",
        marca_cadastrada: {
          id_fabricante: resultInsert.rows[0].id_fabricante,
          razao: marca.razao,
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
  async listarFabricantesResumido(req, res) {
    const id_empresa = req.params.id_empresa;
    console.log("-------------- listarFabricantes geral --------------------");
    let sqlListaFabricantes =
      "SELECT " +
      "e.id_fabricante, e.id_empresa, e.fantasia, e.razao, e.ativo, TO_CHAR(e.data_cadastro, 'DD/MM/YYYY') as data_cadastro, e.contato, " +
      "e.contato, e.cnpj_cpf, e.cep, e.rua, e.bairro, e.cidade, e.uf,  e.numero, e.telefone, e.celular,  " +
      "TO_CHAR(e.data_alt, 'DD/MM/YYYY') as data_alt , e.website " +
      "FROM " +
      "   fabricantes e " +
      "WHERE " +
      "   e.id_empresa = $1";
    console.log(sqlListaFabricantes);
    try {
      const rs = await pg.execute(sqlListaFabricantes, [id_empresa]);
      const linhas = rs.rows.length;
      console.log();

      if (linhas > 0) {
        const retorno = {
          tamanho: linhas,
          fabricantes: rs.rows,
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
  async listarFabricantes(req, res) {
    const id_empresa = req.params.id_empresa;
    console.log("-------------- listarFabricantes geral --------------------");
    let sqlListaFabricantes =
      "SELECT " +
      " e.id_fabricante, e.id_empresa, e.fantasia, e.razao, e.contato, e.cnpj_cpj, e.cep, e.rua, e.bairro, e.cidade, e.numero, e.cidade, e.numero, e.telefone, e.celular, e.website, e.ativo " +
      "FROM " +
      "   fabricantes e " +
      "WHERE " +
      "   e.id_empresa = $1 ORDER BY  e.razao" ;
    console.log(sqlListaFabricantes);
    try {
      const rs = await pg.execute(sqlListaFabricantes, [id_empresa]);
      const linhas = rs.rows.length;
      console.log();

      if (linhas > 0) {
        const retorno = {
          tamanho: linhas,
          fabricantes: rs.rows,
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
  async desativarFabricante(req, res) {
    const id_fabricante = req.params.id;
    console.log(id_fabricante);
    try {
      let sqlAtivo = "SELECT ativo FROM fabricantes WHERE id_fabricante = $1";
      let rsSqlAtivo = await pg.execute(sqlAtivo, [id_fabricante]);
      console.log(rsSqlAtivo);

      let linhasAtivo = rsSqlAtivo.rowCount;
      if (linhasAtivo > 0) {
        let rsAtivo = rsSqlAtivo.rows[0].ativo;
        console.log("rsAtivo encontrado: " + rsAtivo);
        rsAtivo = !rsAtivo;

        let sqlUpdate =
          "UPDATE fabricantes SET ativo = $1 WHERE id_fabricante = $2";
        let rsUpdate = await pg.execute(sqlUpdate, [rsAtivo, id_fabricante]);
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
  async deletarFabricante(req, res) {
    const id_fabricante = req.params.id;
    console.log(id_fabricante);
    try {
      let sqlAtivo =
        "SELECT id_fabricante FROM marcas WHERE id_fabricante = $1";
      let rsSqlAtivo = await pg.execute(sqlAtivo, [id_fabricante]);
      console.log(rsSqlAtivo);

      let linhasAtivo = rsSqlAtivo.rowCount;
      if (linhasAtivo > 0) {
        return res
          .status(405)
          .send(
            "Não é possível excluir o reistro. Existe 1 ou mais registros dependentes."
          );
      } else {
        let sqlUpdate = "DELETE FROM fabricantes  WHERE id_fabricante = $1";
        let rsUpdate = await pg.execute(sqlUpdate, [id_fabricante]);
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
}

module.exports = new FabricantesService();
