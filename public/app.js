// app.js

let currentUser = null;
const API = "/api";

// Show/hide forms
function showLogin() {
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("register-form").classList.add("hidden");
  document.getElementById("admin-login").classList.add("hidden");
}

function showRegister() {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("register-form").classList.remove("hidden");
  document.getElementById("admin-login").classList.add("hidden");
}

function showAdminLogin() {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("register-form").classList.add("hidden");
  document.getElementById("admin-login").classList.remove("hidden");
}

// Register
async function registerUser() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const email = document.getElementById("reg-email").value;
  const voterId = document.getElementById("voterId").value;

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email, voterId })
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text);

    alert("Registered successfully!");
    showLogin();
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Login
async function loginUser() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const voterId = document.getElementById("voterId").value;
  

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, voterId})
    });

    if (!res.ok) throw new Error("Invalid credentials");

    currentUser = await res.json();
    document.getElementById("auth").classList.add("hidden");

  } catch (err) {
    alert("Login failed: " + err.message);
  }
}

// Cast vote
async function castVote(party) {
  if (currentUser.voted) {
    alert("You already voted!");
    return;
  }

  try {
    const res = await fetch(`${API}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: currentUser.username, party })
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text);

    alert("Vote cast successfully for " + party);
    document.getElementById("voting-panel").classList.add("hidden");
    currentUser.voted = true;
    currentUser.vote = party;
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Admin login
async function adminLogin() {
  const username = document.getElementById("admin-username").value;
  const password = document.getElementById("admin-password").value;

  if (username === "admin" && password === "admin123") {
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    loadAdminData();
  } else {
    alert("Invalid admin credentials");
  }
}

// Load admin panel
async function loadAdminData() {
  try {
    const res = await fetch(`${API}/admin/users`);
    const users = await res.json();
    const tbody = document.querySelector("#user-table tbody");
    tbody.innerHTML = "";

    users.forEach(user => {
      const row = document.createElement("tr");
      const partySymbolPath = `/images/${user.vote.toLowerCase()}.png`;

row.innerHTML = `
  <td>${user.username}</td>
  <td>${user.email}</td>
  <td>
    <img src="${partySymbolPath}" alt="${user.vote}" style="width:40px; height:30px; vertical-align:middle; margin-right:6px;" />
    ${user.vote}
  </td>
`;

      tbody.appendChild(row);
    });
  } catch (err) {
    alert("Failed to load users");
  }
}
function logout() {
  currentUser = null;

  // Animate hiding admin panel
  const adminPanel = document.getElementById("admin-panel");
  const authPanel = document.getElementById("auth");

  adminPanel.classList.remove("panel");
  adminPanel.classList.add("hidden");

  setTimeout(() => {
    authPanel.classList.remove("hidden");
    authPanel.classList.add("panel");
  }, 100); // slight delay for fade-in
}

document.getElementById("admin-logout-btn").addEventListener("click", logout);



