interface AppointmentDto {
    date: Date;   
    time: string;  
    userId: number;
    status: "active" | "cancelled";
    comentarios: string
};

export default AppointmentDto;