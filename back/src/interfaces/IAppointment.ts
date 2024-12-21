export interface IAppointment {
    id: number; // ID numérico que identifica al turno
    date: Date; // Fecha para la cual fue reservado el turno
    time: string; // Hora para la cual fue reservado el turno (formato HH:mm)
    userId: number; // ID del usuario que agendó el turno, referencia al usuario
    status: 'active' | 'cancelled'; // Estado actual del turno
  }
  