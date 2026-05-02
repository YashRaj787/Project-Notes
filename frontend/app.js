const API = "http://13.235.128.156";

// 🔐 STORE SESSION
let token = localStorage.getItem("token") || "";
let user = JSON.parse(localStorage.getItem("user")) || null;


// ================= SIGNUP =================
async function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const res = await fetch(`${API}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
  } else {
    alert("Signup successful");
  }
}


// ================= LOGIN =================
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  token = data.token;
  user = data.user;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  updateUI();
  getNotes();
}


// ================= CREATE NOTE =================
async function createNote() {
  const content = document.getElementById("noteInput").value;

  await fetch(`${API}/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ content })
  });

  document.getElementById("noteInput").value = "";
  getNotes();
}


// ================= GET NOTES =================
async function getNotes(search = "") {
  if (!token) return;

  const res = await fetch(`${API}/api/notes?search=${search}`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  const list = document.getElementById("notes");
  list.innerHTML = "";

  data.forEach(note => {
const li = document.createElement("div");
li.className = "note-card";
    const input = document.createElement("input");
    input.value = note.content;

    const updateBtn = document.createElement("button");
    updateBtn.innerText = "Update";
    updateBtn.onclick = () => updateNote(note.id, input.value);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = () => deleteNote(note.id);

    li.appendChild(input);
    li.appendChild(updateBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}


// ================= DELETE =================
async function deleteNote(id) {
  await fetch(`${API}/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  getNotes();
}


// ================= UPDATE =================
async function updateNote(id, content) {
  await fetch(`${API}/api/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ content })
  });

  getNotes();
}


// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.reload();
}


// ================= UI CONTROL =================
function updateUI() {
  const loginSection = document.getElementById("loginSection");
  const signupSection = document.getElementById("signupSection");
  const userInfo = document.getElementById("userInfo");

  if (token && user) {
    loginSection.style.display = "none";
    signupSection.style.display = "none";
    userInfo.innerText = "Logged in as: " + user.email;
  } else {
    loginSection.style.display = "block";
    signupSection.style.display = "block";
    userInfo.innerText = "";
  }
}


// ================= AUTO LOAD =================
updateUI();

if (token) {
  getNotes();
}


// ================= SEARCH =================
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value;
  getNotes(value);
});