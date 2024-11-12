# RetroComm

RetroComm is a retro-style chat application designed to give a terminal-like chat experience on the web. It allows users to join specific chat rooms, send files, customize their display colors, and interact using simple commands. This README provides an overview of the setup and features available in RetroComm.

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

To run RetroComm locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/RetroComm.git
   cd RetroComm
2. **Install dependencies: Install the server dependencies (e.g., Socket.IO) using npm:**:
    ```bash
    npm install
3. Start the server
   ```bash
   node server.js
4. Access RetroComm: Open your web browser and navigate to http://localhost:3000.

### 5. Usage Section

---

## Usage

RetroComm uses a web-based client that resembles a terminal interface. Once connected, users can set a username, join chatrooms, send messages & files, and interact with the tool using the cmd line.

### Basic Layout

- **Header**: Shows the current room, username, and color picker for text customization.
- **Messages Panel**: Displays incoming and outgoing messages in a list.
- **Command Input**: Type commands to navigate, join rooms, and send messages, etc.
- **File Upload Section**: Hidden until the user joins a room, enabling file sharing within the room.















