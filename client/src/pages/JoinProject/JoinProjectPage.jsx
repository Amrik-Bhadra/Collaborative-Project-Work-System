import React, { useState, useContext, useEffect } from "react";
import {
  Input,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const JoinProjectPage = () => {
  const [roomCode, setRoomCode] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  useEffect(() => {
    // Redirect to home if no auth token is present
    if (!authData?.token) {
      navigate("/");
    }
  }, [authData, navigate]);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Change the method to 'POST' to match the server-side route
      const response = await axios.post(
        "http://localhost:3000/projectRoom/joinProjectRoom",
        { roomCode, roomPassword },
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        }
      );
  
      toast({
        title: "Joined Successfully!",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
  
      navigate("/home");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
  
      console.error("Error joining project room:", error);
    }
  };
  

  return (
    <main className="create-main-container">
      <div className="create-project-container">
        <div className="create-header">
          <h1>Join Project</h1>
          <p>Enter valid project room ID to join the project</p>
        </div>
        <form className="create-project-form" onSubmit={handleSubmit}>
          <Input
            name="roomCode"
            type="text"
            placeholder="Project Room Code"
            size="md"
            variant="outline"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            required
          />

          {/* Password field with toggle visibility icon */}
          <InputGroup size="md" mt={4}>
            <Input
              name="roomPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Project Room Password"
              variant="outline"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              required
            />
            <InputRightElement width="3rem">
              <IconButton
                size="sm"
                onClick={handleTogglePassword}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                aria-label={showPassword ? "Hide password" : "Show password"}
              />
            </InputRightElement>
          </InputGroup>

          <div className="create-form-btn-group" style={{ marginTop: "16px" }}>
            <Button size="md" type="submit" colorScheme="blue">
              Join Project
            </Button>
            <Link
              to="/home"
              className="discard-btn"
              style={{ marginLeft: "8px" }}
            >
              Discard
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default JoinProjectPage;
