export interface IUser {
    id: number; // ID numérico que identifica al usuario
    name: string; // Nombre completo del usuario
    email: string; // Dirección de email del usuario
    birthdate: Date; // Fecha de nacimiento en formato ISO (YYYY-MM-DD)
    nDni: string; // Número de DNI o identificación
    credentialsId: number; // ID de las credenciales, referencia a otra entidad
  }
  