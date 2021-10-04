import InventarioService from "../services/InventarioService";
import InventarioItemService from "../services/InventarioItemService";
import AlmacenItemService from "../services/AlmacenItemService";
import VentaItemService from "../services/VentaItemService"
import CajaService from "../services/CajaService"
import VentaService from "../services/VentaService"
import CompraService from "../services/CompraService"
import moment from 'moment'

class InformesController {

  static movimientos(req, res) {   
    const { desde, hasta, tipo } = req.body;     
    console.log(desde)     
    console.log(hasta)     
     var dDesde = new Date(desde)
     var dHasta = new Date(hasta)
    
     var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
     var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    Promise.all([InventarioService.total(fdesde,fhasta,tipo),
	    	 InventarioService.totalDetalle(fdesde,fhasta,tipo)])
      .then(([dat,datas]) => {
        res.status(200).send({ result: { detalle: dat.total, data: datas} });
      })
      .catch((reason) => {
         console.log(reason)
        res.status(400).send({ message: reason });
      });    
  }
   static existencias(req, res) {
    const { almacenId, articuloId } = req.body;
    console.log(articuloId)	   
     /*var dDesde = new Date(desde)
     var dHasta = new Date(hasta)
     var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
     var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]*/
      console.log(almacenId)
      Promise.all([AlmacenItemService.existenciasTotal(almacenId,articuloId),AlmacenItemService.existenciasDetalle(almacenId,articuloId)])
        .then(([dat,datas]) => {
            res.status(200).send({ result: { detalle: dat.total, data: datas} });
        })
        .catch((reason) => {         
          console.log(reason)
        res.status(400).send({ message: reason });
      });
  }
  static comisiones(req, res) {   
    const { desde, hasta, personalId } = req.body; 
    
     console.log(desde)
	  console.log(hasta)

     var dDesde = new Date(desde)
     var dHasta = new Date(hasta)
    
     var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
     var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
      
     console.log('--------------')
	  console.log(desde)
	  console.log(hasta)


    //VentaItemService
    Promise.all([VentaItemService.total(fdesde,fhasta),
                 VentaItemService.totalDetalle(fdesde,fhasta)])
          .then(([dat,datas]) => {
              res.status(200).send({ result: { detalle: dat.total, data: datas} });
          })
          .catch((reason) => {
                console.log(reason)
              res.status(400).send({ message: reason });
          }); 
  }

 static dcomisiones(req, res) { 
    const { desde, hasta, personalId } = req.body;

     var dDesde = new Date(desde)
     var dHasta = new Date(hasta)

     var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
     var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    //VentaItemService
    Promise.all([VentaItemService.dtotal(fdesde,fhasta,personalId),
                 VentaItemService.dtotalDetalle(fdesde,fhasta,personalId)])
          .then(([dat,datas]) => {
              res.status(200).send({ result: { detalle: dat.total, data: datas} });
          })
          .catch((reason) => {
                console.log(reason)
              res.status(400).send({ message: reason });
          });
  }

  static balance(req, res) { 
    const { desde, hasta } = req.body;
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    
    Promise.all([
      CajaService.generalTotal(fdesde,fhasta),
      VentaItemService.totals(fdesde,fhasta),
      VentaItemService.totalesGenerales(fdesde,fhasta),
      VentaService.ventaTotal(fdesde,fhasta),
      CompraService.compraTotal(fdesde,fhasta),
    ])
          .then(([cajas,general,totales, ventas, compras]) => {
              res.status(200).send({ result: { ventas:ventas, compras: compras, movimientos: cajas, comisiones: {'articulos': general[0],'servicios': general[1]}, consolidado: {'articulos': totales[0],'servicios': totales[1],  }}});
              /*ventas: [],compras: [],        consolidado: [], movimientos:[],   existencias:[],  comisiones:[],*/
          })
          .catch((reason) => {
                console.log(reason)
              res.status(400).send({ message: reason });
          });
  }
	
	

}
export default InformesController;
