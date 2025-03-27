interface AppointmentDto {
    date: Date;   
    time: string;  
    userId: number;
    status: "active" | "cancelled";
};

export default AppointmentDto;