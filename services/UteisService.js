const { response } = require("express");
const axios = require('axios');

const api = axios.create({
    baseURL: "http://localhost:3001/api/v1/",
    headers: {
      "Content-type": "application/json",
    },
  });

class UteisService{
    async buscarCep(req, res){
        const cep = req.params.cep;
        const rs = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const endereco = {
            status: 200,
            dados: rs.dat
        }
        res.status(200).json(rs.data);
    }
}

module.exports = new UteisService();