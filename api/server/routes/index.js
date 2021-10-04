import usuarios from './usuarioRoutes'
import articulos from './articuloRoutes'
import marcas from './marcaRoutes'
import categorias from './categoriaRoutes'
import proveedores from './proveedorRoutes'
import compras from './compraRoutes'
import files from './FilesRoutes'
import clientes from './clienteRoutes'
import cajas from './cajaRoutes'
import cajasitems from './cajaItemsRoutes'
import almacenes from './almacenRoutes'
import ventas from './ventaRoutes'
import tpv from './tpvRoutes'
import empresa from './empresaRoutes'
import informes from './informesRoutes'
import personas from './personalRoutes'
import servicios from './servicioRoutes'

export default(app) => {
    app.use('/api/usuarios',usuarios);
    app.use('/api/articulos',articulos);
    app.use('/api/marcas',marcas);             
    app.use('/api/categorias',categorias);
    app.use('/api/proveedores',proveedores);
    app.use('/api/compras',compras);
    app.use('/api/files',files);
    app.use('/api/clientes',clientes);	
    app.use('/api/cajas',cajas);
    app.use('/api/cajasitems',cajasitems); 
    app.use('/api/almacenes',almacenes); 
    app.use('/api/ventas',ventas); 
    app.use('/api/tpv',tpv); 
    app.use('/api/empresas',empresa);
    app.use('/api/informes',informes);	
    app.use('/api/personas',personas);	
    app.use('/api/servicios',servicios);	
}
