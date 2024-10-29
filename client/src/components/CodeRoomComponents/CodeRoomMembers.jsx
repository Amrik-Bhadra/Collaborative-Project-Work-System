import React from "react";

const CodeRoomMembers = ({username}) => {
  const getInitials = (name) => {
    const nameParts = name.split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  };
  const name = username.toString();
  return (
    <div className="memberCard">
      <span>{getInitials(username)}</span>
      <h1>{username.toString()}</h1>
    </div>
  );
};

export default CodeRoomMembers;
