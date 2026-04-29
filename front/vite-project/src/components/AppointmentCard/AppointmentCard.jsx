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

            {(vehicleBrand || vehicleModel) && (
                <p className={styles.info}>🚗 {vehicleBrand} {vehicleModel} {vehiclePlate ? `— ${vehiclePlate}` : ""}</p>
            )}

            {repairType && <p className={styles.info}>🔧 {repairType}</p>}

            {descripcionFalla && (
                <p className={styles.falla}>💬 <em>{descripcionFalla}</em></p>
            )}

            {estimatedDuration > 0 && (
                <p className={styles.info}>⏱ Duración estimada: {estimatedDuration} min</p>
            )}

            {/* Mensaje del admin al cliente */}
            {adminMessage && (
                <div className={styles.adminMsg}>
                    <span>📩 Mensaje del taller:</span>
                    <p>{adminMessage}</p>
                </div>
            )}

            {comentarios && <p className={styles.comentarios}>📋 {comentarios}</p>}

            <div className={styles.actions}>
                {status === "active" && (
                    <button onClick={() => onCancel(id)} className={styles.cancelBtn}>
                        Cancelar turno
                    </button>
                )}
                {status === "cancelled" && (
                    <button onClick={() => onDismiss(id)} className={styles.dismissBtn}>
                        Eliminar
                    </button>
                )}
            </div>
        </li>
    );
};

export default AppointmentCard;
