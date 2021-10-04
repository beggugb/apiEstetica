import MarcaService from "../services/MarcaService";

class MarcaController {
  
   static borrar(req, res) {
    MarcaService.deleteMarca(req.params.id)
      .then((categoria) => {
        MarcaService.getMarcas(1,12)
            .then((marcas) => {
                res.status(200).send({result: marcas });
            })
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
  }
  static registrar(req, res) {    
    MarcaService.setMarca(req.body)
      .then((marca) => {              
        MarcaService.getMarcas(1,12)
            .then((marcas) => {     
                res.status(200).send({result: marcas });            
            })    
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static actualizar(req, res) {    
    MarcaService.updateMarca(req.body,req.params.id)
      .then((marca) => {              
        MarcaService.getMarcas(1,12)
            .then((marcas) => {     
                res.status(200).send({result: marcas });            
            })    
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static item(req, res) {    
    MarcaService.getMarca(req.params.id)
      .then((marca) => {                      
            res.status(200).send({result: marca });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static data(req, res) {    
    MarcaService.getMarcas(req.params.page,req.params.num)
      .then((marcas) => {                      
            res.status(200).send({result: marcas });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static buscar(req, res) {    
    const { nombre } = req.body      
    MarcaService.searchMarcas(nombre)
      .then((marcas) => {                      
            res.status(200).send({result: marcas });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static lista(req, res) {
    MarcaService.getListas()
      .then((marcas) => {
            res.status(200).send({result: marcas });
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
  }	

}

export default MarcaController;
