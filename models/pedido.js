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
    },
    // Nuevos campos para fecha personalizada
    fechaPersonalizada: {
      type: Boolean,
      default: false
    },
    fechaEntrega: {
      type: Date,
      required: false,
      validate: {
        validator: function(value) {
          // Si fechaPersonalizada es true, entonces fechaEntrega es requerida
          if (this.informacionDeEntrega.fechaPersonalizada && !value) {
            return false;
          }
          // Si se proporciona una fecha, debe ser en el futuro
          if (value && value <= new Date()) {
            return false;
          }
          return true;
        },
        message: 'La fecha de entrega debe ser proporcionada cuando se selecciona fecha personalizada y debe ser una fecha futura'
      }
    },
    horaEntrega: {
      type: String,
      required: false,
      validate: {
        validator: function(value) {
          // Si fechaPersonalizada es true, entonces horaEntrega es requerida
          if (this.informacionDeEntrega.fechaPersonalizada && !value) {
            return false;
          }
          // Validar formato de hora (HH:MM)
          if (value && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
            return false;
          }
          return true;
        },
        message: 'La hora de entrega debe ser proporcionada cuando se selecciona fecha personalizada y debe tener formato HH:MM'
      }
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
      selectedTopping: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topping',
        required: false
      },
      selectedIceCream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'iceCream',
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

// Método para obtener información de entrega formateada
pedidoSchema.methods.obtenerFechaEntregaFormateada = function() {
  if (!this.informacionDeEntrega.fechaPersonalizada) {
    return 'Lo antes posible (30-45 min)';
  }
  
  if (this.informacionDeEntrega.fechaEntrega && this.informacionDeEntrega.horaEntrega) {
    const fecha = new Date(this.informacionDeEntrega.fechaEntrega);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Convertir hora de 24h a 12h
    const [hora, minutos] = this.informacionDeEntrega.horaEntrega.split(':');
    const horaNum = parseInt(hora);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    const hora12 = horaNum % 12 || 12;
    const horaFormateada = `${hora12}:${minutos} ${ampm}`;
    
    return `${fechaFormateada} a las ${horaFormateada}`;
  }
  
  return 'Fecha personalizada no especificada';
};

const Pedido = mongoose.model("Pedido", pedidoSchema);
export default Pedido;