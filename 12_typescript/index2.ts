/**
 * Enumeration/Enum = a type which represents named constant 
 * 
 */

enum TicketStatus {
  INITIALISED,
  CANCELLED,
  PENDING,
  CLOSED,
}

const ticket = {
  id: 1,
  title: "new ticket",
  status: TicketStatus.INITIALISED
}
// console.log(ticket);

if (ticket.status == TicketStatus.INITIALISED) {
  console.log("done");

}

enum StatusCode {
  Success = 200,
  Error = 404,
  Accepted = 202,
  Created = 201,
  BadRequest = 400
}

const response = {
  url: "www.jk.com",
  type: "GET",
  data: "some string",
  statusCode: StatusCode.Success
}
// console.log(response);
