export interface ICredential {
    id: number; // ID numérico que identifica al par de credenciales
    username: string; // Nombre de usuario asociado con las credenciales
    password: string; // Contraseña del usuario (debería almacenarse en formato hash)
  }
  