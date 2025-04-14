import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  informacionDelCliente: {
    nombre: {
      type: String,
      required: [true, "El nombre del cliente es requerido"],
    },
    apellido: {
      type: String,
      required: false,
    },
    telefono: {
      type: String,
      required: [true, "El numero del cliente es requerido"],
    },
    dedicatoria: {
      type: String,
      required: false,
    },
  },
  informacionDeEntrega: {
    tipoPedido: {
      type: String,
      enum: ['domicilio', 'recoger'],
      required: [true, "El tipo de entrega es requerido"],
    },
    direccion: {
      type: String,
      required: function() { return this.informacionDeEntrega.tipoPedido === 'domicilio'; }
    },
    barrio: {
      type: String,
      required: function() { return this.informacionDeEntrega.tipoPedido === 'domicilio'; }
    },
    ciudad: {
      type: String,
      required: function() { return this.informacionDeEntrega.tipoPedido === 'domicilio'; }
    },
    referencias: {
      type: String,
      required: false,
    },
    recargoDomicilio: {
      type: Number,
      default: 0
    }
  },
  resumenPedido: {
    productos: [{
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: false
      },
      nombre: {
        type: String,
        required: true
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1
      },
      precio: {
        type: Number,
        required: true
      },
      photo: {
        type: String,
        required: false
      },
      topping: {
        type: String,
        required: false
      },
      sabor_helado: {
        type: String,
        required: false
      }
    }],
    totalPagar: {
      type: Number,
      required: true
    }
  },
  informacionPago: {
    metodoPago: {
      type: String,
      enum: ['efectivo', 'tarjeta', 'transferencia'],
      required: true
    },
    comprobantePago: {
      type: String,
      required: function() { return this.informacionPago.metodoPago === 'transferencia'; }
    },
    estadoPago: {
      type: String,
      enum: ['pendiente', 'confirmado', 'rechazado'],
      default: 'pendiente'
    }
  },
  terminosAceptados: {
    type: Boolean,
    required: [true, "Debe aceptar los términos y condiciones"]
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_preparacion', 'en_ruta', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Método para calcular el total del pedido
pedidoSchema.methods.calcularTotal = function() {
  let total = 0;
  this.resumenPedido.productos.forEach(item => {
    total += item.precio * item.cantidad;
  });
  
  if (this.informacionDeEntrega.tipoPedido === 'domicilio') {
    total += this.informacionDeEntrega.recargoDomicilio;
  }
  
  return total;
};

const Pedido = mongoose.model("Pedido", pedidoSchema);
export default Pedido;