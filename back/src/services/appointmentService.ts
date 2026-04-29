import { AppointmentModel, UserModel, AppDataSource } from "../config/data-source";
import { Appointment } from "../entities/Appointment";
import { AppointmentDto } from "../dtos/AppointmentDto";

export async function getAllAppointmentsService(): Promise<Appointment[]> {
    return await AppointmentModel.find({ relations: ["user"] });
}

export async function getAppointmentByIdService(id: number): Promise<Appointment | null> {
    return await AppointmentModel.findOne({ where: { id }, relations: ["user"] });
}

export async function createAppointmentService(dto: AppointmentDto): Promise<Appointment | null> {
    const user = await UserModel.findOneBy({ id: dto.userId });
    if (!user) return null;

    const newAppointment = AppointmentModel.create({
        date: dto.date,
        time: dto.time,
        userId: dto.userId,
        status: "active",
        descripcionFalla: dto.descripcionFalla?.substring(0, 200) || "",
        vehicleBrand: dto.vehicleBrand?.substring(0, 100) || "",
        vehicleModel: dto.vehicleModel?.substring(0, 100) || "",
        vehiclePlate: dto.vehiclePlate?.substring(0, 20) || "",
        vehicleYear: dto.vehicleYear?.substring(0, 4) || "",
        repairType: dto.repairType?.substring(0, 100) || "",
        adminNotes: dto.adminNotes?.substring(0, 200) || "",
        adminMessage: dto.adminMessage?.substring(0, 300) || "",
        estimatedDuration: dto.estimatedDuration || 0,
        comentarios: dto.comentarios?.substring(0, 50) || "",
    });

    newAppointment.user = user;
    await AppointmentModel.save(newAppointment);
    return newAppointment;
}

export async function cancelAppointmentService(id: number): Promise<boolean> {
    const appointment = await AppointmentModel.findOneBy({ id });
    if (!appointment) return false;
    appointment.status = "cancelled";
    await AppointmentModel.save(appointment);
    return true;
}

export async function getAppointmentsByUserIdService(userId: number): Promise<Appointment[]> {
    return await AppointmentModel.find({
        where: { user: { id: userId } },
        relations: ["user"],
        order: { date: "ASC" }
    });
}

export async function updateAppointmentAdminService(
    id: number,
    updates: Partial<Pick<Appointment, "date" | "time" | "adminNotes" | "adminMessage" | "estimatedDuration" | "repairType">>
): Promise<Appointment | null> {
    const appointment = await AppointmentModel.findOne({ where: { id }, relations: ["user"] });
    if (!appointment) return null;
    Object.assign(appointment, updates);
    await AppointmentModel.save(appointment);
    return appointment;
}

export const updateAppointmentReminderSent = async (appointmentId: number): Promise<void> => {
    const repo = AppDataSource.getRepository(Appointment);
    await repo.update(appointmentId, { reminderSent: true });
};

export async function deleteAppointmentService(id: number): Promise<boolean> {
    const appointment = await AppointmentModel.findOneBy({ id });
    if (!appointment) return false;
    await AppointmentModel.delete(id);
    return true;
}

// Horarios disponibles del taller (los gestiona el admin)
export async function getAvailableSlotsService(dateStr: string): Promise<string[]> {
    // Todos los slots posibles del taller: lunes a sábado 8-18hs cada 30min
    const allSlots = generateSlots("08:00", "18:00", 30);

    // Turnos ya ocupados ese día
    const startOfDay = new Date(dateStr + "T00:00:00.000Z");
    const endOfDay = new Date(dateStr + "T23:59:59.999Z");

    const taken = await AppointmentModel.createQueryBuilder("a")
        .where("a.date >= :start AND a.date <= :end", { start: startOfDay, end: endOfDay })
        .andWhere("a.status = :status", { status: "active" })
        .select(["a.time"])
        .getMany();

    const takenTimes = new Set(taken.map(a => a.time));
    return allSlots.filter(slot => !takenTimes.has(slot));
}

function generateSlots(from: string, to: string, intervalMinutes: number): string[] {
    const slots: string[] = [];
    const [fh, fm] = from.split(":").map(Number);
    const [th, tm] = to.split(":").map(Number);
    let current = fh * 60 + fm;
    const end = th * 60 + tm;
    while (current < end) {
        const h = Math.floor(current / 60).toString().padStart(2, "0");
        const m = (current % 60).toString().padStart(2, "0");
        slots.push(`${h}:${m}`);
        current += intervalMinutes;
    }
    return slots;
}
