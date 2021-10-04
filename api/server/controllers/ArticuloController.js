import ArticuloService from "../services/ArticuloService";
import AlmacenItemService from "../services/AlmacenItemService";
import AlmacenService from "../services/AlmacenService";

class ArticuloController {
 
   static codigo(req, res) {
      ArticuloService.searchCodigo(req.params.codigo)
         .then((articulo) => {
	   let iok = true  
            if(articulo){
	      iok = false	    
	     }	 
             res.status(200).send({result: iok });           
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
  }

   static borrar(req, res) {      
      ArticuloService.deleteArticulo(req.params.id)
        .then((it) => {
          ArticuloService.getArticulos(1,12)
           .then((articulos) => {
             res.status(200).send({result: articulos });               
           })
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
  }	
  static registro(req, res) {    
    ArticuloService.setArticulo(req.body)
      .then((articulo) => {              
          res.status(200).send({result: articulo });            
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static registrar(req, res) {
    ArticuloService.setArticulo(req.body)
      .then((articulo) => {
        ArticuloService.getArticulos(1,12)
            .then((articulos) => {
                res.status(200).send({result: articulos });
            })
        })
  .catch((reason) => {
	console.log(reason)
        res.status(400).send({ message: reason });
    });
  }	

  static actualizar(req, res) {    
    ArticuloService.updateArticulo(req.body,req.params.id)
      .then((articulo) => {              
           res.status(200).send({result: articulo });            
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static item(req, res) {    
    ArticuloService.getArticulo(req.params.id)
      .then((articulo) => {                      
            res.status(200).send({result: articulo });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static data(req, res) {    
    ArticuloService.getArticulos(req.params.page,req.params.num)
      .then((articulos) => {                      
            res.status(200).send({result: articulos });                        
        })                   
      .catch((reason) => {    
        console.log(reason)                       
        res.status(400).send({ message: reason });
    });
  }

  static catalogo(req, res) { 
    ArticuloService.getCatalogo(req.params.id)
      .then((articulos) => { 
            res.status(200).send({result: articulos });
        })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
    });
  }	

  static buscar(req, res) {    
    const { codigo, nombre } = req.body      
    ArticuloService.searchArticulos(codigo, nombre)
      .then((articulos) => {                      
            res.status(200).send({result: articulos });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static stock(req, res) {    
    const { codigo, nombre, almacenId } = req.body      
    //searchAlmacenArticulo
    ArticuloService.articulosStock(codigo,nombre,almacenId)
      .then((articulos) => {                      
            res.status(200).send({result: articulos });                        
        })                   
      .catch((reason) => {    
        console.log(reason)          
        res.status(400).send({ message: reason });
    });
  }

  static buscarItems(req, res) { 
    const { codigo, nombre } = req.body
    console.log(nombre)	  
    ArticuloService.searchArticulos(codigo, nombre)
      .then((articulos) => {
            res.status(200).send({result: articulos });
        })
      .catch((reason) => { 
	console.log(reason)      
        res.status(400).send({ message: reason });
    });
  }

  static codigoStock(req, res) {
    const { codigo, almacenId  } = req.body
     AlmacenService.searchCodigo(codigo,almacenId)
         .then((articulo) => {
             res.status(200).send({result: articulo });
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
  }
	
	

}

export default ArticuloController;
