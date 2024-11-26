// Setting up socket, and then grabbing references for all relevant screen elements
const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const roomName = document.getElementById('roomName');
const usernameElement = document.getElementById('usernameElement');
const backButton = document.getElementById('backButton');
const colorPicker = document.getElementById('colorPicker');
const fileUploadElement = document.getElementById('fileUploadSection');

let username = "N.A";
let currentRoom = "Home";
let instructions = `
ls	   - List all online rooms
join x 	   - Join room with name 'x', will create a room if there isn't one with that name
username x - set username to 'x'
exit 	   - Leave current room
clear 	   - Clear all text`;

// Function to change the terminal's color
function changeTerminalColor(color) {
    document.body.style.color = color;
    document.querySelector('.header').style.borderColor = color;
    document.querySelector('.input').style.borderColor = color;
    document.querySelector('#backButton').style.borderColor = color;
    document.querySelector('#backButton').style.color = color;
    document.querySelector('button').style.borderColor = color;
    document.querySelector('button').style.color = color;
    document.querySelector('.inputContainer').style.borderTopColor = color;
    document.querySelector('.terminalArrow').style.color = color;
    document.querySelector('#roomName').style.color = color;
    document.querySelector('#usernameElement').style.color = color;         
    document.querySelector('.fileInput').style.color = color;
    console.log("Color changed to: " + color);
}

// DOCUMENT EVENT HANDLERS --------------------------------------------

// File selection & upload event handler
document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
        // Show the selected file in the UI (optional)
        const fileList = document.getElementById('fileList');
        const fileItem = document.createElement('li');
        fileItem.textContent = `Uploading: ${file.name} (${file.size} bytes)`;
        fileList.appendChild(fileItem);

        // Read the file as base64
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileData = event.target.result; // This is the file data in base64 format
            socket.emit('send file', { fileName: file.name, fileData }); // Send the file data to the server
        };
        reader.readAsDataURL(file); // Read the file as base64 (this could be done in chunks for larger files)
    }
});

// Colour picker event handler
colorPicker.addEventListener('input', (e) => {
    const selectedColor = e.target.value;  // Get the selected color
    console.log("New terminal color: " + selectedColor);
    changeTerminalColor(selectedColor);  // Apply the color change
});

// Command line event handler
form.addEventListener('submit', (e) => {
    console.log("command sending");
    e.preventDefault();
    if (input.value) {
    
        // Returns a list of all running rooms from the server
        if (input.value == "ls") {
            console.log("listing rooms");
            socket.emit('list rooms');
        }
        
        // Help, displays list of all commands
        else if (input.value == "help") {
            const item = document.createElement('li');
            item.textContent = instructions;
            messages.appendChild(item);
        }
        
        // Create or join a room (currently handled the same by server)
        else if (input.value.startsWith("join ")) {
            console.log("mkdir or cd command called");
            if (currentRoom !== "Home") {
                socket.emit('leave room'); // Leave the current room
            }
            let roomName = input.value.split(" ")[1]; // Get room name after "mkdir"
            roomName.textContent = "Current Room: " + roomName;
            console.log(`Creating room: ${roomName}`);
            socket.emit('join room', roomName)
            console.log("mkdir or cd command ending");
            messages.innerHTML = '';
            fileUploadElement.classList.remove("hidden");
        } 
        
        // Leave current room
        else if (input.value === "exit") {
            console.log("Exiting the room...");
            socket.emit('leave room');
            const item = document.createElement('li');
            item.textContent = `You are leaving the room`;
            messages.appendChild(item);
            fileUploadElement.classList.add("hidden");
        }
        
        // Change Username
        else if (input.value.startsWith("username ")) {
            console.log("Changing Username");
            let userinput = input.value.split(" ")[1];
            username = userinput;
            if (username) {
                usernameElement.textContent = "Username: " + username;
                console.log("New username: "+usernameElement.textcontent);
            }
        }
        
        // clear Terminal
        else if (input.value == "clear") {
            console.log("Clearing the terminal");
            messages.innerHTML = '';
        }
        
        // else, send command as a chat message
        else {
            const message = `${currentRoom}/${username}: ${input.value}`;
            socket.emit('chat message', message);
        }
    }
    input.value = '';
});

// Back button event handler
backButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("back button pressed");
    if (currentRoom !== "Home") {
        console.log("First condition passed");
        socket.emit('leave room'); // Notify the server
        currentRoom = "Home";
        roomName.textContent = "Current Room: " + currentRoom;
        
        messages.innerHTML = '';
        const item = document.createElement('li');
        item.textContent = `You are leaving the room`;
        messages.appendChild(item);
    }
});

// SOCKET EVENT HANDLERS --------------------------------------------

// Appends a new chat message to screen; from another user or the server
socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

// Display history of messages sent, in a room the user has just joined
socket.on('chat history', (history) => {
    messages.innerHTML = '';
    history.forEach(msg => {
        const item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
    });
    messages.scrollTop = messages.scrollHeight;
});

// Handle receiving a file from the server
socket.on('receive file', (file) => {
    // Display the file as a download link
    const fileList = document.getElementById('fileList');
    const fileItem = document.createElement('li');

    // Create a link to download the file
    const downloadLink = document.createElement('a');
    downloadLink.href = file.fileData; // Base64 data URL
    downloadLink.download = file.fileName; // Set the download file name
    downloadLink.textContent = `Download ${file.fileName}`;

    // Append the link to the file item and then to the list
    fileItem.appendChild(downloadLink);
    fileList.appendChild(fileItem);
});