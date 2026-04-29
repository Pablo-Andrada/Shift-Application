export interface AppointmentDto {
    date: Date;
    time: string;
    userId: number;
    descripcionFalla?: string;
    vehicleBrand?: string;
    vehicleModel?: string;
    vehiclePlate?: string;
    vehicleYear?: string;
    repairType?: string;
    adminNotes?: string;
    adminMessage?: string;
    estimatedDuration?: number;
    comentarios?: string;
}
