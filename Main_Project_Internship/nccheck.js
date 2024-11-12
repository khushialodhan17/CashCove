document.getElementById('register-btn').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the link from navigating to a new page
    showRegisterForm();
    hideSidebar();  // Hide the sidebar when showing the register form
});

function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
}

function showRegisterForm() {
    // Check if the register form already exists, to avoid multiple forms being appended
    if (document.querySelector('.form-container')) return;

    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');
    
    // Append the registration form HTML
    formContainer.innerHTML = `
        <form action="" method="post">
            <h3>register now</h3>
            ${getErrorsHtml()}
            <input type="text" name="name" required placeholder="Enter your Name">
            <input type="email" name="email" required placeholder="Enter your Email">
            <input type="password" name="password" required placeholder="Enter your Password">
            <input type="password" name="cpassword" required placeholder="Confirm your Password">
            <select name="user_type">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <input type="submit" name="submit" value="register now" class="form-btn">
            <p>Already have an account? <a href="login_form.php">Login Now</a></p>
        </form>
    `;

    document.body.appendChild(formContainer);
}

function getErrorsHtml() {
    let errors = '';
    if (typeof error !== 'undefined') {
        error.forEach(err => {
            errors += `<span class="error-msg">${err}</span>`;
        });
    }
    return errors;
}
