// Utility to get users
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Utility to save users
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// ✅ Signup Logic
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  let users = getUsers();

  // prevent duplicate email signup
  if (users.some(u => u.email === email)) {
    alert("User with this email already exists. Please login.");
    return;
  }

  const newUser = { name, email, password, role };
  users.push(newUser);
  saveUsers(users);

  alert("Signup successful! Please login.");
  document.getElementById("signupForm").reset();
});

// ✅ Login Logic
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  let users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  // Save session
  localStorage.setItem("loggedInUser", JSON.stringify(user));

  // Redirect based on role
  if (user.role === "alumni") {
    window.location.href = "alumni-dashboard.html";
  } else if (user.role === "student") {
    window.location.href = "student-dashboard.html";
  } else if (user.role === "admin") {
    window.location.href = "admin-dashboard.html";
  }
});
