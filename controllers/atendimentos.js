const Atendimentos = require("../services/atendimentos");
const base = "/api/v1";
module.exports = (app) => {
  app.get(base + "/atendimentos", (req, res) => {
    Atendimentos.lista(req, res);
    //res.send("Rotas de atendimentos(GET)");
  });

  app.get(base +"/atendimentos/:id", (req, res) => {
    const id = req.params.id;
    Atendimentos.buscaPorId(id, res);
  });

  app.post(base + "/atendimentos", (req, res) => {
    //console.log(req.body);
    //console.log(req.params);
    const atendimento = req.body;
    //Atendimentos.adiciona(atendimento, res);
    res.send("Rotas de atendimentos(POST)");
  });

  app.patch("/atendimentos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const valores = req.body;

    Atendimentos.alterar(id, valores, res);
  });

  app.delete("/atendimentos/:id", (req, res) => {
    const id = parseInt(req.params.id);

    Atendimentos.deletar(id, res);
  });
};
