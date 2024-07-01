const socket = io();

const username = document.getElementById("usernameInput");

function ShowRooms() {
  if (username.value.trim() === "") {
    alert("Please enter your name.");
    return;
  }

  localStorage.setItem("name",username.value)

  // Emit event to join a default room
  socket.emit("ShowRooms", username);
}

function showRoomForm() {
  document.getElementById("shadow").style.display = "block";
}

function createRoom() {
  if (username.value.trim() === "") {
    alert("Please enter your name.");
    return;
  }
  const roomName = document.getElementById("roomName").value.trim();
  if (roomName === "") {
    alert("Please enter a room name.");
    return;
  }

  // Emit event to create a room
  socket.emit("createRoom", roomName);
  window.open("waiting.html");
}

// Socket events to handle joining rooms, updating UI, etc.
socket.on("roomListUpdate", (rooms) => {
  const roomList = document.getElementById("roomList");
  roomList.innerHTML = ""; // Clear existing rooms

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${room.name}</h3>
      <button onclick="joinRoom('${room.name}')">Join</button>
    `;
    roomList.appendChild(li);
  });
});

socket.on("roomCreated", (roomName) => {
  alert(`Room '${roomName}' created successfully!`);
  document.getElementById("roomName").value = "";
  document.getElementById("shadow").style.display = "none";
});

function joinRoom(roomName) {
  const username = document.getElementById("usernameInput").value.trim();
  if (username === "") {
    alert("Please enter your name.");
    return;
  }

  // Emit event to join a specific room
  socket.emit("joinRoom", { roomName, username });
}
