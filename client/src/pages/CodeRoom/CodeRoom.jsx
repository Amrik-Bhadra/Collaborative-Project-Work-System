import React, {useEffect, useRef, useState} from "react";
import CodeRoomMembers from "../../components/CodeRoomComponents/CodeRoomMembers";
import { initSocket } from "../../Socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const CodeRoom = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  // use to get the state value passed along with navigation
  const location = useLocation();

  // ref is used because kch changes hone pe page render nhi hoga
  const socketRef = useRef(null);

  // get the room id form the url
  const { roomId } = useParams();

  useEffect(() => {
    const init = async () => {
      // main connection line with the backend
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => {
        handleError(err);
      });
      socketRef.current.on("connect_failed", (err) => {
        handleError(err);
      });

      const handleError = (e) => {
        console.log("Soccket error: ", e);
        toast.error(`${e}`);
        navigate("/joinCodeRoom");
      };

      // following is for sending data to backend
      socketRef.current.emit("join", {
        roomId,
        username: location.state?.username,
      });

      // joined room logic
      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} has joined the room`);
        }
        setClients(clients);
      });


      // disconnected
      socketRef.current.on('disconnected', ({socketId, username})=>{
        toast.success(`${username} left the room`);
        setClients((prev)=>{
          return prev.filter((client)=> client.socketId != socketId)
        });
      });
    };
    init();

    // close all listners insde the useEffect
    // return ()=>{
    //   socketRef.current.disconnect();
    //   socketRef.current.off('joined');
    //   socketRef.current.off('disconnected');
    // }
  }, []);

  if (!location.state) {
    return <Navigate to="/joinCodeRoom" />;
  }

  return (
    <main className="codeRoomContainer">
      <aside className="membersSideBar">
        <div className="memberSideHeader">
          <h1>Members</h1>
          <hr />
        </div>
        <div className="membersListContainer">
          {
            clients.map((client)=>(
              <CodeRoomMembers key={client.socketId} username={client.username}/>
            ))
          }
          
        </div>
        <div className="memberSideFooter">
          <hr />
          <button className="copyCodeBtn CodeRoomBtn">Copy Room Code</button>
          <button className="leaveRoomBtn CodeRoomBtn">Leave Room</button>
        </div>
      </aside>
    </main>
  );
};

export default CodeRoom;
