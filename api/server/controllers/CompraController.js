import CompraService from "../services/CompraService";
import CompraItemService from "../services/CompraItemService";
import InventarioService from "../services/InventarioService";
import InventarioItemService from "../services/InventarioItemService";
import AlmacenItemService from "../services/AlmacenItemService";
import UsuarioService from "../services/UsuarioService";
import MailController from "../controllers/MailController";

import pdfCompra from '../../public/documents/compra'
const path = require('path');
const pdf = require('html-pdf');
const hostname = '192.168.0.100'
const port = 4000

var options = { 
  "format": "Letter", 
  "orientation":"landscape"    
 };

const createPdf = (compra,items,usuario) => {    
  let img = `http://${hostname}:${port}/api/static/images/empresa/sm/logo.png`;  
   pdf.create(pdfCompra(img,compra,items,usuario), options).toFile(`${process.cwd()}/api/public/documents/compra${compra.id}.pdf`, (err) => {
     if(err) { res.send(Promise.reject());}
         return 0	 
  })      
}

class CompraController {

   static send(req, res) {      
     Promise.all([CompraService.getCompra(req.params.id),CompraItemService.getCompraItems(req.params.id)]) 
       .then(([compra,items]) => { 
        UsuarioService.getUsuario(compra.usuarioId)
        .then((usuario) => {          
            Promise.all([createPdf(compra,items,usuario)])           
            .then(([pdf]) => {                          
                MailController.send("pedido",compra)           
                .then((mail) => {
                  res.status(200).send({ result: mail});
                })
              })
              .catch((reason) => {   
                console.log(reason)                           
              });
        });                         
              
    })
    .catch((reason) => {   
      console.log(reason)               
      res.status(400).send({ reason });
    });     
   }	
 
   static borrar(req, res) {
      CompraItemService.deleteCompraItems(req.params.id)
	.then((categor) => {
          CompraService.deleteCompra(req.params.id)
            .then((it) => {
	       CompraService.getCompras(1,12)
		.then((compras) => {
                   res.status(200).send({result: compras });                  	    
               })
            })		    
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
   }
	
  static registrar(req, res) {    
      const { item, items } = req.body      
      CompraService.setCompra(item)
      .then((compra) => {                                
        let citems = []
        items.map((it =>{
            let dat = {}
            dat.cantidad = it.cantidad
            dat.articuloId = it.articuloId
            dat.compraId = compra
            dat.nombre = it.nombre
            dat.categoria = it.categoria
            dat.valor = it.valor		
            dat.codigo = it.codigo		
            dat.marca = it.marca		
            citems.push(dat)                  
        }))            
        CompraItemService.setCompraItem(citems)
            .then((icompras) => {    
                Promise.all([CompraService.getCompra(compra),CompraItemService.getCompraItems(compra)])
                  .then(([rcompra,rcompras]) => {       
                    res.status(200).send({result: {"item":rcompra, "items":rcompras }});
                })
		  .catch((reason) => {
	             console.log(reason)		  
       		     res.status(400).send({ message: reason });
	       });   
		     
            })
        })                   
      .catch((reason) => {
	  console.log(reason)    
        res.status(400).send({ message: reason });
    });
  }

  static actualizar(req, res) {    
    const {item, items } = req.body  
   /* CompraService.updateCompra(item,req.params.id)*/
    Promise.all([CompraService.updateCompra(item,req.params.id),CompraItemService.deleteCompraItems(req.params.id)]) 	        .then(([icompra,ircompra]) => {
	   let citems = []
	   items.map((it =>{
             let dat = {}
             dat.cantidad = it.cantidad
             dat.articuloId = it.articuloId
             dat.compraId = req.params.id
             dat.nombre = it.nombre
             dat.categoria = it.categoria
             dat.codigo = it.codigo
             dat.marca = it.marca
             citems.push(dat)
            }))
	    CompraItemService.setCompraItem(citems)
            .then((icompras) => {
                Promise.all([CompraService.getCompra(req.params.id),CompraItemService.getCompraItems(req.params.id)])
                  .then(([rcompra,rcompras]) => {
                    res.status(200).send({result: {"item":rcompra, "items":rcompras }});
                })
                  .catch((reason) => {
                     console.log(reason)
                     res.status(400).send({ message: reason });
               });

            })	

        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static item(req, res) {        
    Promise.all([CompraService.getCompra(req.params.id),CompraItemService.getCompraItems(req.params.id)])
        .then(([rcompra,rcompras]) => {        
            res.status(200).send({result: {"item":rcompra, "items":rcompras }});
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static data(req, res) {    
    CompraService.getCompras(req.params.page,req.params.num)
      .then((compras) => {                      
            res.status(200).send({result: compras });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static buscar(req, res) {    
    const { nombre } = req.body      
    CompraService.searchCompras(nombre)
      .then((compras) => {                      
            res.status(200).send({result: compras });                        
        })                   
      .catch((reason) => {   	
        res.status(400).send({ message: reason });
    });
  }

  static aprobar(req, res) {    
    const { tipo, observaciones, almacenId, fechaAprobacion, usuarioId  } = req.body 

    console.log(req.body)
    console.log(req.params.id)
    Promise.all([CompraService.getCompra(req.params.id),CompraItemService.getCompraItems(req.params.id)])
      .then(([rcompra,rcompras]) => {  
        let newInventario = {}
        newInventario.nro = rcompra.id
        newInventario.fechaInventario = fechaAprobacion
        newInventario.tipo = tipo
        newInventario.nroItems = rcompra.nroItems
        newInventario.total = rcompra.total
        newInventario.observaciones = observaciones
        newInventario.stock = rcompra.nroItems
        newInventario.usuarioId = usuarioId
        newInventario.compraId = req.params.id    
        newInventario.almacenorigenId = almacenId
        newInventario.almacendestinoId = almacenId 
        let ncompra = rcompra
        ncompra.estado = true
        /*****************BEGIN INVENTARIO*********************/
        Promise.all([InventarioService.setInventario(newInventario),CompraService.updateCompra(ncompra,rcompra.id)])
          .then(([rinventario,nn]) => { 
            let citems = []
              rcompras.map((it =>{
                  let dat = {}
                  dat.cantidad = it.cantidad
                  dat.articuloId = it.articuloId
                  dat.inventarioId = rinventario.id
                  dat.stock = it.cantidad
                  citems.push(dat)                  
              }))
              /*****************BEGIN FINANCIERO**********************/
              Promise.all([InventarioItemService.setInventarioItem(citems),
                InventarioService.todu(rinventario,rinventario.id)])
                .then(([rinventarios,op]) => { 
                    /*****************BEGIN FINANCIERO**********************/
                    InventarioItemService.getInventarioItems(rinventario.id)
                      .then((rritems) => {
                        rritems.map(it =>{
                          AlmacenItemService.getArticulo(it.articuloId,almacenId)
                            .then((rit) => { 
                              if(!rit)
                              {
                                let dt = {}
                                dt.articuloId = it.articuloId
                                dt.almacenId = almacenId
                                dt.stock = it.stock                                                            
                                AlmacenItemService.setAlmacenItem(dt)                                                                
                                .then((co) => {                      
                                    /*res.status(200).send({result: 'olo' });                        */
                                }) 
                              }else{   
                                let dt = rit                                
                                dt.stock = rit.stock  + it.stock                                                          
                                AlmacenItemService.updateAlmacenItem(dt,rit.id)                                                                
                                .then((co) => {                      
                                    /*res.status(200).send({result: 'actualizado' });                        */
                                }) 
                              }
                            })  
                            return;    
                        }) 
                        /********************BEGIN COMPRA***************/
                        CompraService.getCompras(1,12)
                         .then((compras) => {      
                              res.status(200).send({result: compras}); 
		                      })		                
                          .catch((reason) => {              
                              res.status(400).send({ message: reason });
                          });
                        /********************END COMPRA****************/

                      })
                      .catch((reason) => {   	
                        res.status(400).send({ message: reason });
                      }); 

                    /*****************END FINANCIERO**********************/
                }) 
                .catch((reason) => {   	
                   res.status(400).send({ message: reason });
                 }); 
              /*****************END FINANCIERO**********************/
          })
          .catch((reason) => {   	
            res.status(400).send({ message: reason });
          });
        /*****************END INVENTARIO*********************/
      })                   
      .catch((reason) => {   	
        res.status(400).send({ message: reason });
      });
  }

}



export default CompraController;
