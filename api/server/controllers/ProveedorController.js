import ProveedorService from "../services/ProveedorService";

class ProveedorController {
  
  static registrar(req, res) {    
    ProveedorService.setProveedor(req.body)
      .then((proveedor) => {                      
          res.status(200).send({result: proveedor });                        
        })                   
      .catch((reason) => { 
	console.log(reason)      
        res.status(400).send({ message: reason });
    });
  }

  static actualizar(req, res) {    
    ProveedorService.updateProveedor(req.body,req.params.id)
      .then((proveedor) => {     
           res.status(200).send({result: proveedor });                                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static item(req, res) {    
    ProveedorService.getProveedor(req.params.id)
      .then((proveedor) => {                      
            res.status(200).send({result: proveedor });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static data(req, res) {    
    ProveedorService.getProveedores(req.params.page,req.params.num)
      .then((proveedores) => {                      
            res.status(200).send({result: proveedores });                        
        })                   
      .catch((reason) => {              
	console.log(reason)      
        res.status(400).send({ message: reason });
    });
  }

  static buscar(req, res) {    
    const { nombre } = req.body      
    ProveedorService.searchProveedores(nombre)
      .then((proveedores) => {                      
            res.status(200).send({result: proveedores });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

}

export default ProveedorController;
