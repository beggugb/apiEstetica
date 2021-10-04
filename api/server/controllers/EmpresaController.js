import EmpresaService from "../services/EmpresaService";

class EmpresaController {
  
  static item(req, res) {    
    EmpresaService.getItem(req.params.id)
      .then((empresa) => {                      
            res.status(200).send({result: empresa });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

}

export default EmpresaController;
