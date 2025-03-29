// src/helpers/myAppointments.js

const myAppointments = [
    {
      id: 1,
      date: new Date("2025-04-01T10:00:00.000Z"), // Podés usar string si preferís
      time: "10:00 AM",
      userId: 1,
      status: "active"
    },
    {
      id: 2,
      date: new Date("2025-04-02T15:30:00.000Z"),
      time: "3:30 PM",
      userId: 2,
      status: "cancelled"
    },
    {
      id: 3,
      date: new Date("2025-04-05T09:00:00.000Z"),
      time: "09:00 AM",
      userId: 1,
      status: "active"
    },
    {
      id: 4,
      date: new Date("2025-04-10T14:00:00.000Z"),
      time: "2:00 PM",
      userId: 3,
      status: "active"
    }
  ];
  
  export default myAppointments;
  