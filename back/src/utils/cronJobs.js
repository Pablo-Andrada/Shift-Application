/**
 * back/src/utils/cronJobs.js
 * Archivo shim (placeholder) para evitar el error "Cannot find module '../src/utils/cronJobs'".
 * Aquí podés añadir cron jobs reales más adelante.
 */

try {
  // Exportamos una función por si el index lo requiere como función
  function initCronJobs() {
    // Por ahora no hay jobs activos para evitar efectos secundarios.
    // Si querés activar un job, agregá aquí node-cron.schedule(...)
    // Ejemplo comentado:
    // const cron = require('node-cron');
    // cron.schedule('0 0 * * *', () => { console.log('Job diario ejecutado'); });

    console.log('CronJobs placeholder loaded — no active jobs.');
  }

  module.exports = initCronJobs;
} catch (err) {
  // Si algo falla al cargar, lo logueamos para facilitar debugging
  console.error('Error loading cronJobs placeholder:', err);
  module.exports = () => {};
}
