import {
  crearPedidoService,
  obtenerPedidosService,
  obtenerPedidoPorIdService,
  actualizarEstadoPedidoService,
  actualizarComprobantePagoService,
  obtenerPedidosPorUsuarioService
} from '../services/pedidosServices.js';

// Crear un nuevo pedido
export const createPedido = async (req, res) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const {
      cliente,
      entrega,
      productos,  // Verifica que se reciba productos
      metodoPago,
      subtotal,
      recargoDomicilio,
      total
    } = req.body;

    // Verificar que productos esté definido y sea un array
    if (!productos || !Array.isArray(productos)) {
      return res.status(400).json({
        success: false,
        message: 'El campo productos es obligatorio y debe ser un array'
      });
    }

    // Logging para depuración
    console.log('Contenido de productos recibidos:', JSON.stringify(productos, null, 2));
    console.log('Información de entrega recibida:', JSON.stringify(entrega, null, 2));

    // Mapear la estructura que envía el frontend a la del modelo
    const pedidoData = {
      usuario: req.user._id,
      informacionDelCliente: {
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
        dedicatoria: cliente.dedicatoria || ''
      },
      informacionDeEntrega: {
        tipoPedido: entrega.tipoPedido,
        direccion: entrega.direccion,
        barrio: entrega.barrio,
        ciudad: entrega.ciudad,
        referencias: entrega.referencias || '',
        recargoDomicilio: recargoDomicilio,
        // Añadir información de fecha personalizada
        fechaPersonalizada: entrega.fechaPersonalizada || false,
        fechaEntrega: entrega.fechaEntrega || null,
        horaEntrega: entrega.horaEntrega || null
      },
      resumenPedido: {
        productos: productos.map(item => {
          const productoMapped = {
            nombre: item.producto,
            cantidad: item.cantidad,
            precio: item.precioUnitario,
            photo: item.photo || '',
            selectedIceCream: item.selectedIceCream || null,
            selectedTopping: item.selectedTopping || null
          };

          if (item.productoId && item.productoId.trim() !== '') {
            productoMapped.producto = item.productoId;
          }

          return productoMapped;
        }),
        totalPagar: total
      },
      informacionPago: {
        metodoPago: metodoPago,
        comprobantePago: metodoPago === 'transferencia' ? 'pendiente' : null,
        estadoPago: metodoPago === 'efectivo' ? 'confirmado' : 'pendiente'
      },
      terminosAceptados: true,
      estado: 'pendiente'
    };

    const pedidoGuardado = await crearPedidoService(pedidoData);

    res.status(201).json({
      success: true,
      message: 'Pedido creado correctamente',
      pedidoId: pedidoGuardado._id
    });
  } catch (error) {
    console.warn(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al crear el pedido'
    });
  }
};

// Obtener un pedido por ID
export const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await obtenerPedidoPorIdService(id);

    // Verificar que el pedido pertenezca al usuario o sea un administrador
    if (pedido.usuario.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este pedido'
      });
    }

    res.status(200).json({
      success: true,
      pedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener el pedido'
    });
  }
};

// Actualizar el estado de pago y comprobante
export const actualizarComprobantePago = async (req, res) => {
  try {
    const { id } = req.params;
    const { estadoPago, comprobantePago } = req.body;
    
    const pedido = await obtenerPedidoPorIdService(id);

    // Verificar que el pedido pertenezca al usuario o sea un administrador
    if (pedido.usuario.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este pedido'
      });
    }

    await actualizarComprobantePagoService(id, estadoPago, comprobantePago);

    res.status(200).json({
      success: true,
      message: 'Comprobante de pago actualizado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar el comprobante de pago'
    });
  }
};

// Obtener todos los pedidos (solo para administradores)
export const getAllPedidos = async (req, res) => {
  try {
    const { estado, fechaInicio, fechaFin, pagina, limite } = req.query;
    
    const filtros = { estado, fechaInicio, fechaFin };
    const opciones = { 
      pagina: pagina ? parseInt(pagina) : 1, 
      limite: limite ? parseInt(limite) : 10 
    };
    
    const resultado = await obtenerPedidosService(filtros, opciones);
    
    res.status(200).json({
      success: true,
      ...resultado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener los pedidos'
    });
  }
};

// Obtener pedidos del usuario logueado
export const getUserPedidos = async (req, res) => {
  try {
    const pedidos = await obtenerPedidosPorUsuarioService(req.user._id);
    
    res.status(200).json({
      success: true,
      pedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener tus pedidos'
    });
  }
};

// Actualizar estado del pedido (solo para administradores)
export const updatePedidoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const pedidoActualizado = await actualizarEstadoPedidoService(id, estado);

    res.status(200).json({
      success: true,
      message: 'Estado del pedido actualizado correctamente',
      pedido: pedidoActualizado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar el estado del pedido'
    });
  }
};