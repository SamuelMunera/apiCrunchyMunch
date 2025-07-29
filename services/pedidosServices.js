import Pedido from "../models/pedido.js";

// Servicio para crear un nuevo pedido
export const crearPedidoService = async (pedidoData) => {
  try {
    const nuevoPedido = new Pedido(pedidoData);
    return await nuevoPedido.save();
  } catch (error) {
    throw new Error(`Error al crear pedido: ${error.message}`);
  }
};

// Servicio para obtener todos los pedidos con filtros y paginación
export const obtenerPedidosService = async (filtros = {}, opciones = {}) => {
  try {
    const { estado, fechaInicio, fechaFin } = filtros;
    const { pagina = 1, limite = 10 } = opciones;
    
    const query = { deletedAt: null };
    
    if (estado) {
      query.estado = estado;
    }
    
    if (fechaInicio || fechaFin) {
      query.fechaCreacion = {};
      if (fechaInicio) {
        query.fechaCreacion.$gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        query.fechaCreacion.$lte = new Date(fechaFin);
      }
    }
    
    const skip = (pagina - 1) * limite;
    
    const [pedidos, total] = await Promise.all([
      Pedido.find(query)
        .sort({ fechaCreacion: -1 })
        .skip(skip)
        .limit(limite)
        .populate('usuario', 'nombre email'),
      Pedido.countDocuments(query)
    ]);
    
    const totalPaginas = Math.ceil(total / limite);
    
    return {
      pedidos,
      paginacion: {
        total,
        pagina,
        limite,
        totalPaginas
      }
    };
  } catch (error) {
    throw new Error(`Error al obtener pedidos: ${error.message}`);
  }
};

// Servicio para obtener un pedido por ID
export const obtenerPedidoPorIdService = async (pedidoId) => {
  try {
    const pedido = await Pedido.findById(pedidoId)
      .populate('usuario', 'nombre email')
      .populate('resumenPedido.productos.producto', 'name photo');
    
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    
    return pedido;
  } catch (error) {
    throw new Error(`Error al obtener pedido: ${error.message}`);
  }
};

// Servicio para actualizar el estado de un pedido
export const actualizarEstadoPedidoService = async (pedidoId, nuevoEstado) => {
  try {
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      pedidoId,
      { estado: nuevoEstado },
      { new: true }
    );
    
    if (!pedidoActualizado) {
      throw new Error('Pedido no encontrado');
    }
    
    return pedidoActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar estado del pedido: ${error.message}`);
  }
};

// Servicio para actualizar el comprobante de pago
export const actualizarComprobantePagoService = async (pedidoId, estadoPago, comprobantePago) => {
  try {
    const updateData = { 'informacionPago.estadoPago': estadoPago };
    
    if (comprobantePago) {
      updateData['informacionPago.comprobantePago'] = comprobantePago;
    }
    
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      pedidoId,
      updateData,
      { new: true }
    );
    
    if (!pedidoActualizado) {
      throw new Error('Pedido no encontrado');
    }
    
    return pedidoActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar comprobante de pago: ${error.message}`);
  }
};

// Servicio para obtener pedidos por usuario
export const obtenerPedidosPorUsuarioService = async (usuarioId) => {
  try {
    const pedidos = await Pedido.find({
      usuario: usuarioId,
      deletedAt: null
    })
    .sort({ fechaCreacion: -1 })
    .populate('resumenPedido.productos.producto', 'name photo')
    .populate('resumenPedido.productos.selectedTopping') // Añadido para populate del topping
    .populate('resumenPedido.productos.selectedIceCream'); // Añadido para populate del helado

    return pedidos;
  } catch (error) {
    throw new Error(`Error al obtener pedidos del usuario: ${error.message}`);
  }
};