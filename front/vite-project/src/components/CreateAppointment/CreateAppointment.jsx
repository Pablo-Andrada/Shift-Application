import React, { useState, useEffect } from "react";
import styles from "./CreateAppointment.module.css";
import useUserContext from "../../hooks/useUserContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const REPAIR_TYPES = [
    "Cambio de aceite y filtros",
    "Frenos (pastillas / discos)",
    "Sistema de suspensión",
    "Motor - diagnóstico",
    "Motor - reparación",
    "Transmisión / caja",
    "Sistema eléctrico",
    "Aire acondicionado",
    "Neumáticos / alineación",
    "Revisión general (service)",
    "Otro"
];

const CreateAppointment = ({ onClose, onSuccess }) => {
    const { user } = useUserContext();

    const [step, setStep] = useState(1); // 1: vehículo+falla, 2: fecha+hora
    const [date, setDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [formData, setFormData] = useState({
        vehicleBrand: "",
        vehicleModel: "",
        vehiclePlate: "",
        vehicleYear: "",
        repairType: "",
        descripcionFalla: "",
        comentarios: ""
    });

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Calcular fecha mínima (hoy) y máxima (3 meses adelante)
    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    // Traer slots disponibles al cambiar la fecha
    useEffect(() => {
        if (!date) { setAvailableSlots([]); setSelectedSlot(""); return; }
        setLoadingSlots(true);
        setSelectedSlot("");
        fetch(`${API}/appointments/slots?date=${date}`)
            .then(r => r.json())
            .then(data => setAvailableSlots(data.slots || []))
            .catch(() => setAvailableSlots([]))
            .finally(() => setLoadingSlots(false));
    }, [date]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleStep1 = (e) => {
        e.preventDefault();
        if (!formData.vehicleBrand || !formData.vehicleModel || !formData.vehiclePlate || !formData.repairType) {
            setError("Por favor completá los campos obligatorios (*).");
            return;
        }
        setError(null);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot) { setError("Seleccioná un horario."); return; }
        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                date: new Date(date + "T" + selectedSlot).toISOString(),
                time: selectedSlot,
                userId: user.id,
                ...formData
            };

            const response = await fetch(`${API}/appointments/schedule`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("No se pudo crear el turno.");
            const data = await response.json();
            onSuccess && onSuccess(data);
            onClose && onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Nuevo Turno</h3>
                    <div className={styles.stepIndicator}>
                        <span className={step === 1 ? styles.activeStep : styles.doneStep}>1. Tu vehículo</span>
                        <span className={styles.stepSep}>›</span>
                        <span className={step === 2 ? styles.activeStep : styles.inactiveStep}>2. Fecha y hora</span>
                    </div>
                </div>

                {/* PASO 1: Datos del vehículo y falla */}
                {step === 1 && (
                    <form onSubmit={handleStep1} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Marca *</label>
                                <input type="text" name="vehicleBrand" value={formData.vehicleBrand}
                                    onChange={handleChange} placeholder="Ej: Toyota" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Modelo *</label>
                                <input type="text" name="vehicleModel" value={formData.vehicleModel}
                                    onChange={handleChange} placeholder="Ej: Corolla" required />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Patente *</label>
                                <input type="text" name="vehiclePlate" value={formData.vehiclePlate}
                                    onChange={handleChange} placeholder="Ej: AB 123 CD" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Año</label>
                                <input type="number" name="vehicleYear" value={formData.vehicleYear}
                                    onChange={handleChange} placeholder="Ej: 2018" min="1950" max={new Date().getFullYear()} />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tipo de reparación *</label>
                            <select name="repairType" value={formData.repairType} onChange={handleChange} required>
                                <option value="">Seleccioná una opción...</option>
                                {REPAIR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Descripción de la falla</label>
                            <textarea name="descripcionFalla" value={formData.descripcionFalla}
                                onChange={handleChange} rows={3} maxLength={200}
                                placeholder="Contale al técnico qué síntomas notaste (opcional, máx. 200 caracteres)" />
                            <small>{formData.descripcionFalla.length}/200</small>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Comentarios adicionales</label>
                            <input type="text" name="comentarios" value={formData.comentarios}
                                onChange={handleChange} maxLength={50} placeholder="Opcional (máx. 50 caracteres)" />
                        </div>

                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.buttonContainer}>
                            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                            <button type="submit" className={styles.saveButton}>Siguiente →</button>
                        </div>
                    </form>
                )}

                {/* PASO 2: Fecha y hora */}
                {step === 2 && (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Fecha *</label>
                            <input type="date" value={date} min={today} max={maxDateStr}
                                onChange={e => setDate(e.target.value)} required />
                        </div>

                        {date && (
                            <div className={styles.formGroup}>
                                <label>Horario disponible *</label>
                                {loadingSlots && <p className={styles.loading}>Consultando disponibilidad...</p>}
                                {!loadingSlots && availableSlots.length === 0 && (
                                    <p className={styles.noSlots}>No hay horarios disponibles para este día. Probá con otra fecha.</p>
                                )}
                                {!loadingSlots && availableSlots.length > 0 && (
                                    <div className={styles.slotsGrid}>
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot}
                                                type="button"
                                                className={`${styles.slotBtn} ${selectedSlot === slot ? styles.slotSelected : ""}`}
                                                onClick={() => setSelectedSlot(slot)}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Resumen */}
                        <div className={styles.summary}>
                            <p><strong>Vehículo:</strong> {formData.vehicleBrand} {formData.vehicleModel} — {formData.vehiclePlate}</p>
                            <p><strong>Reparación:</strong> {formData.repairType}</p>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}
                        <div className={styles.buttonContainer}>
                            <button type="button" onClick={() => setStep(1)} className={styles.cancelButton}>← Atrás</button>
                            <button type="submit" disabled={submitting || !selectedSlot} className={styles.saveButton}>
                                {submitting ? "Guardando..." : "Confirmar turno"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateAppointment;
