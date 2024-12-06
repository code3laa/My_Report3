import { generateLabNumber } from './utils.js';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage, getSavedReport } from './storage.js';
import { renderTests, renderSavedReports, renderPrintTemplate } from './render.js';
import { testGroups } from './testGroups.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('labNumber').value = generateLabNumber();
    document.getElementById('reportDate').valueAsDate = new Date();
    renderSavedReports();
    
    // Initialize select2
    $('.select2').select2({
        width: '100%',
        placeholder: 'Select a test group'
    });
});

// Add new test to the form
window.addNewTest = () => {
    const group = document.getElementById('testGroup').value;
    const testsList = document.getElementById('testsList');
    const testDiv = document.createElement('div');
    testDiv.className = 'test-item';
    
    const tests = testGroups[group];
    const testId = Date.now();
    
    const select = document.createElement('select');
    select.className = 'test-name select2';
    tests.forEach(test => {
        const option = document.createElement('option');
        option.value = test.name;
        option.textContent = test.name;
        select.appendChild(option);
    });
    
    testDiv.innerHTML = `
        <input type="text" class="test-value" placeholder="Value">
        <input type="text" class="test-unit" placeholder="Unit" value="${tests[0].unit}">
        <input type="text" class="test-normal" placeholder="Normal Range" value="${tests[0].normal}">
        <button class="delete-btn" onclick="removeTest(${testId})">Delete</button>
    `;
    
    testDiv.dataset.testId = testId;
    testDiv.insertBefore(select, testDiv.firstChild);
    testsList.appendChild(testDiv);
    
    // Initialize select2 for the new select element
    $(select).select2({
        width: '250px',
        placeholder: 'Search for a test'
    }).on('select2:select', function(e) {
        const selectedTest = tests.find(t => t.name === e.params.data.id);
        if (selectedTest) {
            const testItem = $(this).closest('.test-item');
            testItem.find('.test-unit').val(selectedTest.unit);
            testItem.find('.test-normal').val(selectedTest.normal);
        }
    });
};

// Remove a test from the form
window.removeTest = (testId) => {
    const test = document.querySelector(`[data-test-id="${testId}"]`);
    // Destroy select2 instance before removing the element
    $(test).find('select').select2('destroy');
    test.remove();
};

// Save the current report
window.saveReport = () => {
    const report = {
        id: Date.now(),
        labNumber: document.getElementById('labNumber').value,
        patientName: document.getElementById('patientName').value,
        patientAge: document.getElementById('patientAge').value,
        patientGender: document.getElementById('patientGender').value,
        reportDate: document.getElementById('reportDate').value,
        tests: Array.from(document.getElementsByClassName('test-item')).map(test => ({
            name: test.querySelector('.test-name').value,
            value: test.querySelector('.test-value').value,
            unit: test.querySelector('.test-unit').value,
            normal: test.querySelector('.test-normal').value
        }))
    };

    saveToLocalStorage(report);
    renderSavedReports();
    document.getElementById('labNumber').value = generateLabNumber();
};

// Print the current report
window.printReport = () => {
    const report = {
        labNumber: document.getElementById('labNumber').value,
        patientName: document.getElementById('patientName').value,
        patientAge: document.getElementById('patientAge').value,
        patientGender: document.getElementById('patientGender').value,
        reportDate: document.getElementById('reportDate').value,
        tests: Array.from(document.getElementsByClassName('test-item')).map(test => ({
            name: test.querySelector('.test-name').value,
            value: test.querySelector('.test-value').value,
            unit: test.querySelector('.test-unit').value,
            normal: test.querySelector('.test-normal').value
        }))
    };
    
    renderPrintTemplate(report);
    window.print();
};

// Print a saved report
window.printSavedReport = (id) => {
    const report = getSavedReport(id);
    if (report) {
        renderPrintTemplate(report);
        window.print();
    }
};

// Delete a saved report
window.deleteReport = (id) => {
    removeFromLocalStorage(id);
    renderSavedReports();
};