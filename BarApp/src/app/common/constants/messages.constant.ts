import { SweetAlertOptions } from 'sweetalert2';

//delete
export const DELETE_CONFIRMATION_MESSAGE: string =
  '¿Estás seguro de que quieres eliminar el elemento?';
export const DELETE_OPTS: SweetAlertOptions = {
  heightAuto: false,
  title: '¿Estás seguro?',
  text: DELETE_CONFIRMATION_MESSAGE,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#28B463',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sí, eliminar',
  cancelButtonText: 'Cancelar',
};

//cart
export const DELETE_CONFIRMATION_MESSAGE_CART: string =
  '¿Estás seguro de que quieres quitar el elemento del carrito?';
export const DELETE_OPTS_CART: SweetAlertOptions = {
  heightAuto: false,
  title: '¿Quitar del carrito?',
  text: DELETE_CONFIRMATION_MESSAGE_CART,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#28B463',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sí, quitar',
  cancelButtonText: 'Cancelar',
};

//info prom
export const INFO_PROM: SweetAlertOptions = {
  icon: 'info',
  html: 'Las promociones son válidas dentro de un periodo de tiempo específico y/o en días de la semana determinados. <br> Además, se <u>restringirá</u> la posibilidad de agregar productos que no pertenezcan a una <u>categoría específica</u>. <br> Únicamente será posible añadir una promoción a aquellos productos que actualmente tengan <u>stock disponible</u>.',
};

//info discount
export const INFO_DISCOUNT_PROM: SweetAlertOptions = {
  icon: 'info',
  html: 'Cuando la promoción <u>incluye un precio</u>, el <u>descuento</u> actúa como una muestra del potencial de ahorro, y en este caso, su inclusión es opcional. <br> Sin embargo, si la promoción <u>no tiene un precio</u> definido, el <u>descuento</u> se aplicará directamente a los precios de los productos seleccionados.',
};

//order
export const ORDER_CONFIRMATION_OPTS: SweetAlertOptions = {
  title: '¿Estás seguro de que quieres realizar el pedido?',
  text: 'Luego podrás cancelarlo siempre y cuando no haya sido confirmado por el bar!',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#28B463',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Confirmar',
  cancelButtonText: 'Volver',
  reverseButtons: true,
};

export const ORDER_CONFIRMED_OPTS: SweetAlertOptions = {
  title: 'Pedido realizado',
  text: 'Te informaremos sobre el estado de tu pedido',
  icon: 'success',
  confirmButtonText: 'Ir al pedido',
};

//call waiter
export const CALL_WAITER_CONFIRMATION_MESSAGE: string =
  '¿Estás seguro de que requieres de la atención del mesero?';
export const CALL_WAITER: SweetAlertOptions = {
  heightAuto: false,
  title: 'Llamar al mesero',
  text: CALL_WAITER_CONFIRMATION_MESSAGE,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#28B463',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sí, Llamar',
  cancelButtonText: 'Cancelar',
};

//cancel order
export const CANCEL_ORDER_CONFIRMATION_MESSAGE: string =
  '¿Estás seguro de que quieres cancelar el pedido?';
export const CANCEL_ORDER: SweetAlertOptions = {
  heightAuto: false,
  title: '¿Cancelar Pedido?',
  text: CANCEL_ORDER_CONFIRMATION_MESSAGE,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#28B463',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sí, Cancelar',
  cancelButtonText: 'No',
};

//vacate table
export const VACATE_TABLE_CONFIRMATION_MESSAGE: string =
  'Estás seguro de que quieres desocupar la mesa?';
export const VACATE_TABLE: SweetAlertOptions = {
  customClass: { container: 'swal-table' },
  heightAuto: false,
  title: '¿Desocupar la mesa?',
  text: VACATE_TABLE_CONFIRMATION_MESSAGE,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#28B463',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sí',
  cancelButtonText: 'Cancelar',
};

//refresh_tables
export const REFRESH_TABLES_CONFIRMATION_MESSAGE: string =
  'Los actuales ya no podrán volver a utilizarse';
export const REFRESH_TABLES: SweetAlertOptions = {
  customClass: { container: 'swal-table' },
  heightAuto: false,
  title: '¿Generar nuevos códigos?',
  text: REFRESH_TABLES_CONFIRMATION_MESSAGE,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#28B463',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sí',
  cancelButtonText: 'Cancelar',
};

//no web QR compatibility
export const NO_WEB_QR_COMPATIBILITY: SweetAlertOptions = {
  icon: 'info',
  title: '¡Ups! Función no disponible en web',
  html:
    'No podemos procesar tu pedido utilizando el escaneo QR en el navegador. Para continuar, por favor utiliza nuestra aplicación móvil.<br><br>' +
    '<a href="ruta/al/archivo/archivo.apk" download="archivo.apk" class="btn btn-custom"><i class="fas fa-download"></i> Descargar la app</a>' +
    '<button class="btn btn-custom btn-custom-open"><i class="fas fa-mobile-alt"></i> Abrir desde la app</button>',
  showCancelButton: true,
  cancelButtonText: 'Volver',
  cancelButtonAriaLabel: 'Volver',
  showConfirmButton: false,
};

//Confirm changeOrderStatus
export const CONFIRM_CHANGE_ORDER_STATUS: string =
  'El estado del pedido cambiara automáticamente';
export const CHANGE_ORDER_STATUS: SweetAlertOptions = {
  customClass: { container: 'swal-table' },
  heightAuto: false,
  title: '¿Cambiar estado del pedido?',
  text: CONFIRM_CHANGE_ORDER_STATUS,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#28B463',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sí, Cambiar',
  cancelButtonText: 'Cancelar',
};

//Select payment method
export const SELECT_PAYMENT_METHOD: string = 'Seleccioná el método de pago';
export const PAYMENT_METHOD: SweetAlertOptions = {
  heightAuto: false,
  title: '¿Cómo deseas realizar el pago?',
  text: SELECT_PAYMENT_METHOD,
  icon: 'question',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'MercadoPago',
  cancelButtonText: 'Efectivo/Otro',
};
