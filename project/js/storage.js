export function saveToLocalStorage(report) {
    const reports = getFromLocalStorage();
    reports.push(report);
    localStorage.setItem('labReports', JSON.stringify(reports));
}

export function getFromLocalStorage() {
    const reports = localStorage.getItem('labReports');
    return reports ? JSON.parse(reports) : [];
}

export function removeFromLocalStorage(id) {
    const reports = getFromLocalStorage();
    const updatedReports = reports.filter(report => report.id !== id);
    localStorage.setItem('labReports', JSON.stringify(updatedReports));
}

export function getSavedReport(id) {
    const reports = getFromLocalStorage();
    return reports.find(report => report.id === id);
}