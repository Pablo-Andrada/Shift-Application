import React, { useEffect, useState } from "react";
import styles from "./MisTurnos.module.css";
import useUserContext from "../../hooks/useUserContext";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import CreateAppointment from "../../components/CreateAppointment/CreateAppointment";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const MisTurnos = () => {
    const { user } = useUserContext();
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("todos");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAppointments = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API}/appointments/user/${user.id}`);
            if (!res.ok) throw new Error("No se pudieron obtener los turnos.");
            setAppointments(await res.json());
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, [user]);

    const filtered = filterStatus === "todos"
        ? appointments
        : appointments.filter(a => a.status === filterStatus);

    const handleCancel = async (id) => {
        const res = await fetch(`${API}/appointments/cancel/${id}`, { method: "PUT" });
        if (res.ok) {
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
            toast.success("Turno cancelado.");
        } else { toast.error("No se pudo cancelar."); }
    };

    const handleDismiss = async (id) => {
        const res = await fetch(`${API}/appointments/${id}`, { method: "DELETE" });
        if (res.ok) {
            setAppointments(prev => prev.filter(a => a.id !== id));
            toast.success("Turno eliminado.");
        } else { toast.error("No se pudo eliminar."); }
    };

    const FILTERS = [
        { value: "todos", label: "Todos" },
        { value: "active", label: "Activos" },
        { value: "cancelled", label: "Cancelados" },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Mis Turnos</h1>
                        <p className={styles.subtitle}>
                            {appointments.length > 0
                                ? `${appointments.filter(a => a.status === "active").length} turno${appointments.filter(a => a.status === "active").length !== 1 ? "s" : ""} activo${appointments.filter(a => a.status === "active").length !== 1 ? "s" : ""}`
                                : "Aún no tenés turnos"}
                        </p>
                    </div>
                    <button className={styles.createButton} onClick={() => setIsModalOpen(true)}>
                        + Nuevo Turno
                    </button>
                </div>

                <div className={styles.filterBar}>
                    {FILTERS.map(f => (
                        <button key={f.value}
                            className={`${styles.filterBtn} ${filterStatus === f.value ? styles.filterBtnActive : ""}`}
                            onClick={() => setFilterStatus(f.value)}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading && <p className={styles.loading}>Cargando turnos...</p>}

                {!loading && filtered.length > 0 && (
                    <ul className={styles.appointmentList}>
                        {filtered.map(appt => (
                            <AppointmentCard
                                key={appt.id}
                                {...appt}
                                onCancel={handleCancel}
                                onDismiss={handleDismiss}
                            />
                        ))}
                    </ul>
                )}

                {!loading && filtered.length === 0 && (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>📅</span>
                        <p className={styles.emptyTitle}>No hay turnos para mostrar</p>
                        <p className={styles.emptyText}>
                            {filterStatus === "todos"
                                ? "Todavía no reservaste ningún turno."
                                : `No tenés turnos ${filterStatus === "active" ? "activos" : "cancelados"}.`}
                        </p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <CreateAppointment
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={(newAppt) => { setAppointments(prev => [...prev, newAppt]); setIsModalOpen(false); toast.success("¡Turno creado!"); }}
                />
            )}
        </div>
    );
};

export default MisTurnos;
