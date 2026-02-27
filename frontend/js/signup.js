const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const branch = document.getElementById("branch").value.trim();
  const college = document.getElementById("college").value.trim();
  const password = document.getElementById("password").value;
  const roleInput = document.querySelector('input[name="role"]:checked');
  const role = roleInput ? roleInput.value : null;

  let isValid = true;
  clearErrors(signupForm);

  // Validation
  if (!name) { showError(document.getElementById("name"), "Full name is required."); isValid = false; }
  if (!email.match(/^[^ ]+@[^ ]+\.[a-z]{2,}$/)) { showError(document.getElementById("email"), "Please enter a valid email."); isValid = false; }
  if (!branch) { showError(document.getElementById("branch"), "Branch is required."); isValid = false; }
  if (!college) { showError(document.getElementById("college"), "University/College is required."); isValid = false; }
  if (password.length < 6) { showError(document.getElementById("password"), "Password must be at least 6 characters."); isValid = false; }

  if (isValid) {
    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          college,
          branch // mapped to department in backend if needed, or add branch to backend
        })
      });

      const data = await response.json();

      if (data.success) {
        showSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        showError(document.getElementById("email"), data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      showError(document.getElementById("name"), "Failed to connect to server.");
    }
  }
});

function showError(input, message) {
  const error = document.createElement("small");
  error.className = "error-message";
  error.innerText = message;
  input.parentElement.insertBefore(error, input.nextSibling);
  input.style.borderColor = "red";
}
function clearErrors(form) {
  form.querySelectorAll(".error-message").forEach(e => e.remove());
  form.querySelectorAll("input, select").forEach(input => input.style.borderColor = "#ccc");
}

function showSuccess(message) {
  const success = document.createElement("div");
  success.className = "success-message";
  success.innerText = message;
  signupForm.prepend(success);
  setTimeout(() => success.remove(), 1500);
}
