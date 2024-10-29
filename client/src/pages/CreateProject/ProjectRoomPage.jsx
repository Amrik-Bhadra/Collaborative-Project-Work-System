import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  CloseButton,
  useToast, // Import useToast for notification
} from "@chakra-ui/react";

import { SiGoogledocs } from "react-icons/si";
import { FaFilePdf, FaImage, FaHtml5 } from "react-icons/fa";
import { SiCss3 } from "react-icons/si";
import { IoSearch } from "react-icons/io5";
import { HiUpload } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ProjectRoomPage = () => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [projectRoomData, setProjectRoomData] = useState({});
  const [projectRoomMembersData, setProjectRoomMembersData] = useState([]);
  const { authData } = useContext(AuthContext);

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode)
      .then(() => {
        toast.success('Room code copied!')
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast.error('Failed to copy room code!')
      });
  };

  useEffect(() => {
    if (!authData?.token) {
      navigate("/");
      return;
    }

    axios
      .get(
        `http://localhost:3000/projectRoom/getProjectRoomDetail/${roomCode}`,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setProjectRoomData(response.data.projectDetails);
          setProjectRoomMembersData(response.data.membersInfo || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching project room details:", error);
      });
  }, [authData, navigate, roomCode]);

  return (
    <main className="project-room-main-container">
      <div className="project-room-container">
        <header className="project-room-header">
          <div className="header-upper">
            <div className="headerbox">
              <h1>{projectRoomData.title || "Project Title"}</h1>
              <span>{projectRoomData.projectDomain}</span>
            </div>
            <div className="header-upper-group">
              <Button
                variant="outline"
                size="sm"
                cursor="pointer"
                border="1px solid #5252528c"
                background="#ccc"
                color="#333"
                padding="1rem 1rem"
                onClick={()=>{navigate('/joinCodeRoom')}}
              >
                Open Code Editor
              </Button>

              {/* Copy to Clipboard button */}
              <Button
                variant="solid"
                size="sm"
                colorScheme="teal"
                onClick={copyToClipboard}
              >
                Copy Room Code
              </Button>

              <CloseButton
                variant="solid"
                color="#fff"
                background="#444"
                onClick={() => {
                  navigate("/home");
                }}
              />
            </div>
          </div>
          <div className="header-lower">
            <p>
              {projectRoomData.description ||
                "Project description not available"}
            </p>
          </div>
        </header>
        <main className="project-room-content">
          <div className="project-room-content-members project-room-subcontainer">
            <div className="project-room-subcontainer-content">
              <h2>Members</h2>
              <div className="project-room-content-body">
                <ul>
                  {projectRoomMembersData.map((member) => (
                    <li
                      key={member._id}
                      className="project-room-content-body-items"
                    >
                      <div className="items-group">
                        <div className="item-icon">
                          <p>{getInitials(member.name)}</p>
                        </div>
                        <span>
                          <h3 className="item-name">{member.name}</h3>
                          <p>{member.email}</p>
                        </span>
                      </div>
                      <Button size="sm">Remove</Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="project-room-content-files project-room-subcontainer">
            <div className="project-room-subcontainer-content">
              <header className="subcontainer-content-header">
                <h2>Files</h2>
                <div className="subcontainer-content-header-group">
                  <InputGroup
                    size="md"
                    className="searchbarbox"
                    background="transparent"
                  >
                    <InputLeftElement pointerEvents="none">
                      <IoSearch className="searchIcon" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="Search File"
                      aria-label="Search projects"
                      className="search-bar"
                      border="1px solid #5252528c"
                      background="transparent"
                      color="#ccc"
                      width="100%"
                    />
                  </InputGroup>

                  <Select
                    placeholder="File Type"
                    border="1px solid #5252528c"
                    background="transparent"
                    color="#cccc"
                    width="100%"
                  >
                    <option value="doc">doc</option>
                    <option value="pdf">pdf</option>
                    <option value="image">image</option>
                    <option value="html">html</option>
                  </Select>

                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.html,.css,.js"
                    display="none"
                    id="file-upload"
                    onChange={(event) => console.log(event.target.files)}
                  />
                  <Button
                    as="label"
                    htmlFor="file-upload"
                    variant="outline"
                    size="sm"
                    leftIcon={<HiUpload />}
                    cursor="pointer"
                    border="1px solid #5252528c"
                    background="transparent"
                    color="#ccc"
                    width="70%"
                    padding="1.2rem 1rem"
                  >
                    Upload file
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    cursor="pointer"
                    border="1px solid #5252528c"
                    background="transparent"
                    color="#ccc"
                    padding="1.2rem 1rem"
                    leftIcon={<IoMdAdd />}
                    width="50%"
                  >
                    Create
                  </Button>
                </div>
              </header>

              <div className="project-room-content-body">
                <ul>
                  <li className="project-room-content-body-items">
                    <div className="items-group">
                      <SiGoogledocs size="2.6rem" color="#f1f1f1" />
                      <span>
                        <h3 className="item-name">Project-Requirements</h3>
                        <p>Ramani Vemula</p>
                      </span>
                    </div>
                    <Button size="sm">Delete</Button>
                  </li>
                  <li className="project-room-content-body-items">
                    <div className="items-group">
                      <FaFilePdf size="2.6rem" color="#f1f1f1" />
                      <span>
                        <h3 className="item-name">project-summary</h3>
                        <p>Amrik Bhadra</p>
                      </span>
                    </div>
                    <Button size="sm">Delete</Button>
                  </li>
                  <li className="project-room-content-body-items">
                    <div className="items-group">
                      <FaImage size="2.6rem" color="#f1f1f1" />
                      <span>
                        <h3 className="item-name">cover-image</h3>
                        <p>Ramani Vemula</p>
                      </span>
                    </div>
                    <Button size="sm">Delete</Button>
                  </li>
                  <li className="project-room-content-body-items">
                    <div className="items-group">
                      <FaHtml5 size="2.6rem" color="#f1f1f1" />
                      <span>
                        <h3 className="item-name">index.html</h3>
                        <p>Shivshankar Ghyar</p>
                      </span>
                    </div>
                    <Button size="sm">Delete</Button>
                  </li>
                  <li className="project-room-content-body-items">
                    <div className="items-group">
                      <SiCss3 size="2.6rem" color="#f1f1f1" />
                      <span>
                        <h3 className="item-name">styles</h3>
                        <p>Shivshankar Ghyar</p>
                      </span>
                    </div>
                    <Button size="sm">Delete</Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
};

export default ProjectRoomPage;
