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

// Servicio para obtener todos los pedidos con filtros
export const obtenerPedidosService = async (filtros, opciones) => {
  try {
    const { estado, fechaInicio, fechaFin } = filtros;
    const { pagina = 1, limite = 10 } = opciones;
    
    const query = { deletedAt: null };
    
    if (estado) {
      query.estado = estado;
    }
    
    if (fechaInicio && fechaFin) {
      query.createdAt = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }
    
    const skip = (pagina - 1) * limite;
    
    const [pedidos, total] = await Promise.all([
      Pedido.find(query)
        .populate("productos.producto")
        .populate("productos.topping")
        .populate("productos.helado")
        .populate("cliente.usuario")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limite),
      Pedido.countDocuments(query)
    ]);
    
    return {
      pedidos,
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite)
    };
  } catch (error) {
    throw new Error(`Error al obtener pedidos: ${error.message}`);
  }
};

// Servicio para obtener un pedido por ID
export const obtenerPedidoPorIdService = async (id) => {
  try {
    const pedido = await Pedido.findOne({ _id: id, deletedAt: null })
      .populate("productos.producto")
      .populate("productos.topping")
      .populate("productos.helado")
      .populate("cliente.usuario");
    
    if (!pedido) {
      throw new Error("Pedido no encontrado");
    }
    
    return pedido;
  } catch (error) {
    throw new Error(`Error al obtener pedido: ${error.message}`);
  }
};

// Servicio para actualizar el estado de un pedido
export const actualizarEstadoPedidoService = async (id, estado) => {
  try {
    const estadosValidos = ['pendiente', 'confirmado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado'];
    
    if (!estadosValidos.includes(estado)) {
      throw new Error("Estado no válido");
    }
    
    const pedidoActualizado = await Pedido.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { estado },
      { new: true }
    );
    
    if (!pedidoActualizado) {
      throw new Error("Pedido no encontrado");
    }
    
    return pedidoActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar estado: ${error.message}`);
  }
};

// Servicio para eliminar un pedido (borrado lógico)
export const eliminarPedidoService = async (id) => {
  try {
    const pedidoEliminado = await Pedido.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );
    
    if (!pedidoEliminado) {
      throw new Error("Pedido no encontrado");
    }
    
    return pedidoEliminado;
  } catch (error) {
    throw new Error(`Error al eliminar pedido: ${error.message}`);
  }
};

// Servicio para obtener pedidos por usuario
export const obtenerPedidosPorUsuarioService = async (usuarioId) => {
  try {
    const pedidos = await Pedido.find({ 
      "cliente.usuario": usuarioId,
      deletedAt: null
    })
      .populate("productos.producto")
      .populate("productos.topping")
      .populate("productos.helado")
      .sort({ createdAt: -1 });
    
    return pedidos;
  } catch (error) {
    throw new Error(`Error al obtener pedidos por usuario: ${error.message}`);
  }
};
export const actualizarComprobantePagoService = async (id, estadoPago, comprobantePago) => {
  try {
    const pedidoActualizado = await Pedido.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { 
        "informacionPago.estadoPago": estadoPago,
        "informacionPago.comprobantePago": comprobantePago 
      },
      { new: true }
    );
    
    if (!pedidoActualizado) {
      throw new Error("Pedido no encontrado");
    }
    
    return pedidoActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar comprobante de pago: ${error.message}`);
  }
};