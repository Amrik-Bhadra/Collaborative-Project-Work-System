import React, { useState } from "react";
// import { IoPersonAddSharp } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { MdEditDocument } from "react-icons/md";
import "./ProjectCard.css";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ room }) => {
  // Accept room prop
  const [showModal, setShowModal] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setInputText("");
    setIsDeleteEnabled(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    setIsDeleteEnabled(value.toLowerCase() === "delete");
  };

  const handleDeleteConfirmation = () => {
    if (isDeleteEnabled) {
      // Add your delete logic here
      console.log("Item Deleted");
      handleCloseModal(); // Close modal after deletion
    }
  };

  return (
    <div className="projectCard">
      <div className="project-card-content">
        <h1>{room.title}</h1>
        <p>{room.description}</p>
      </div>
      <div className="card-btn-group">
        <button
          className="project-btn enter-btn"
          onClick={() => navigate(`/projectRoom/${room.roomCode}`)}
        >
          Enter
        </button>
        <div className="right-group">
          <button>
            <MdEditDocument />
          </button>
          <button onClick={handleDeleteClick}>
            <AiFillDelete />
          </button>
        </div>
      </div>

      {/* Modal for Delete Confirmation */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Are you sure you want to delete?</h2>
            <p>
              Please type <strong>"delete"</strong> to confirm.
            </p>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type 'delete' here..."
            />
            <div className="modal-btn-group">
              <button onClick={handleCloseModal} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmation}
                disabled={!isDeleteEnabled}
                className={`delete-btn ${
                  isDeleteEnabled ? "enabled" : "disabled"
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
