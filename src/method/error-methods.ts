import {Message} from 'primeng/api';

/**@
 * Asocia códigos de error HTTP con mensajes detallados para mostrar al usuario.
 * @param error
 */
function returnErrorMessage(error: any): Message {
  if (error.status === 404) {
    return {severity: 'error', summary: 'No se han encontrado datos', detail: 'Por favor, inténtelo de nuevo más tarde.'};
  }else if (error.status === 500) {
    return {severity: 'error', summary: 'Error en el servidor', detail: 'Por favor, inténtelo de nuevo más tarde.'};
  }else if (error.status === 400) {
    return {severity: 'error', summary: 'Error en la petición', detail: 'Por favor, inténtelo de nuevo más tarde.'};
  }else if (error.status === 403) {
    return {severity: 'error', summary: 'Acceso denegado', detail: 'Por favor, inicie sesión e inténtelo de nuevo.'};
  }else {
    return {severity: 'error', summary: 'Error', detail: 'Por favor, inténtelo de nuevo más tarde.'};
  }
}

export {returnErrorMessage};
