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
