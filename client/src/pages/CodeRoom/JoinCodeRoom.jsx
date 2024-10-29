import React, { useState } from "react";
import { Button, Input } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { toast } from "react-hot-toast";
import "./CodeRoom.css";
import { useNavigate } from "react-router-dom";
import logo from '../../../public/logo-white.png';

const JoinCodeRoom = () => {
  const [roomid, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const id = uuid();
    toast.success("Room Successfully Created");
    setRoomId(id);
  };

  const joinRoom = () => {
    if (!roomid && !username) {
      toast.error("Both field is required");
      return;
    } else if (!roomid) {
      toast.error("Room Id is required");
      return;
    } else if (!username) {
      toast.error("Username is required");
      return;
    } else {
      toast.success(`${username} have joined the room`);
      navigate(`/codeRoom/${roomid}`, {
        state: { username },
      });
    }
  };

  return (
    <main className="main-container">
      <div className="form-container">
        {/* logo box */}
        <div
          className="logo-box"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0 0.6rem",
            marginBottom: "1rem",
          }}
        >
          <img
            src={logo}
            alt="logo-dark"
            style={{
              height: "2.5rem",
              borderRight: "1px solid #eee",
              paddingRight: "0.5rem",
            }}
          />
          <p style={{ color: "#eee", fontSize: "1rem", fontWeight: "500" }}>
            Code Share
          </p>
        </div>
        <h1>Join Code Room</h1>
        <Input
          className="joinRoomInput"
          name="codeRoomCode"
          type="text"
          placeholder="Room Code"
          size="md"
          variant="outline"
          value={roomid}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <Input
          className="joinRoomInput"
          name="username"
          type="text"
          placeholder="Username"
          size="md"
          variant="outline"
          onChange={(e) => setUsername(e.target.value)}
        />

        <Button
          className="joinRoomBtn"
          size="md"
          type="submit"
          onClick={joinRoom}
        >
          Join Room
        </Button>

        <p style={{ color: "#ccc", marginTop: "0.5rem" }}>
          Don't Have a Room Code?{" "}
          <span
            style={{
              color: "rgb(0, 202, 202)",
              marginTop: "0.5rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
            onClick={generateRoomId}
          >
            Create Room
          </span>
        </p>
      </div>
    </main>
  );
};

export default JoinCodeRoom;
