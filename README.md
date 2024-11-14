# Typewriter

Typewriter is a terminal-style chat application. It allows users to join chatrooms and send files, with a few customizable and interactive elements. This README provides an overview of setting up and using this project yourself. This was mainly an exercise in networking and sockets, so I can finally learn how to make multiplayer chess.

## Features

- **Room-based Chat:** Join and create rooms for private or group communication.
- **File Sharing:** Upload and share files directly in chat.
- **Customizable Interface:** Customize the terminal text color to personalize the display.
- **Command-line Interaction:** Use command-based input for chat and navigation to mimic a terminal interface.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)

---

## Installation

To run Typewriter locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/Typewriter.git
   cd Typewriter
2. **Install dependencies: Install the server dependencies (e.g., Socket.IO) using npm:**:
    ```bash
    npm install
3. Start the server
   ```bash
   node index.js
4. Access Typewriter: Open your web browser and navigate to http://localhost:3000.

### 5. Usage Section

---

## Usage

Typewriter uses a web-based client that resembles a terminal interface. Once connected, users can set a username, join chatrooms, send messages & files, and interact with the tool using the cmd line.

### Basic Layout

- **Header**: Shows the current room, username, and color picker for text customization.
- **Messages Panel**: Displays incoming and outgoing messages in a list.
- **Command Input**: Type commands to navigate, join rooms, and send messages, etc.
- **File Upload Section**: Hidden until the user joins a room, enabling file sharing within the room.

### Current Commands (more functions coming when I have time)

- **ls**	      - List all online rooms
- **join x** 	   - Join room with name 'x', will create a room if there isn't one with that name
- **username x** - set username to 'x'
- **exit** 	   - Leave current room
- **clear** 	   - Clear all text
