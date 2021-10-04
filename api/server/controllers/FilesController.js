import FileService from "../services/FileService";
import ArticuloService from "../services/ArticuloService";
import ProveedorService from "../services/ProveedorService";
import ClienteService from "../services/ClienteService";
import PersonalService from "../services/PersonalService";
import ServicioService from "../services/ServicioService";

class FilesController {

  static articulos(req, res) {      
     Promise.all([FileService.articulos(req, res)])
       .then(([file]) => {
         const art = {}
         art.filename = file.filename
         Promise.all([ArticuloService.updateArticulo(art, req.params.id)])
           .then(([result]) => {
                 res.status(200).send({ result })
               })
       })
       .catch(reason => {
         console.log(reason)
         res.status(400).send({ 'message': reason })
       })
     
   }
  static proveedores(req, res) { 
     Promise.all([FileService.proveedores(req, res)])
       .then(([file]) => {
         const art = {}
         art.filename = file.filename
         Promise.all([ProveedorService.updateProveedor(art, req.params.id)])
           .then(([result]) => {
                 res.status(200).send({ result })
               })
       })
       .catch(reason => {
         console.log(reason)
         res.status(400).send({ 'message': reason })
       })

   }	
  static clientes(req, res) {
     Promise.all([FileService.clientes(req, res)])
       .then(([file]) => {
         const art = {}
         art.filename = file.filename
         Promise.all([ClienteService.updateCliente(art, req.params.id)])
           .then(([result]) => {
                 res.status(200).send({ result })
               })
       })
       .catch(reason => {
         console.log(reason)
         res.status(400).send({ 'message': reason })
       })

   }

  static servicios(req, res) {
     Promise.all([FileService.servicios(req, res)])
       .then(([file]) => {
         const art = {}
         art.filename = file.filename
         Promise.all([ServicioService.updateServicio(art, req.params.id)])
           .then(([result]) => {
                 res.status(200).send({ result })
               })
       })
       .catch(reason => {
         console.log(reason)
         res.status(400).send({ 'message': reason })
       })

   }
 static personas(req, res) {
	 console.log('PPPP')
     Promise.all([FileService.personas(req, res)])
       .then(([file]) => {
         const art = {}
         art.filename = file.filename
         Promise.all([PersonalService.updatePersona(art, req.params.id)])
           .then(([result]) => {
                 res.status(200).send({ result })
               })
       })
       .catch(reason => {
         console.log(reason)
         res.status(400).send({ 'message': reason })
       })

   }
	

  
}

export default FilesController;

