<!-- AI-generated frontend example -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Form Example</title>
    <style>
        /* Styling for the form */
        body { font-family: Arial, sans-serif; margin: 20px; }
        form { max-width: 400px; padding: 20px; border: 1px solid #ccc; }
        input, button { display: block; width: 100%; margin-bottom: 10px; padding: 8px; }
        .error { color: red; }
    </style>
</head>
<body>

<h2>Contact Form</h2>
<form id="contactForm">
    <input type="text" id="name" placeholder="Name" required>
    <input type="email" id="email" placeholder="Email" required>
    <textarea id="message" placeholder="Your message" required></textarea>
    <button type="submit">Submit</button>
</form>

<div id="response"></div>

<script>
    // AI-generated JS: Form validation and submission
    const form = document.getElementById('contactForm');
    const responseDiv = document.getElementById('response');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get input values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate inputs
        if (!name || !email || !message) {
            responseDiv.innerHTML = '<p class="error">All fields are required.</p>';
            return;
        }

        if (!validateEmail(email)) {
            responseDiv.innerHTML = '<p class="error">Invalid email format.</p>';
            return;
        }

        // Simulate submission
        responseDiv.innerHTML = `<p>Thank you, ${name}. Your message has been submitted.</p>`;
        form.reset();
    });

    // Helper function to validate email format
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
</script>

</body>
</html>
