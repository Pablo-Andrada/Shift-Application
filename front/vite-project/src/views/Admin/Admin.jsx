import React, { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import useUserContext from "../../hooks/useUserContext";
import { toast } from "react-toastify";
import CreateAppointment from "../../components/CreateAppointment/CreateAppointment";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const STATUS_LABELS = { active: "Activo", cancelled: "Cancelado" };

const Admin = () => {
    const { user } = useUserContext();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("todos");
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/appointments`);
            const data = await res.json();
            setAppointments(data);
        } catch {
            toast.error("No se pudieron cargar los turnos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const filtered = appointments.filter(a => {
        const matchStatus = filterStatus === "todos" || a.status === filterStatus;
        const matchDate = !filterDate || a.date?.startsWith(filterDate);
        return matchStatus && matchDate;
    });

    // Agrupar por fecha
    const grouped = filtered.reduce((acc, a) => {
        const d = a.date?.split("T")[0] || "Sin fecha";
        if (!acc[d]) acc[d] = [];
        acc[d].push(a);
        return acc;
    }, {});
    const sortedDates = Object.keys(grouped).sort();

    const handleCancel = async (id) => {
        if (!window.confirm("¿Cancelar este turno?")) return;
        const res = await fetch(`${API}/appointments/cancel/${id}`, { method: "PUT" });
        if (res.ok) { toast.success("Turno cancelado."); fetchAll(); }
        else toast.error("No se pudo cancelar.");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este turno permanentemente?")) return;
        const res = await fetch(`${API}/appointments/${id}`, { method: "DELETE" });
        if (res.ok) { toast.success("Turno eliminado."); fetchAll(); }
        else toast.error("No se pudo eliminar.");
    };

    const startEdit = (appt) => {
        setEditingId(appt.id);
        setEditForm({
            date: appt.date?.split("T")[0] || "",
            time: appt.time || "",
            repairType: appt.repairType || "",
            estimatedDuration: appt.estimatedDuration || 0,
            adminNotes: appt.adminNotes || "",
            adminMessage: appt.adminMessage || ""
        });
    };

    const handleEditSave = async (id) => {
        const body = {
            ...editForm,
            date: editForm.date ? new Date(editForm.date).toISOString() : undefined
        };
        const res = await fetch(`${API}/appointments/admin/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            toast.success("Turno actualizado.");
            setEditingId(null);
            fetchAll();
        } else {
            toast.error("No se pudo actualizar.");
        }
    };

    const today = new Date().toISOString().split("T")[0];
    const todayCount = appointments.filter(a => a.date?.startsWith(today) && a.status === "active").length;
    const totalActive = appointments.filter(a => a.status === "active").length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>⚙️ Panel de Administración</h1>
                    <p className={styles.subtitle}>Bienvenido, {user?.name}</p>
                </div>
                <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
                    + Crear turno para cliente
                </button>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{todayCount}</span>
                    <span className={styles.statLabel}>Turnos hoy</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{totalActive}</span>
                    <span className={styles.statLabel}>Activos totales</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statNum}>{appointments.length}</span>
                    <span className={styles.statLabel}>Todos los turnos</span>
                </div>
            </div>

            {/* Filtros */}
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label>Filtrar por fecha:</label>
                    <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                    {filterDate && <button onClick={() => setFilterDate("")} className={styles.clearBtn}>✕ Limpiar</button>}
                </div>
                <div className={styles.filterGroup}>
                    <label>Estado:</label>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="todos">Todos</option>
                        <option value="active">Activos</option>
                        <option value="cancelled">Cancelados</option>
                    </select>
                </div>
            </div>

            {loading && <p className={styles.loading}>Cargando turnos...</p>}

            {!loading && filtered.length === 0 && (
                <p className={styles.empty}>No hay turnos que coincidan con los filtros.</p>
            )}

            {/* Turnos agrupados por fecha */}
            {!loading && sortedDates.map(dateKey => (
                <div key={dateKey} className={styles.dateGroup}>
                    <h2 className={styles.dateTitle}>
                        📅 {new Date(dateKey + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        <span className={styles.dateBadge}>{grouped[dateKey].length} turno{grouped[dateKey].length !== 1 ? "s" : ""}</span>
                    </h2>

                    {grouped[dateKey].map(appt => (
                        <div key={appt.id} className={`${styles.card} ${appt.status === "cancelled" ? styles.cardCancelled : ""}`}>
                            {/* Header de la card */}
                            <div className={styles.cardHeader} onClick={() => setExpandedId(expandedId === appt.id ? null : appt.id)}>
                                <div className={styles.cardLeft}>
                                    <span className={styles.cardTime}>🕐 {appt.time}</span>
                                    <span className={styles.cardName}>{appt.user?.name || "Sin nombre"}</span>
                                    <span className={styles.cardRepair}>{appt.repairType || "Sin especificar"}</span>
                                </div>
                                <div className={styles.cardRight}>
                                    <span className={`${styles.badge} ${appt.status === "active" ? styles.badgeActive : styles.badgeCancelled}`}>
                                        {STATUS_LABELS[appt.status]}
                                    </span>
                                    <span className={styles.expandIcon}>{expandedId === appt.id ? "▲" : "▼"}</span>
                                </div>
                            </div>

                            {/* Detalle expandible */}
                            {expandedId === appt.id && (
                                <div className={styles.cardBody}>
                                    {editingId === appt.id ? (
                                        /* FORMULARIO DE EDICIÓN */
                                        <div className={styles.editForm}>
                                            <h4>Editar turno</h4>
                                            <div className={styles.editGrid}>
                                                <div className={styles.editGroup}>
                                                    <label>Fecha</label>
                                                    <input type="date" value={editForm.date}
                                                        onChange={e => setEditForm({...editForm, date: e.target.value})} />
                                                </div>
                                                <div className={styles.editGroup}>
                                                    <label>Hora</label>
                                                    <input type="time" value={editForm.time}
                                                        onChange={e => setEditForm({...editForm, time: e.target.value})} />
                                                </div>
                                                <div className={styles.editGroup}>
                                                    <label>Tipo reparación</label>
                                                    <input type="text" value={editForm.repairType}
                                                        onChange={e => setEditForm({...editForm, repairType: e.target.value})} />
                                                </div>
                                                <div className={styles.editGroup}>
                                                    <label>Duración estimada (min)</label>
                                                    <input type="number" value={editForm.estimatedDuration}
                                                        onChange={e => setEditForm({...editForm, estimatedDuration: Number(e.target.value)})} />
                                                </div>
                                            </div>
                                            <div className={styles.editGroup}>
                                                <label>Notas internas (solo vos las ves)</label>
                                                <textarea rows={2} maxLength={200} value={editForm.adminNotes}
                                                    onChange={e => setEditForm({...editForm, adminNotes: e.target.value})} />
                                            </div>
                                            <div className={styles.editGroup}>
                                                <label>Mensaje al cliente</label>
                                                <textarea rows={2} maxLength={300} value={editForm.adminMessage}
                                                    onChange={e => setEditForm({...editForm, adminMessage: e.target.value})} />
                                            </div>
                                            <div className={styles.editActions}>
                                                <button onClick={() => setEditingId(null)} className={styles.btnSecondary}>Cancelar</button>
                                                <button onClick={() => handleEditSave(appt.id)} className={styles.btnPrimary}>Guardar cambios</button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* DETALLE DEL TURNO */
                                        <div className={styles.detail}>
                                            <div className={styles.detailCols}>
                                                <div>
                                                    <h4>🙋 Cliente</h4>
                                                    <p><strong>Nombre:</strong> {appt.user?.name}</p>
                                                    <p><strong>Email:</strong> {appt.user?.email}</p>
                                                    <p><strong>DNI:</strong> {appt.user?.nDni}</p>
                                                </div>
                                                <div>
                                                    <h4>🚗 Vehículo</h4>
                                                    <p><strong>Marca/Modelo:</strong> {appt.vehicleBrand} {appt.vehicleModel}</p>
                                                    <p><strong>Patente:</strong> {appt.vehiclePlate}</p>
                                                    <p><strong>Año:</strong> {appt.vehicleYear || "—"}</p>
                                                </div>
                                            </div>
                                            <div className={styles.detailCols}>
                                                <div>
                                                    <h4>🔧 Reparación</h4>
                                                    <p><strong>Tipo:</strong> {appt.repairType || "—"}</p>
                                                    <p><strong>Falla descripta:</strong> {appt.descripcionFalla || "—"}</p>
                                                    <p><strong>Duración est.:</strong> {appt.estimatedDuration ? `${appt.estimatedDuration} min` : "—"}</p>
                                                </div>
                                                <div>
                                                    <h4>📝 Notas</h4>
                                                    <p><strong>Comentarios cliente:</strong> {appt.comentarios || "—"}</p>
                                                    <p><strong>Notas internas:</strong> {appt.adminNotes || "—"}</p>
                                                    <p><strong>Mensaje al cliente:</strong> {appt.adminMessage || "—"}</p>
                                                </div>
                                            </div>

                                            <div className={styles.cardActions}>
                                                <button onClick={() => startEdit(appt)} className={styles.btnEdit}>✏️ Editar</button>
                                                {appt.status === "active" && (
                                                    <button onClick={() => handleCancel(appt.id)} className={styles.btnCancel}>🚫 Cancelar turno</button>
                                                )}
                                                <button onClick={() => handleDelete(appt.id)} className={styles.btnDelete}>🗑️ Eliminar</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}

            {/* Modal crear turno */}
            {showCreateModal && (
                <CreateAppointment
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => { toast.success("Turno creado."); fetchAll(); setShowCreateModal(false); }}
                />
            )}
        </div>
    );
};

export default Admin;
