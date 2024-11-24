import {Message} from 'primeng/api';
import ApiResponse from '@/interface/ApiResponse';
import {firstValueFrom} from 'rxjs';
import {returnErrorMessage} from '@/method/error-methods';

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

export {callAPI};
