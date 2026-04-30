import React from "react";
import styles from "./AppointmentCard.module.css";

const AppointmentCard = ({ id, date, time, status, repairType, vehicleBrand, vehicleModel, vehiclePlate, descripcionFalla, adminMessage, estimatedDuration, comentarios, onCancel, onDismiss }) => {
    const formattedDate = date
        ? new Date(date).toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        : "Fecha no disponible";

    return (
        <li className={`${styles.card} ${status === "cancelled" ? styles.cancelled : styles.active}`}>
            <div className={styles.header}>
                <span className={styles.time}>🕐 {time}</span>
                <span className={`${styles.badge} ${status === "active" ? styles.badgeActive : styles.badgeCancelled}`}>
                    {status === "active" ? "Activo" : "Cancelado"}
                </span>
            </div>

            <p className={styles.date}>📅 {formattedDate}</p>

            <div className={styles.infoRow}>
                {(vehicleBrand || vehicleModel) && (
                    <span className={styles.info}>🚗 {vehicleBrand} {vehicleModel}{vehiclePlate ? ` — ${vehiclePlate}` : ""}</span>
                )}
                {repairType && <span className={styles.info}>🔧 {repairType}</span>}
                {estimatedDuration > 0 && <span className={styles.info}>⏱ {estimatedDuration} min estimados</span>}
            </div>

            {descripcionFalla && <p className={styles.falla}>💬 {descripcionFalla}</p>}
            {comentarios && <p className={styles.info}>📋 {comentarios}</p>}

            {adminMessage && (
                <div className={styles.adminMsg}>
                    <span className={styles.adminMsgLabel}>📩 Mensaje del taller</span>
                    <p className={styles.adminMsgText}>{adminMessage}</p>
                </div>
            )}

            <div className={styles.actions}>
                {status === "active" && (
                    <button onClick={() => onCancel(id)} className={styles.cancelBtn}>Cancelar turno</button>
                )}
                {status === "cancelled" && (
                    <button onClick={() => onDismiss(id)} className={styles.dismissBtn}>Eliminar</button>
                )}
            </div>
        </li>
    );
};

export default AppointmentCard;
