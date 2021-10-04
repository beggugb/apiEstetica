import CategoriaService from "../services/CategoriaService";

class CategoriaController {

  static listar(req, res) {
    console.log('nosn nons')
  }	
  
  static registrar(req, res) {    
    CategoriaService.setCategoria(req.body)
      .then((categoria) => {              
        CategoriaService.getCategorias(1,12)
            .then((categorias) => {     
                res.status(200).send({result: categorias });            
            })    
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

   static borrar(req, res) {
    CategoriaService.deleteCategoria(req.params.id)
      .then((categoria) => {
        CategoriaService.getCategorias(1,12)
            .then((categorias) => {
                res.status(200).send({result: categorias });
            })
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
}	

  static actualizar(req, res) {    
    CategoriaService.updateCategoria(req.body,req.params.id)
      .then((categoria) => {              
        CategoriaService.getCategorias(1,12)
            .then((categorias) => {     
                res.status(200).send({result: categorias });            
            })    
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static item(req, res) {    
    CategoriaService.getCategoria(req.params.id)
      .then((categoria) => {                      
            res.status(200).send({result: categoria });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static data(req, res) {    
    CategoriaService.getCategorias(req.params.page,req.params.num)
      .then((categorias) => {                      
            res.status(200).send({result: categorias });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static lista(req, res) {
    CategoriaService.getListas()
      .then((categorias) => {
            res.status(200).send({result: categorias });
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
  }	

  static buscar(req, res) {    
    const { nombre } = req.body      
    CategoriaService.searchCategorias(nombre)
      .then((categorias) => {                      
            res.status(200).send({result: categorias });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

}

export default CategoriaController;
