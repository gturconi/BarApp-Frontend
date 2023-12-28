import { Component, OnInit } from "@angular/core";

interface Categoria {
  nombre: string;
  icono: string;
}

interface Pregunta {
  categoria: string;
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"],
})
export class FaqComponent implements OnInit {
  categoriaSeleccionada!: Categoria;

  categorias = [
    { nombre: "Cuenta", icono: "people-outline" },
    { nombre: "Pedido", icono: "reader-outline" },
    { nombre: "Reserva", icono: "calendar-outline" },
    { nombre: "Escanear QR", icono: "qr-code-outline" },
  ];

  preguntas = [
    {
      categoria: "Cuenta",
      pregunta: " ¿Cómo creo una cuenta?",
      respuesta:
        'Puedes crear una cuenta nueva haciendo clic en el botón "Registrarse" en la pantalla de inicio. Luego, sigue las instrucciones para completar tu registro con la información solicitada.',
    },
    {
      categoria: "Cuenta",
      pregunta: " ¿Olvidé mi contraseña? ¿Cómo puedo restablecerla?",
      respuesta:
        'Si olvidaste tu contraseña, ve a la pantalla de inicio de sesión y selecciona "¿Olvidaste tu contraseña?" Sigue los pasos indicados para restablecerla a través del correo electrónico asociado a tu cuenta.',
    },
    {
      categoria: "Cuenta",
      pregunta:
        "¿Puedo cambiar mi dirección de correo electrónico o información personal?",
      respuesta:
        'Sí, puedes actualizar tu información personal en la sección de "Perfil" dentro de la App. Allí encontrarás opciones para editar tu correo electrónico, nombre y otros detalles personales.',
    },
    {
      categoria: "Cuenta",
      pregunta: "¿Qué hago si encuentro un problema técnico con mi cuenta?",
      respuesta:
        'Si tienes problemas técnicos, te recomendamos contactar a nuestro equipo de soporte. En la sección de "Sobre nosotros"/"Contacto", encontrarás las instrucciones para comunicarte con nosotros.',
    },
    {
      categoria: "Pedido",
      pregunta: "¿Cómo realizo un pedido en la App?",
      respuesta:
        "Para realizar un pedido, inicia sesión en la App, selecciona los productos que te gustaría pedir, escanee el QR situado en la mesa correspondiente y proceda al checkout para confirmar tu pedido.",
    },
    {
      categoria: "Pedido",
      pregunta: "¿Qué métodos de pago están disponibles?",
      respuesta:
        "Aceptamos pagos mediante Mercado Pago y también ofrecemos opciones de pago alternativas como efectivo o tarjeta al momento de la entrega.",
    },
    {
      categoria: "Pedido",
      pregunta: "¿Puedo modificar o cancelar mi pedido después de realizarlo?",
      respuesta:
        "Una vez realizado el pedido, sólo se permitirá cancelar el mismo en caso de que este aún no haya sido confirmado. ",
    },
    {
      categoria: "Reserva",
      pregunta: "¿Cómo puedo realizar una reserva en su bar?",
      respuesta:
        'Para reservar utiliza nuestra App en la sección "Reservas". También puedes visitarnos personalmente. Seleccione la mesa la fecha, el horario correspondiente y su reserva estará lista!',
    },
    {
      categoria: "Reserva",
      pregunta: "¿Cuál es la política de cancelación para las reservas?",
      respuesta:
        "Apreciamos la notificación anticipada en caso de cancelación. Por favor, notifique en la App con antelación para cualquier cambio o cancelación.",
    },
    {
      categoria: "Reserva",
      pregunta: "¿Puedo hacer cambios en mi reserva una vez confirmada?",
      respuesta:
        "¡Por supuesto! Estaremos encantados de ayudarte con cualquier cambio en tu reserva, siempre y cuando haya disponibilidad desde la App.",
    },
    {
      categoria: "Reserva",
      pregunta: "¿Tienen horarios específicos para las reservas?",
      respuesta:
        "Nuestro horario para reservas varía. Te recomendamos consultar nuestros horarios de apertura y disponibilidad actualizada desde la App.",
    },
    {
      categoria: "Escanear QR",
      pregunta: "¿Por qué debo escanear el código QR en la app del bar?",
      respuesta:
        "Escanear el código QR te permite realizar pedidos desde tu mesa y disfrutar de una experiencia sin contacto.",
    },
    {
      categoria: "Escanear QR",
      pregunta: "¿Cómo escaneo el código QR desde la app del bar?",
      respuesta:
        'Abre la app, selecciona los productos que deseas pedir, finalmente presiona sobre la opción "Confirmar Pedido", apunta la cámara del teléfono al código y espera a que confirme la operación.',
    },
    {
      categoria: "Escanear QR",
      pregunta: "¿El escaneo del código QR requiere conexión a internet?",
      respuesta:
        "Sí, para acceder al menú digital y realizar pedidos necesitas conexión a internet.",
    },
  ];

  preguntasFiltradas: Pregunta[] = [];

  constructor() {}

  ngOnInit() {
    const categoriaPredeterminada = this.categorias[0];
    this.seleccionarCategoria(categoriaPredeterminada);
  }

  seleccionarCategoria(categoria: Categoria) {
    this.preguntasFiltradas = this.preguntas.filter(
      pregunta => pregunta.categoria === categoria.nombre
    );
    this.categoriaSeleccionada = categoria;
  }
}
