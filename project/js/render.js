import { getFromLocalStorage } from './storage.js';

export function renderTests(tests) {
    const testsList = document.getElementById('testsList');
    testsList.innerHTML = '';
    
    tests.forEach(test => {
        const testDiv = document.createElement('div');
        testDiv.className = 'test-item';
        testDiv.innerHTML = `
            <input type="text" value="${test.name}" readonly>
            <input type="text" value="${test.value}">
            <input type="text" value="${test.unit}">
            <input type="text" value="${test.normal}">
        `;
        testsList.appendChild(testDiv);
    });
}

export function renderSavedReports() {
    const reports = getFromLocalStorage();
    const container = document.getElementById('savedReports');
    container.innerHTML = '';
    
    reports.forEach(report => {
        const reportDiv = document.createElement('div');
        reportDiv.className = 'saved-report';
        reportDiv.innerHTML = `
            <h3>Lab Number: ${report.labNumber}</h3>
            <p>Patient: ${report.patientName} (${report.patientAge} years, ${report.patientGender})</p>
            <p>Date: ${report.reportDate}</p>
            <p>Tests: ${report.tests.length}</p>
            <div class="button-group">
                <button onclick="printSavedReport(${report.id})" class="print-btn no-print">Print</button>
                <button onclick="deleteReport(${report.id})" class="delete-btn no-print">Delete</button>
            </div>
        `;
        container.appendChild(reportDiv);
    });
}

export function renderPrintTemplate(report) {
    const printTemplate = document.getElementById('printTemplate');
    printTemplate.innerHTML = `
        <div class="print-header">
            <h1>Laboratory Report</h1>
            <h2>Lab Number: ${report.labNumber}</h2>
        </div>
        
        <div class="print-patient-info">
            <p><strong>Patient Name:</strong> ${report.patientName}</p>
            <p><strong>Age:</strong> ${report.patientAge} years</p>
            <p><strong>Gender:</strong> ${report.patientGender}</p>
            <p><strong>Date:</strong> ${report.reportDate}</p>
        </div>

        <table class="print-tests">
            <thead>
                <tr>
                    <th>Test Name</th>
                    <th>Result</th>
                    <th>Unit</th>
                    <th>Normal Range</th>
                </tr>
            </thead>
            <tbody>
                ${report.tests.map(test => `
                    <tr>
                        <td>${test.name}</td>
                        <td>${test.value}</td>
                        <td>${test.unit}</td>
                        <td>${test.normal}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="print-footer">
            <p>Authorized Signature: _________________</p>
        </div>
    `;
}