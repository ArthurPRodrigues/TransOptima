export function getStatusByDates(dataVencimento, daysAVencer) {
const today = new Date();
const venc = new Date(dataVencimento);
const diffMs = venc - today;
const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));


if (diffDays < 0) return 'EXPIRADO';
if (diffDays <= (Number(daysAVencer) || 15)) return 'A_VENCER';
return 'VALIDO';
}