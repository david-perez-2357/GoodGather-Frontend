
interface Event {
  id: number;
  name: string;
  description: string;
  image: string;
  start_date: Date;
  end_date: Date;
  capacity: number;
  bought_tickets: number;
  address: string;
  province: string;
  country: string;
  ticket_price: number;
  deleted: number;
  id_owner: number;
  id_cause: number;
}

export default Event;
