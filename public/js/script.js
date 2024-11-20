document.querySelectorAll('[show-alert]').forEach((alert) => {
    const timeout = parseInt(alert.getAttribute('data-time'), 10) || 3000;

    // Initialize the timebar
    const timebar = alert.querySelector('.timebar');
    if (timebar) {
        timebar.style.transitionDuration = `${timeout}ms`;
        timebar.style.width = '0%'; // Countdown from 100% to 0%
    }

    // Automatically dismiss the alert
    setTimeout(() => {
        alert.classList.add('hide');
        setTimeout(() => alert.remove(), 500); // Remove after fade-out animation
    }, timeout);
});

// Close alert manually
document.querySelectorAll('.messages.info').forEach((alertBox) => {
    alertBox.addEventListener('click', function () {
        // const alert = this.parentElement;
        alertBox.classList.add('hide');
        setTimeout(() => alertBox.remove(), 500);
    });
});
