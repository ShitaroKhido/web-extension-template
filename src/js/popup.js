// Popup script
document.getElementById('action-btn').addEventListener('click', () => {
    const output = document.getElementById('output');
    output.textContent = 'Button clicked! Extension is working.';
    setTimeout(() => {
        output.textContent = '';
    }, 3000);
});