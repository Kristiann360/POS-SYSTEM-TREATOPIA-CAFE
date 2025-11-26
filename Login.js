// Login.js

// Login form submit
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      // Redirect to home page
      window.location.href = "home.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Could not connect to server");
  }
});

// Signup form submit (if you have a signup form)
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const response = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("User created successfully! Please login.");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Could not connect to server");
    }
  });
}
