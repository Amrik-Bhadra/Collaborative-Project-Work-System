import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { Button } from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import { Select } from "@chakra-ui/react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // AuthContext import
import defaultProfile from "../../assets/ProfileImages/avtaar.jpg";
import logo from "../../../public/logo-white.png";

const Home = () => {
  const navigate = useNavigate();
  const [projectRooms, setProjectRooms] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [userProfilePic, setProfilePic] = useState(defaultProfile);
  const { authData, logout } = useContext(AuthContext);

  // Fetch project rooms when the component mounts
  useEffect(() => {
    if (!authData?.token) {
      navigate("/"); // Redirect to login if token is missing
      return;
    }

    axios
      .get("http://localhost:3000/projectRoom/getProjectRooms", {
        headers: { Authorization: `Bearer ${authData.token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setProjectRooms(response.data.projectRooms);
          setUserInfo(response.data.userInfo);
          setProfilePic(
            userInfo.profilePic
              ? require(`../../assets/ProfileImages/${response.data.userInfo.profilePic}`)
              : defaultProfile
          );
        } else {
          alert("No Data currently");
        }
      })
      .catch((error) => {
        console.error("Error fetching project rooms:", error);
        // alert("Error fetching project rooms: " + error.message);
      });
  }, [authData, navigate]);

  return (
    <main className="home-main-container">
      <aside className="profile-container">
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
              height: "3.5rem",
              borderRight: "1px solid #eee",
              paddingRight: "0.5rem",
            }}
          />
          <p style={{ color: "#eee", fontSize: "1.3rem", fontWeight: "500" }}>
            Code Share
          </p>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:"1rem 0"}}>
          <div className="profilePicBox">
            <img src={userProfilePic} alt="profile-pic" />
          </div>
          <div className="profile-content">
            <h1>@{userInfo.username}</h1>
            <p>{userInfo.email}</p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          rightIcon={<MdLogout />}
          colorScheme="teal"
          variant="solid"
          padding="1.8rem 2.2rem"
          fontSize="1.2rem"
          onClick={() => {
            logout(); // Call logout function to clear auth data
            navigate("/"); // Navigate to login page
            toast({
              title: "Logged Out Successfully",
              description: "Logout Out!",
              status: "Success",
              duration: 3000,
              isClosable: true,
              position: "top", // Set the position to top
            });
          }}
        >
          Logout
        </Button>
      </aside>
      <section className="main-content">
        <div className="header-div">
          <h1>
            Welcome Back, <span>{userInfo.name}</span>
          </h1>
          <div className="header-btn-div">
            <Button
              leftIcon={<IoIosCreate className="icon" />}
              colorScheme="green"
              size="md"
              width="7rem"
              onClick={() => {
                navigate("/createProject");
              }} // Navigate to create project
            >
              Create
            </Button>
            <Button
              leftIcon={<IoMdAddCircle className="icon" />}
              colorScheme="red"
              size="md"
              width="7rem"
              onClick={() => {
                navigate("/joinProject");
              }} // Navigate to join project
            >
              Join
            </Button>
          </div>
        </div>

        <div className="projects-card-main-container">
          <div className="filter-box">
            <InputGroup size="md" mb={4} className="searchbarbox" width="20rem">
              <InputLeftElement pointerEvents="none">
                <IoSearch className="searchIcon" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search Project"
                aria-label="Search projects"
                className="search-bar"
                background="white"
              />
            </InputGroup>

            <Select
              placeholder="Select Domain"
              background="white"
              maxWidth="12rem"
            >
              <option value="web development">Web Development</option>
              <option value="java development">Java Development</option>
              <option value="data science">Data Science</option>
              <option value="ai & ml">AI & ML</option>
            </Select>
          </div>

          <div className="projects-card-box">
            {projectRooms.map((room) => (
              <ProjectCard key={room._id} room={room} /> // Pass room data to ProjectCard
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
