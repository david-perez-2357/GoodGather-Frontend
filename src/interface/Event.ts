
interface Event {
  id: number;
  name: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  capacity: number;
  boughtTickets: number;
  address: string;
  province: string;
  country: string;
  ticketPrice: number;
  deleted: number;
  idOwner: number;
  idCause: number;
}

export default Event;
