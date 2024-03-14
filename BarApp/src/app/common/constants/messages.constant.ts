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
  html: 'Las promociones pueden ser válidas mediante un rango de fechas y/o mediante días de la semana.',
};

//info discount
export const INFO_DISCOUNT_PROM: SweetAlertOptions = {
  icon: 'info',
  html: 'Cuando la promoción <u>incluye un precio</u>, el <u>descuento</u> actúa como una muestra del potencial de ahorro, y en este caso, su inclusión es opcional. <br> Sin embargo, si la promoción <u>no tiene un precio</u> definido, el <u>descuento</u> se aplicará directamente a los precios de los productos seleccionados.',
};
