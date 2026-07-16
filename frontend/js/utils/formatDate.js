export function formatDateTime(date) {
    const isoDate = "2026-07-15T17:40:22.322Z";
    const dateObj = new Date(isoDate);

    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
    }).format(dateObj);

    // Replace the comma separator with a hyphen
    const finalResult = formattedDate.replace(',', ' -');

    return finalResult
}