import { SweetAlertOptions } from "sweetalert2";

export const DELETE_CONFIRMATION_MESSAGE: string =
  "¿Estás seguro de que quieres eliminar el elemento?";
export const DELETE_OPTS: SweetAlertOptions = {
  heightAuto: false,
  title: "¿Estás seguro?",
  text: DELETE_CONFIRMATION_MESSAGE,
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
};
