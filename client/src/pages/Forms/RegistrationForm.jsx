import React, { useState, useEffect } from "react";
import "./Form.css";
import { Button, Input } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../../public/logo-white.png';
import toast from "react-hot-toast";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();

    if (
      name === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.success('Fill the required Fields!');
    } else {
      if (password === confirmPassword) {
        console.log(username, email, password);
        toast.success('Registered Successfully!')
        setIsSubmitted(true);
      } else {
        toast.error("Passwords do not match");
      }
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      const formData = { name, username, email, password };

      axios
        .post(
          "http://localhost:3000/userAuthen/registrationSubmission",
          formData
        )
        .then((response) => {
          console.log("Data submitted:", response.data);
          alert("Registration successful");
          navigate("/"); // Redirect to the login page after successful registration
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        })
        .finally(() => {
          // Reset submission state after request is completed
          setIsSubmitted(false);
        });
    }
  }, [isSubmitted, username, email, password, navigate]);

  return (
    <main className="main-container">
      <div className="form-container">
        {/* logo box */}
        <div
          className="logo-box"
          style={{
            height: "3rem",
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
        <h1>Register User</h1>
        <form onSubmit={submitForm}>
          <Input
            name="name"
            type="text"
            placeholder="Name"
            size="md"
            variant="outline"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            name="username"
            type="text"
            placeholder="Username"
            size="md"
            variant="outline"
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            name="email"
            type="email"
            placeholder="Email Id"
            size="md"
            variant="outline"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-box">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              size="md"
              variant="outline"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="password-box">
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              size="md"
              variant="outline"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button size="md" type="submit">
            Register
          </Button>
        </form>
        <p className="formPara">
          Already Have Account?{" "}
          <span>
            <Link to="/">Login</Link>
          </span>
        </p>
      </div>
    </main>
  );
};

export default RegistrationForm;
