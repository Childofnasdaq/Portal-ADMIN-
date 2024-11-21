// Authentication logic (Handling Mentor ID, Email, and License Key)
document.getElementById('auth-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const mentorId = document.getElementById('mentor-id').value;
    const email = document.getElementById('email').value;
    const licenseKey = document.getElementById('license-key').value;

    const response = await fetch('https://your-backend-api-url/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mentorId, email, licenseKey })
    });

    const result = await response.json();

    if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = 'home.html';
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
});
