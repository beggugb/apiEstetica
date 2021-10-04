import ClienteService from "../services/ClienteService";

class ClienteController {
  
  static registrar(req, res) {    
    ClienteService.setCliente(req.body)
      .then((cliente) => {                      
          res.status(200).send({result: cliente });                        
        })                   
      .catch((reason) => { 
	console.log(reason)      
        res.status(400).send({ message: reason });
    });
  }

  static actualizar(req, res) {    
    ClienteService.updateCliente(req.body,req.params.id)
      .then((cliente) => {     
           res.status(200).send({result: cliente });                                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static item(req, res) {    
    ClienteService.getCliente(req.params.id)
      .then((cliente) => {                      
            res.status(200).send({result: cliente });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static data(req, res) {    
    ClienteService.getClientes(req.params.page,req.params.num)
      .then((clientes) => {                      
            res.status(200).send({result: clientes });                        
        })                   
      .catch((reason) => {              
	console.log(reason)      
        res.status(400).send({ message: reason });
    });
  }

  static buscar(req, res) {    
    const { nombre } = req.body      
    const regex = /^[0-9]*$/;
    const onlyNumbers = regex.test(nombre);
    if(onlyNumbers){
      ClienteService.searchClientesNit(nombre)
      .then((clientes) => {
            res.status(200).send({result: clientes });
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });	
    }else{
    	    
    ClienteService.searchClientes(nombre)
      .then((clientes) => {                      
            res.status(200).send({result: clientes });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
   }	    
  }

}

export default ClienteController;
