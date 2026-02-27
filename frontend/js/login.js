document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const roleSelect = document.getElementById("role");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const role = roleSelect.value;

  console.log("Login attempt:", { email, password, role });

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    alert("Please enter your email.");
    emailInput.focus();
    return;
  }

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    emailInput.focus();
    return;
  }

  if (!password) {
    alert("Please enter your password.");
    passwordInput.focus();
    return;
  }

  if (!role) {
    alert("Please select a role before logging in.");
    roleSelect.focus();
    return;
  }

  // Redirect based on role
  if (role === "student") {
    window.location.href = "student_dashboard/home.html";
  } else if (role === "alumni") {
    window.location.href = "alumnidashboard/alumni-dashboard.html";
  } else if (role === "admin") {
    window.location.href = "admin_dashboard/admin-dashboard.html";
  } else {
    alert("Invalid role selected.");
  }
});