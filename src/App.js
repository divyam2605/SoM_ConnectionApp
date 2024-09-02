import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";

const socket = io.connect("http://localhost:3001");

function App() {
  // Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [messageReceived, setMessageReceived] = useState("");

  const [buttonNumbers, setButtonNumbers] = useState(Array.from({ length: 220 }, (_, i) => i + 1));
  const [clickedButtonContent, setClickedButtonContent] = useState('');

  const handleClick = (number) => {
    setClickedButtonContent(number);
    sendMessage(number);
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = (number) => {
    socket.emit("send_message", { message: number, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, []);

  return (
    <div className="App">
      <div style={{ alignContent: 'center' }}>
        <h1>Connection App - Story of Makers</h1>
        <TextField
          placeholder="Choose Connection..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        /><br/>
        <Button onClick={joinRoom} style={{ margin: '10px' }} variant="outlined">Join Connection</Button>
      </div>
      <div >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 80px',
          }}
        >
          <div>
            <h4> Choose a Number: </h4>
            {buttonNumbers.map((number) => (
              <Button key={number} variant={clickedButtonContent === number ? "contained" : "outlined"} onClick={() => handleClick(number)}>
                {number}
              </Button>
            ))}
          </div>
        </Box>
        <br/>
      </div>
      <h4>Number: </h4>
      <h1>{messageReceived}</h1>
    </div>
  );
}

export default App;
