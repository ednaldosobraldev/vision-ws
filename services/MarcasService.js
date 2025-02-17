const pg = require("../infra/conexao");
const { response } = require("express");
const moment = require("moment");


class MarcasService{
    async deletarMarca(req, res) {
      const id_marca = req.params.id;
      console.log(id_marca);

      try {
        let sqlDelete = 'DELETE FROM marcas WHERE id_marca = $1';
        let rsSqlAtivo = await pg.execute(sqlDelete, [id_marca]);
        let linhasAtivo = rsSqlAtivo.rowCount;
        console.log('linhasAtivo ----> ' + linhasAtivo);
        let response = ''
        if (linhasAtivo > 0) {
           response = {
            mensagem: "Registro Deletado com sucesso.",
          };
        }else{
          response = {
            mensagem: "Não foi possível deletar o registro.",
          };
        }
        return res.status(200).send(response);
      } catch (error) {
        console.log(error);
        res
          .status(401)
          .send("tabela: " + error.table + " campo: " + error.column);
      }
    }
    async desativarMarca(req, res) {
      const id_marca = req.params.id;
      console.log(id_marca);
      try {
        let sqlAtivo = "SELECT ativo FROM marcas WHERE id_marca = $1";
        let rsSqlAtivo = await pg.execute(sqlAtivo, [id_marca]);
        console.log(rsSqlAtivo);
  
        let linhasAtivo = rsSqlAtivo.rowCount;
        if (linhasAtivo > 0) {
          let rsAtivo = rsSqlAtivo.rows[0].ativo;
          console.log("rsAtivo encontrado: " + rsAtivo);
          rsAtivo = !rsAtivo;
  
          let sqlUpdate = "UPDATE marcas SET ativo = $1 WHERE id_marca = $2";
          let rsUpdate = await pg.execute(sqlUpdate, [rsAtivo, id_marca]);
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
    async atualizarMarca(req, res) {
      console.log(req.body);
      const data_alt = new moment().format("YYYY-MM-DD HH:mm:ss");
      const marca = req.body;
      console.log(marca)

      let sqlUpdate = 'UPDATE marcas SET descricao = $1, id_fabricante = $2, ativo = $3, data_alt = $4 WHERE id_marca = $5';
      try {
        await pg.execute(sqlUpdate, [
          marca.descricao.toUpperCase(),
          marca.id_fabricante,
          marca.ativo,
          data_alt,
          marca.id_marca
        ]);
        const response = {
          mensagem: "Marca Atualizada Com Sucesso",
          marca_cadastrada: {
            descricao: marca.descricao,
            data_alt: data_alt,
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
    async cadastrarMarca(req, res) {
      console.log(req.body);
      const data_cadastro = new moment().format("YYYY-MM-DD HH:mm:ss");
      const data_alt = new moment().format("YYYY-MM-DD HH:mm:ss");
      const marca = req.body;
      const marcaFinal = { ...marca, data_cadastro, data_alt };
      console.log(marca)
      try {
        //const sql = "INSERT INTO atendimentos SET ?";
        const sql =
          "INSERT INTO marcas (descricao, id_empresa, id_fabricante, ativo, data_cadastro, data_alt) " +
          "values ($1,$2,$3,$4,$5,$6) RETURNING id_marca, descricao";
        const resultInsert = await pg.execute(sql, [
          marca.descricao.toUpperCase(),
          marca.id_empresa,
          marca.id_fabricante,
          marca.ativo,
          data_cadastro,
          data_alt,
        ]);
        const response = {
          mensagem: "Marca Cadastrada Com Sucesso",
          marca_cadastrada: {
            id_marca: resultInsert.rows[0].id_marca,
            descricao: marca.descricao,
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
    async listarMarcas(req, res) {
        const id_empresa = req.params.id_empresa;
        console.log("-------------- listarMarcas geral --------------------");
        let sqlListaMarcas =
          "SELECT " +
          " e.id_marca, e.id_empresa, e.descricao, e.id_fabricante, e.ativo, TO_CHAR(e.data_cadastro, 'DD/MM/YYYY') as data_cadastro, TO_CHAR(e.data_alt, 'DD/MM/YYYY') as data_alt, f.fantasia " +
          "FROM " +
          "   marcas e " +
          "   LEFT JOIN fabricantes f ON " +
          "     e.id_fabricante = f.id_fabricante " +
          "WHERE " +
          "   e.id_empresa = $1 ORDER BY e.id_marca";
        console.log(sqlListaMarcas);
        try {
          const rs = await pg.execute(sqlListaMarcas, [id_empresa]);
          const linhas = rs.rows.length;
          console.log();
    
          if (linhas > 0) {
            const retorno = {
              tamanho: linhas,
              marcas: rs.rows,
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
}



module.exports = new MarcasService();