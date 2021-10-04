import ServicioService from "../services/ServicioService";

class ServicioController {
  
  static registrar(req, res) {    
    ServicioService.setServicio(req.body)
      .then((servicio) => {                      
          res.status(200).send({result: servicio });                        
        })                   
      .catch((reason) => { 	    
        res.status(400).send({ message: reason });
    });
  }

  static borrar(req, res) {      
    ServicioService.deleteServicio(req.params.id)
      .then((it) => {
        ServicioService.getServicios(1,12)
         .then((articulos) => {
           res.status(200).send({result: articulos });               
         })
      })
    .catch((reason) => {
      res.status(400).send({ message: reason });
  });
}	

  static actualizar(req, res) {    
    ServicioService.updateServicio(req.body,req.params.id)
      .then((Servicio) => {     
           res.status(200).send({result: Servicio });                                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static item(req, res) {    
    ServicioService.getServicio(req.params.id)
      .then((Servicio) => {                      
            res.status(200).send({result: Servicio });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static data(req, res) {    
    ServicioService.getServicios(req.params.page,req.params.num)
      .then((Servicios) => {                      
            res.status(200).send({result: Servicios });                        
        })                   
      .catch((reason) => {              
	console.log(reason)      
        res.status(400).send({ message: reason });
    });
  }

  static buscar(req, res) {    
    const { nombre } = req.body      
    ServicioService.searchServicios(nombre)
      .then((servicios) => {                      
         res.status(200).send({result: servicios });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
   }	      

}

export default ServicioController;
