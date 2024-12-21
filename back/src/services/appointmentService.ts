import { IAppointment } from '../interfaces/IAppointment';

// Precarga de datos
let appointments: IAppointment[] = [
  {
    id: 1,
    date: new Date('2024-12-25'),
    time: '14:00',
    userId: 1,
    status: 'active',
  },
  {
    id: 2,
    date: new Date('2024-12-26'),
    time: '16:00',
    userId: 2,
    status: 'active',
  },
];

// Generador de ID único
let nextAppointmentId = appointments.length + 1;

// Función para retornar el arreglo completo de turnos
export function getAllAppointments(): IAppointment[] {
  return appointments;
}

// Función para obtener el detalle de un turno por ID
export function getAppointmentById(id: number): IAppointment | null {
  const appointment = appointments.find((appt) => appt.id === id);
  return appointment || null;
}

// Función para crear un nuevo turno
export function createAppointment(
  date: Date,
  time: string,
  userId: number
): IAppointment | null {
  if (!userId) {
    console.error('No se puede crear un turno sin un ID de usuario.');
    return null;
  }

  const newAppointment: IAppointment = {
    id: nextAppointmentId++,
    date,
    time,
    userId,
    status: 'active', // Estado inicial es siempre "active"
  };

  appointments.push(newAppointment);
  return newAppointment;
}

// Función para cancelar un turno
export function cancelAppointment(id: number): boolean {
  const appointment = appointments.find((appt) => appt.id === id);

  if (!appointment) {
    console.error('El turno con el ID especificado no existe.');
    return false;
  }

  appointment.status = 'cancelled'; // Cambiar el estado a "cancelled"
  return true;
}
