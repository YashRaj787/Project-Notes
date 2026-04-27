let token = "";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  token = data.token;

  alert("Logged in");
  getNotes();
}

async function createNote() {
  const content = document.getElementById("note").value;

  await fetch("http://localhost:3000/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ content })
  });

  getNotes();
}

async function getNotes() {
  const res = await fetch("http://localhost:3000/api/notes", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  const list = document.getElementById("notes");
  list.innerHTML = "";

  data.forEach(note => {
  const li = document.createElement("li");

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

async function deleteNote(id) {
  await fetch(`http://localhost:3000/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  getNotes();
}
async function updateNote(id, content) {
  await fetch(`http://localhost:3000/api/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ content })
  });

  getNotes();
}