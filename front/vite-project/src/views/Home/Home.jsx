import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Home.module.css";
import useUserContext from "../../hooks/useUserContext";
import Modal from "../../components/Modal/Modal";
import Login from "../Login/Login";
import Register from "../Register/Register";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const adjustDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

function Home() {
    const { user, isAdmin } = useUserContext();
    const navigate = useNavigate();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [allAppointments, setAllAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const fetchAppointments = useCallback(async () => {
        if (!user || isAdmin) return;
        try {
            const res = await fetch(`${API}/appointments/user/${user.id}`);
            if (res.ok) setAllAppointments(await res.json());
        } catch (_) {}
    }, [user, isAdmin]);

    useEffect(() => {
        fetchAppointments();
        const interval = setInterval(fetchAppointments, 5000);
        return () => clearInterval(interval);
    }, [fetchAppointments]);

    const now = new Date();
    const upcoming = allAppointments
        .filter(a => adjustDate(a.date) >= now && a.status === "active")
        .sort((a, b) => adjustDate(a.date) - adjustDate(b.date));
    const nextAppt = upcoming[0] || null;

    const miniHistory = [...allAppointments]
        .sort((a, b) => adjustDate(b.date) - adjustDate(a.date))
        .slice(0, 4);

    const dailyAppts = allAppointments.filter(a => {
        const d = adjustDate(a.date);
        return d.getFullYear() === selectedDate.getFullYear() &&
               d.getMonth() === selectedDate.getMonth() &&
               d.getDate() === selectedDate.getDate();
    });

    const fmtDate = (d) => adjustDate(d).toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });

    // ── Hero (sin usuario) ──
    if (!user) return (
        <div className={styles.hero}>
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
                <span className={styles.heroLabel}>Taller Mecánico</span>
                <h1 className={styles.heroTitle}>
                    Tu auto en manos <span>expertas</span>
                </h1>
                <p className={styles.heroSubtitle}>
                    Sacá tu turno online en segundos. Sin esperas, sin llamadas.
                </p>
                <div className={styles.heroButtons}>
                    <button className={styles.btnPrimary} onClick={() => setIsLoginOpen(true)}>Iniciar sesión</button>
                    <button className={styles.btnOutline} onClick={() => setIsRegisterOpen(true)}>Crear cuenta</button>
                </div>
            </div>

            <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
                <Login onClose={() => setIsLoginOpen(false)} />
            </Modal>
            <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
                <Register onClose={() => setIsRegisterOpen(false)} />
            </Modal>
        </div>
    );

    // ── Dashboard (admin) ──
    if (isAdmin) return (
        <div className={styles.dashboard}>
            <div className={styles.dashContainer}>
                <div className={styles.dashHeader}>
                    <h1 className={styles.dashGreeting}>
                        Hola, <span>{user.name.split(" ")[0]}</span> 👋
                    </h1>
                    <p className={styles.dashSubtitle}>Panel de administración del taller</p>
                </div>
                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                    <p style={{ color: "var(--gray-500)", marginBottom: "1rem" }}>
                        Accedé al panel para gestionar todos los turnos.
                    </p>
                    <button className={styles.btnPrimary} onClick={() => navigate("/admin")}>
                        ⚙️ Ir al Panel Admin
                    </button>
                </div>
            </div>
        </div>
    );

    // ── Dashboard (usuario normal) ──
    return (
        <div className={styles.dashboard}>
            <div className={styles.dashContainer}>
                <div className={styles.dashHeader}>
                    <h1 className={styles.dashGreeting}>
                        Hola, <span>{user.name.split(" ")[0]}</span> 👋
                    </h1>
                    <p className={styles.dashSubtitle}>Bienvenido al taller. Aquí podés ver tus turnos.</p>
                </div>

                <div className={styles.dashLayout}>
                    {/* Próximo turno */}
                    <div className={styles.widget}>
                        <div className={styles.widgetHeader}>
                            <span className={styles.widgetTitle}>📌 Próximo turno</span>
                        </div>
                        <div className={styles.widgetBody}>
                            {nextAppt ? (
                                <div className={styles.nextCard}>
                                    <p className={styles.nextDate}>{fmtDate(nextAppt.date)}</p>
                                    <p className={styles.nextTime}>🕐 {nextAppt.time}</p>
                                    {nextAppt.repairType && <p className={styles.nextRepair}>🔧 {nextAppt.repairType}</p>}
                                    {nextAppt.vehicleBrand && <p className={styles.nextRepair}>🚗 {nextAppt.vehicleBrand} {nextAppt.vehicleModel}</p>}
                                </div>
                            ) : (
                                <p className={styles.noNext}>No tenés turnos programados.</p>
                            )}
                        </div>
                    </div>

                    {/* Historial */}
                    <div className={styles.widget}>
                        <div className={styles.widgetHeader}>
                            <span className={styles.widgetTitle}>🗂 Historial reciente</span>
                        </div>
                        <div className={styles.widgetBody}>
                            {miniHistory.length > 0 ? (
                                <ul className={styles.historyList}>
                                    {miniHistory.map(a => (
                                        <li key={a.id} className={styles.historyItem}>
                                            <span className={styles.historyDate}>{fmtDate(a.date)}</span>
                                            <span className={styles.historyTime}>{a.time}</span>
                                            <span className={`${styles.badge} ${a.status === "active" ? styles.badgeActive : styles.badgeCancelled}`}>
                                                {a.status === "active" ? "Activo" : "Cancelado"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={styles.noNext}>No hay turnos en tu historial.</p>
                            )}
                        </div>
                    </div>

                    {/* Calendario */}
                    <div className={styles.widget}>
                        <div className={styles.widgetHeader}>
                            <span className={styles.widgetTitle}>📅 Calendario</span>
                        </div>
                        <div className={styles.widgetBody}>
                            <div className={styles.calendarWrapper}>
                                <Calendar
                                    onChange={setSelectedDate}
                                    value={selectedDate}
                                    tileContent={({ date, view }) => {
                                        if (view !== "month") return null;
                                        const has = allAppointments.some(a => {
                                            const d = adjustDate(a.date);
                                            return d.getFullYear() === date.getFullYear() &&
                                                   d.getMonth() === date.getMonth() &&
                                                   d.getDate() === date.getDate();
                                        });
                                        return has ? <div className={styles.turnoIndicator} /> : null;
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Turnos del día */}
                    <div className={styles.widget}>
                        <div className={styles.widgetHeader}>
                            <span className={styles.widgetTitle}>
                                🗓 {selectedDate.toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
                            </span>
                        </div>
                        <div className={styles.widgetBody}>
                            {dailyAppts.length > 0 ? (
                                <ul className={styles.dayList}>
                                    {dailyAppts.map(a => (
                                        <li key={a.id} className={styles.dayItem}>
                                            <span>{a.time}</span>
                                            <span>{a.repairType || "Turno"}</span>
                                            <span className={`${styles.badge} ${a.status === "active" ? styles.badgeActive : styles.badgeCancelled}`}>
                                                {a.status === "active" ? "Activo" : "Cancelado"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={styles.noDay}>Sin turnos para este día.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
