import { SweetAlertOptions } from 'sweetalert2';

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
