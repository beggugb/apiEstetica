import VentaService from "../services/VentaService";
import VentaItemService from "../services/VentaItemService";
import InventarioService from "../services/InventarioService";
import InventarioItemService from "../services/InventarioItemService";
import AlmacenItemService from "../services/AlmacenItemService";
import ClienteService from "../services/ClienteService";
import NotaService from "../services/NotaService";
import PlanPagosService from "../services/PlanPagoService";
import ReciboService from "../services/ReciboService";
import AlmacenService from "../services/AlmacenService";
import CajaService from "../services/CajaService";
import CajaItemsService from "../services/CajaItemsService";

import pdfCotizacion from '../../public/documents/cotizacion'
const path = require('path');
const pdf = require('html-pdf');
const hostname = '192.168.0.100'
const port = 4000

var options = {"format": "Letter","orientation":"landscape"};

const createPdf = (venta,items,usuario) => {    
    let img = `http://${hostname}:${port}/api/static/images/empresa/sm/logo.png`;  
     pdf.create(pdfCotizacion(img,venta,items,usuario), options).toFile(`${process.cwd()}/api/public/documents/cotizacion${cotizacion.id}.pdf`, (err) => {
       if(err) { res.send(Promise.reject());}
           return 0  
    })      
  }

  
class VentaController {

  static send(req, res) {      
    Promise.all([VentaService.getVenta(req.params.id),VentaItemService.getVentaItems(req.params.id)]) 
      .then(([venta,items]) => { 
        /***********************begin-sipm1***************** */
        UsuarioService.getUsuario(venta.usuarioId)
            .then((usuario) => { 
              /***********************begins***************** */
              Promise.all([createPdf(venta,items,usuario)])           
                .then(([pdf]) => { 
                    MailController.sends("cotizacion",venta)           
                      .then((mail) => {
                      res.status(200).send({ result: mail});
                    })
                })
                .catch((reason)  => reject(reason));
              /***********************begins***************** */ 

            })
            .catch((reason)  => reject(reason));
        /***********************end-sipm1***************** */
      })
      .catch((reason)  => reject(reason));
}

 
  
  static registrar(req, res) {
     const { item, items } = req.body
     console.log(item)
     console.log(items) 
     /**************************BEGIN VENTA***********************/
     VentaService.setVenta(item)
     .then((venta) =>{
	     console.log(venta)
      let citems = []
        items.map((it =>{
          let dat = {}
          dat.cantidad = it.cantidad
          dat.articuloId = it.articuloId
          dat.ventaId = venta
          dat.nombre = it.nombre
          dat.categoria = it.categoria 
          dat.valor = it.valor
          dat.codigo = it.codigo         
          dat.marca = it.marca          
          citems.push(dat)                  
        })) 
        /************************BEGIN VENTAITE**************/
        VentaItemService.setVentaItem(citems)
          .then((iVentas) => {  
            Promise.all([VentaService.getVenta(venta),VentaItemService.getVentaItems(venta),ClienteService.getCliente(item.clienteId)])
              .then(([rventa,rventas,rcliente]) => {
                /*******************BEGIN GESTS***************/
                Promise.all([VentaItemService.setVentaItem(citems),VentaService.todu(rventa,rventa.id)])
                  .then(([iventas,ioo]) => {    
                    /*******************END GESTS***************/  
                    Promise.all([VentaService.getVenta(venta),VentaItemService.getVentaItems(venta)])
                      .then(([rventa,rventas]) => {       
                        res.status(200).send({result: {"item":rventa, "items":rventas }});
                      })
                      .catch((reason) => {
                        console.log(reason)      
                        res.status(400).send({ message: reason });
                      });   
                      /*******************END GESTS***************/
                  })
                  .catch((reason) => {  
                    console.log(reason)            
                    res.status(400).send({ message: reason });
                   });
                /*******************END GESTS***************/
                
              })
              .catch((reason) => {  
                console.log(reason)            
                res.status(400).send({ message: reason });
               });              

          })
          .catch((reason) => {  
            console.log(reason)            
            res.status(400).send({ message: reason });
           });
        /************************END VENTAITE**************/              
     })
     .catch((reason) => {  
      console.log(reason)            
      res.status(400).send({ message: reason });
     });
     /**************************END VENTA***********************/
  }
  
  static update(req, res) {
    const { id, tipo, almacenId, usuarioId, clienteId  } = req.body
    console.log(req.params.id)
    const d = new Date() 
    CajaService.getItem(usuarioId)
      .then((caja) => {                      
        var dd = caja ? new Date(caja.createdAt) : new Date('2020-01-01 03:24:55.528-04') 
        var fcaja = (new Date(dd + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        var formatted = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]         
        if(fcaja !== formatted){
          /*res.status(401).send({ result :{message: "No tiene caja abierta" }});*/
          res.status(400).send({ message: "No tiene caja abierta" });
        }else{
          /**************************BEGIN VENTA***********************/
          Promise.all([VentaService.getVenta(id),VentaItemService.getVentaItems(id),ClienteService.getCliente(clienteId)])
          .then(([rventa,rventas,rcliente]) => { 
            let newInventario = {}
            newInventario.nro = rventa.id
            newInventario.fechaInventario = d
            newInventario.tipo = "venta"
            newInventario.nroItems = rventa.nroItems
            newInventario.total = rventa.total
            newInventario.observaciones = "Venta Sr.(a)" + rcliente.nombre
            newInventario.stock = rventa.nroItems
            newInventario.usuarioId = rventa.usuarioId
            newInventario.ventaId = rventa.id    
            newInventario.almacenorigenId = almacenId
            newInventario.almacendestinoId = almacenId        
            let nventa = rventa
            nventa.estado = true
            /*1*************************END VENTA***********************/
            Promise.all([InventarioService.setInventario(newInventario),VentaService.updateVenta(nventa,rventa.id)])
            .then(([rinventario,nn]) => {
              let citems = []
              rventas.map((it =>{
                  let dat = {}
                  dat.cantidad = it.cantidad
                  dat.articuloId = it.articuloId
                  dat.inventarioId = rinventario.id
                  dat.stock = it.cantidad
                  citems.push(dat)                  
              }))
                /*2*************************START VENTA***********************/
                  Promise.all([InventarioItemService.setInventarioItem(citems),InventarioService.todu(rinventario,rinventario.id)])		 
                    .then(([rinventarios,op]) => { 
                      /*3*************************START VENTA***********************/
                      InventarioItemService.getInventarioItems(rinventario.id)
                      .then((rritems) => {
                        rritems.map(it =>{                          
                          AlmacenItemService.getArticulo(it.articuloId,almacenId)
                            .then((rit) => {                                         
                              if(rit.stock > 0)
                              {
                                let dt = rit                                
                                dt.stock = rit.stock  - it.stock                                                          
                                AlmacenItemService.updateAlmacenItem(dt,rit.id)                                                                
                                .then((co) => {                      
                                 
                                }) 
                              }
                            })  
                            return;    
                        })
                        /*4*************************START NOTA***********************/
                        let nNota = {                                    
                          tipo: 'contado',
                          montoTotal: rventa.total,
                          pagoTotal: rventa.total,
                          saldoTotal: 0,
                          fechaVencimiento: d,
                          ventaId: rventa.id
                        } 
                          NotaService.setNota(nNota)
                          .then((resNota) => {  
                            let nPlan={
                              cuota: 1,
                              monto: rventa.total,
                              estado: true,
                              fechaPago: d,
                              notaId: resNota
                            }
                            /*5*************************START PLAN***********************/
                                PlanPagosService.setPlanPagoItem(nPlan)
                                  .then((resPlan) => {  
                                    let nRecibo = {                                    
                                        glosa: 'venta contado',
                                        monto: rventa.total,
                                        cliente: rcliente.nombres,
                                        nit: rcliente.nit,
                                        pagoId: resPlan
                                    } 

                                    /*6*************************START RECIBO***********************/
                                    ReciboService.setRecibo(nRecibo)
                                    .then((resRecibo) => {
                                      const citem = {}
                                            citem.monto = rventa.total
                                            citem.tipo = "ingreso"
                                            citem.label = "venta TPV " + rcliente.nombres
                                            citem.estado = true
                                            citem.cajaId = caja.id
                                      /*7*************************START RECIBO***********************/
                                      CajaItemsService.add(citem)
                                      .then((icaja) => { 
                                        const newCaja = caja                                        
                                        newCaja.montoIngreso = parseFloat(caja.montoIngreso) + parseFloat(rventa.total)
                                        newCaja.montoFinal = parseFloat(caja.montoFinal) +  parseFloat(rventa.total)
                                          /*8*************************START RECIBO***********************/  
                                          Promise.all([CajaService.update(newCaja,caja.id),VentaService.getVentas(1,12)])
                                          .then(([xcaja, articulos]) => {
                                            res.status(200).send({result: articulos });  
                                          })
                                          .catch((reason) => {  
                                            console.log(reason)            
                                            res.status(400).send({ message: reason });
                                          });
                                          /*8*************************END RECIBO***********************/
                                      })
                                      .catch((reason) => {  
                                        console.log(reason)            
                                        res.status(400).send({ message: reason });
                                      });
                                      /*7*************************START RECIBO***********************/
                                    })
                                    .catch((reason) => {  
                                      console.log(reason)            
                                      res.status(400).send({ message: reason });
                                    });

                                    /*6*************************START PLAN***********************/                                    

                                  })                                                              
                               
                                .catch((reason) => {  
                                  console.log(reason)            
                                  res.status(400).send({ message: reason });
                                });
                                
                            /*5*************************END NOTA***********************/
                          })                            
                          .catch((reason) => {  
                              console.log(reason)            
                              res.status(400).send({ message: reason });
                            });  
                        /*4*************************END NOTA***********************/
                      })
                      .catch((reason) => {  
                        console.log(reason)            
                        res.status(400).send({ message: reason });
                      });
                      /*3*************************END VENTA***********************/

                    })
                    .catch((reason) => {  
                      console.log(reason)            
                      res.status(400).send({ message: reason });
                  }); 

                /*2*************************START VENTA***********************/
              
            })
            .catch((reason) => {  
                console.log(reason)            
                res.status(400).send({ message: reason });
            });            
            /*1*************************END VENTA***********************/
          })
          .catch((reason) => {  
            console.log(reason)            
            res.status(400).send({ message: reason });
          });
          /**************************END VENTA***********************/
        }
       })        
     
      }
  
    static send(req, res) {
     
    }

    static borrar(req, res) {
      VentaItemService.deleteVentaItems(req.params.id)
	      .then((categor) => {
            VentaService.deleteVenta(req.params.id)
              .then((it) => {
	                VentaService.getVentas(1,12)
		                  .then((ventas) => {
                          res.status(200).send({result: ventas });                  	    
                  })
            })		    
        })
        .catch((reason) => {
        res.status(400).send({ message: reason });
      });    
    }

    static ventaDirecta(req, res) {    
      const { item, items, almacenId } = req.body        
      const d = new Date()        
      CajaService.getItem(item.usuarioId)
        .then((caja) => {                      
          var dd = caja ? new Date(caja.createdAt) : new Date('2020-01-01 03:24:55.528-04') 
          var fcaja = (new Date(dd + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
          var formatted = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]         
          if(fcaja !== formatted){
            res.status(400).send({ result :{message: "No tiene caja abierta" }});
          }else{
            /**********************BEGIN CAJA*******************/
              VentaService.setVenta(item)
              .then((venta) =>{
                let citems = []
                    items.map((it =>{
                        let dat = {}
                        dat.cantidad = it.cantidad
                        dat.articuloId = it.articuloId
                        dat.valor = it.valor
                        dat.ventaId = venta
                        dat.fechaRegistro = fcaja
                        dat.personalId = item.personalId
                        dat.comision = (parseInt(it.comision) / 100)  * (parseInt(it.valor) * parseInt(it.cantidad))
                        citems.push(dat)                  
                    })) 
                  /**********************BEGIN VENTA*******************/    
                    VentaItemService.setVentaItem(citems)
                    .then((iVentas) => {    
                      Promise.all([VentaService.getVenta(venta),VentaItemService.getVentaItems(venta),ClienteService.getCliente(item.clienteId)])
                        .then(([rventa,rventas,rcliente]) => {
                            let newInventario = {}
                            newInventario.nro = rventa.id
                            newInventario.fechaInventario = d
                            newInventario.tipo = "venta"
                            newInventario.nroItems = rventa.nroItems
                            newInventario.total = rventa.total
                            newInventario.observaciones = "venta directa"
                            newInventario.stock = rventa.nroItems
                            newInventario.usuarioId = rventa.usuarioId
                            newInventario.ventaId = rventa.id    
                            newInventario.almacenorigenId = almacenId
                            newInventario.almacendestinoId = almacenId  
                              /*******------******* */                                
                              let nventa = rventa
                                nventa.estado = true 
                                nventa.fechaVenta = fcaja
                              /*******------******* */      
                            /**********************BEGIN VENTA********************/ 
                            Promise.all([InventarioService.setInventario(newInventario),VentaService.updateVenta(nventa,rventa.id)])
                              .then(([rinventario,nn]) => {
                                  let citems = []
                                  rventas.map((it =>{
                                      let dat = {}
                                      dat.cantidad = it.cantidad
                                      dat.articuloId = it.articuloId
                                      dat.inventarioId = rinventario.id
                                      dat.stock = it.cantidad
                                      citems.push(dat)                  
                                  }))
                                  /**********************BEGIN FINANCIERO********************/ 
                                  Promise.all([InventarioItemService.setInventarioItem(citems),InventarioService.todu(rinventario,rinventario.id)])		 
                                      .then(([rinventarios,op]) => {    
                                        /**********************BEGIN INVENTARIO********************/ 
                                        InventarioItemService.getInventarioItems(rinventario.id)
                                          .then((rritems) => {
                                            rritems.map(it =>{
                                              /**********************BEGIN ALMACENES********************/ 
                                              AlmacenItemService.getArticulo(it.articuloId,almacenId)
                                                .then((rit) => {                                         
                                                  if(rit.stock > 0)
                                                  {
                                                    let dt = rit                                
                                                    dt.stock = rit.stock  - it.stock                                                          
                                                    AlmacenItemService.updateAlmacenItem(dt,rit.id)                                                                
                                                    .then((co) => {                      
                                                     
                                                    }) 
                                                  }
                                                })  
                                                return;    
                                            })
                                            /**********************END ALMACENES********************/ 
                                              let nNota = {                                    
                                                tipo: 'contado',
                                                montoTotal: rventa.total,
                                                pagoTotal: rventa.total,
                                                saldoTotal: 0,
                                                fechaVencimiento: d,
                                                ventaId: rventa.id
                                              } 

                                            /**********************BEGIN NOTA********************/ 
                                            NotaService.setNota(nNota)
                                              .then((resNota) => {  
                                                let nPlan={
                                                  cuota: 1,
                                                  monto: rventa.total,
                                                  estado: true,
                                                  fechaPago: d,
                                                  notaId: resNota
                                                }
                                                  /**********************BEGIN PLAN********************/ 
                                                  PlanPagosService.setPlanPagoItem(nPlan)
                                                    .then((resPlan) => {  
                                                      let nRecibo = {                                    
                                                        glosa: 'venta contado',
                                                        monto: rventa.total,
                                                        cliente: rcliente.nombres,
                                                        nit: rcliente.nit,
                                                        pagoId: resPlan
                                                      } 
                                                        /**********************BEGIN RECIBO********************/ 
                                                        ReciboService.setRecibo(nRecibo)
                                                          .then((resRecibo) => {
                                                              /**********************BEGIN CAJA ITEM********************/
                                                              const citem = {}
                                                              citem.monto = rventa.total
                                                              citem.tipo = "ingreso"
                                                              citem.label = "venta servicio" + rcliente.nombres
                                                              citem.estado = true
                                                              citem.cajaId = caja.id
                                                              CajaItemsService.add(citem)
                                                                .then((icaja) => { 
                                                                  const newCaja = caja                                        
                                                                  newCaja.montoIngreso = parseFloat(caja.montoIngreso) + parseFloat(rventa.total)
                                                                  newCaja.montoFinal = parseFloat(caja.montoFinal) +  parseFloat(rventa.total)
                                                                  /**********************BEGIN CAJA-ARTICULOS********************/
                                                                  Promise.all([CajaService.update(newCaja,caja.id),AlmacenService.getStock(0, almacenId)])
                                                                    .then(([xcaja, articulos]) => {
                                                                      res.status(200).send({result: articulos });  
                                                                    })
                                                                    .catch((reason) => {  
                                                                      console.log(reason)            
                                                                      res.status(400).send({ message: reason });
                                                                    });
                                                                  /**********************END CAJA-ARTICULOS********************/

                                                                })
                                                                .catch((reason) => {  
                                                                  console.log(reason)            
                                                                  res.status(400).send({ message: reason });
                                                                });
                                                              /**********************END CAJA ITEM**********************/
                                                          })
                                                          .catch((reason) => {  
                                                            console.log(reason)            
                                                            res.status(400).send({ message: reason });
                                                          });
                                                        /**********************END RECIBO********************/ 

                                                    })
                                                    .catch((reason) => {  
                                                      console.log(reason)            
                                                      res.status(400).send({ message: reason });
                                                    });
                                                  /**********************END PLAN********************/ 

                                              })
                                              .catch((reason) => {  
                                                console.log(reason)            
                                                res.status(400).send({ message: reason });
                                              });
                                            /**********************END NOTA********************/ 

                                          })
                                          .catch((reason) => {  
                                            console.log(reason)            
                                            res.status(400).send({ message: reason });
                                          });
                                        /**********************END INVENTARIO********************/ 
                                      })
                                      .catch((reason) => {  
                                        console.log(reason)            
                                        res.status(400).send({ message: reason });
                                      });
                                  /**********************END FINANCIERO********************/ 
                              })
                              .catch((reason) => {  
                                console.log(reason)            
                                res.status(400).send({ message: reason });
                              });
                            /**********************END VENTA********************/ 

                        })
                        .catch((reason) => {  
                          console.log(reason)            
                          res.status(400).send({ message: reason });
                        });

                    })
                    .catch((reason) => {  
                      console.log(reason)            
                      res.status(400).send({ message: reason });
                    });
                  /**********************END VENTA********************/    
              })
              .catch((reason) => {  
                console.log(reason)            
                res.status(400).send({ message: reason });
              });
            /**********************END CAJA********************/
          }
        })      
        .catch((reason) => {
          console.log(reason)		
          res.status(400).send({ message: reason.message, cliente: null });
        });
    }  



  static actualizar(req, res) {    
    VentaService.updateVenta(req.body,req.params.id)
      .then((Venta) => {              
        VentaService.getVentas(1,12)
            .then((ventas) => {     
                res.status(200).send({result: ventas });            
            })    
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }
  static item(req, res) {        
    Promise.all([VentaService.getVenta(req.params.id),VentaItemService.getVentaItems(req.params.id)])
        .then(([rVenta,rVentas]) => {        
            res.status(200).send({result: {"item":rVenta, "items":rVentas }});
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static data(req, res) {    
    VentaService.getVentas(req.params.page,req.params.num)
      .then((ventas) => {                      
            res.status(200).send({result: ventas });                        
        })                   
      .catch((reason) => {              
        res.status(400).send({ message: reason });
    });
  }

  static buscar(req, res) {
    const { nombre } = req.body     
    console.log(nombre)	  
    VentaService.searchVentas(nombre)
      .then((ventas) => {                      
            res.status(200).send({result: ventas });                        
        })                   
      .catch((reason) => {              
	console.log(reason)      
        res.status(400).send({ message: reason });
    });
  }



  static dataUsuario(req, res) {
    VentaService.getVentasUsuario(req.params.page,req.params.num,req.params.usuario)
      .then((ventas) => {
            res.status(200).send({result: ventas });
        })
      .catch((reason) => {
        res.status(400).send({ message: reason });
    });
  }	

}



export default VentaController;
