import React, { useState, useContext } from "react";
import {
  Input,
  Textarea,
  Select,
  Button,
  Tag,
  TagLabel,
  FormControl,
  FormHelperText,
  Spinner,
} from "@chakra-ui/react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "./CreateProjectPage.css";

const CreateProjectPage = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDomain, setProjectDomain] = useState("");
  const [members, setMembers] = useState([]);
  const [roomPassword, setRoomPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  const handleMemberAddition = (e) => {
    const email = e.target.value.trim();
    if (e.key === " " && email && members.length < 5 && !members.includes(email)) {
      setMembers((prev) => [...prev, email]);
      e.target.value = ""; // Clear the input
    } else if (members.length >= 5) {
      alert("Maximum of 5 members can be added.");
    }
  };

  const handleMemberRemoval = (emailToRemove) => {
    setMembers((prev) => prev.filter((email) => email !== emailToRemove));
  };

  const submitProject = async (e) => {
    e.preventDefault();
    if (!projectName || !projectDescription || !projectDomain || !members.length || !roomPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const formData = {
      projectTitle: projectName,
      projectDescription,
      projectDomain,
      members,
      roomPassword,
    };

    try {
      console.log('form data: ', formData);
      
      await axios.post("http://localhost:3000/projectRoom/createProject", formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
      });
      console.log(formData.data);
      alert("Successfully created Project");
      navigate("/home");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-main-container">
      <div className="create-project-container">
        <h1>
          New <span>Project</span>
        </h1>
        <form className="create-project-form" onSubmit={submitProject}>
          <FormControl isRequired>
            <Input
              name="projectTitle"
              type="text"
              placeholder="Project Title"
              size="md"
              variant="outline"
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
            />
          </FormControl>
          <FormControl isRequired>
            <Textarea
              name="projectDescription"
              placeholder="Project Description"
              size="md"
              variant="outline"
              resize="none"
              height="8rem"
              onChange={(e) => setProjectDescription(e.target.value)}
              value={projectDescription}
            />
          </FormControl>
          <FormControl isRequired>
            <Select
              placeholder="Select Domain"
              name="projectDomain"
              onChange={(e) => setProjectDomain(e.target.value)}
              value={projectDomain}
            >
              <option value="web development">Web Development</option>
              <option value="data science">Data Science</option>
              <option value="ai & ml">AI & ML</option>
            </Select>
          </FormControl>
          
          <FormControl>
            <Input
              name="members"
              type="text"
              placeholder="Add Members (type email and press space)"
              size="md"
              variant="outline"
              onKeyDown={handleMemberAddition}
            />
            <div className="tag-container">
              {members.map((email, index) => (
                <Tag
                  key={index}
                  size="sm"
                  variant="solid"
                  colorScheme="blue"
                  style={{
                    display: "flex",
                    padding: "0.7rem 0.8rem",
                    justifyContent: "space-between",
                    gap: "0 0.5rem",
                  }}
                >
                  <TagLabel>{email}</TagLabel>
                  <IoCloseCircleSharp
                    style={{ fontSize: "1rem", cursor: "pointer" }}
                    onClick={() => handleMemberRemoval(email)}
                  />
                </Tag>
              ))}
            </div>
            <FormHelperText>Max 5 members allowed.</FormHelperText>
          </FormControl>

          <FormControl isRequired>
            <Input
              placeholder="Room Password"
              size="md"
              name="roomPassword"
              type="password"
              variant="outline"
              onChange={(e) => setRoomPassword(e.target.value)}
              value={roomPassword} // Controlled input
            />
          </FormControl>

          <div className="create-form-btn-group">
            <Button size="md" type="submit" isDisabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : "Create Project"}
            </Button>
          </div>
          <Link to="/home" className="discard-btn">
            Discard
          </Link>
        </form>
      </div>
    </main>
  );
};

export default CreateProjectPage;
