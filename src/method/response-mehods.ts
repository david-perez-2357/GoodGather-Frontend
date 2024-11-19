import {Message} from 'primeng/api';
import ApiResponse from '../interface/ApiResponse';
import {firstValueFrom, Observable} from 'rxjs';

function callAPI(serviceCall: any): Promise<ApiResponse> {
  return firstValueFrom(serviceCall)
    .then((response: any) => {
      return {
        status: 200,
        message: 'Operación exitosa',
        data: response,
      }}).catch((error: any) => {
        const toastMessage = returnErrorMessage(error);
        throw {
          status: error.status || 500,
          message: error.message || 'Error desconocido',
          data: null,
          toastMessage,
        };
      });
    }

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

export {callAPI, returnErrorMessage};
