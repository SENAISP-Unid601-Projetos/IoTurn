export const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        return 'N/A';
    }
    return date.toLocaleString('pt-BR');
};