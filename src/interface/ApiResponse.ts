import {Message} from 'primeng/api';

interface ApiResponse {
  status: number;
  message: string;
  data: any;
  toastMessage?: Message;
}

export default ApiResponse;
