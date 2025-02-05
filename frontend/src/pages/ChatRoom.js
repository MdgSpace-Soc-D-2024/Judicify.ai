import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import {Buffer} from "buffer"
import { handleError } from "../utils"
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'

export const jwtDecode = (token) => {
  const arrayToken = token.split('.');
  if (arrayToken.length !== 3) {
      throw new Error('Invalid JWT token');
  }

  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  return tokenPayload;
};

const api = axios.create({
  baseURL: 'http://localhost:1818',
});

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatState, setChatState] = useState("Open");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isJudge, setIsJudge] = useState();
  const navigate = useNavigate();
  const socket = React.useRef(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          toast.error("You are not logged in. Please log in to send a message.");
          return;
        }
        const decodedPayload = jwtDecode(token);
        setIsJudge(decodedPayload.judge);
        
        //Fetching messages for the room
        const messagesResponse = await api.get(
          `http://localhost:1818/rooms/${roomId}/messages`, // NEW API CALL to fetch messages
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log("Full response data:", messagesResponse.data);

        console.log("Fetched messages:", messagesResponse.data.messages);
        setMessages(messagesResponse.data.messages);
      } 
      catch (error) {
        console.error(error);
        toast.error("Failed to fetch room details.");
      }
    };

    fetchRoomDetails();

    socket.current = io("http://localhost:1818", {
      withCredentials: true,
    });

    socket.current.emit("join-room", roomId);

    socket.current.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on("user-joined", (userId) => {
      setMessages((prev) => [
        ...prev,
        { system: true, message: `User ${userId} joined the room.` },
      ]);
    });

    socket.current.on("room-state-updated", (state) => {
      setChatState(state);
      setMessages((prev) => [
        ...prev,
        { system: true, message: `The room is now ${state}.` },
      ]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [roomId]); // Dependency array to re-run this effect if roomId changes

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("You are not logged in. Please log in to send messages.");
      return;
    }
    try {
      const user = JSON.parse(atob(token.split(".")[1])); 
      const message = {
        roomId,
        message: newMessage,
        sender: user._id,
      };

      socket.current.emit("send-message", message);
      // setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Token decoding error:", error);
      toast.error("Authentication error. Please log in again.");
    }
  };

  const handleRoomClose = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!isJudge) {
        handleError("You are not authorized to perform this action.");
        return;
      }
      await api.patch(
        `http://localhost:1818/rooms/${roomId}/close`,
        { chatState: "Closed" },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.success("Room closed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to close room lol.");
    }
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadPDF = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file to upload.");
      return;
    }
    const token = localStorage.getItem("jwtToken");
    if (!token) { //imporvement can be done by again checking the token
      toast.error("You are not logged in. Please log in to upload files.");
      return;
    }
    const user = JSON.parse(atob(token.split(".")[1]));
    
    const formData = new FormData();
    formData.append("pdf", selectedFile);
    formData.append("roomId", roomId); 
    formData.append("user", user._id);
    
    try {
      console.log("1.5")
      const response = await fetch('http://localhost:1818/upload_pdf',{
        method: "POST",
        headers:{
          Authorization: `${token}`,
          // "Content-Type": "multipart/form-data",
        },
        body : formData
      })
      console.log(response)
      toast.success("PDF uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.log("Error uploading PDF:", error);
      toast.error("Failed to upload PDF.");
    }
  };
  const handleHome = (e) => {
    navigate('/home')
  }
  const analyzePDFs = async () => {
    try {
      console.log('roomid \n' + roomId)
      const token = localStorage.getItem("jwtToken");
      const getPDFsResponse = await fetch(`http://localhost:1818/get_pdf/${roomId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(getPDFsResponse)
      
      if (!getPDFsResponse.ok) {
        handleError("Failed to fetch PDFs from MongoDB");
        // console.log("hellio")
        return getPDFsResponse.ok
      }
      
      const { pdf1, pdf2 } = await getPDFsResponse.json();
      
      // Convert base64 to File objects
      const pdf1File = new File(
        [Buffer.from(pdf1.data, 'base64')],
        pdf1.filename,
        { type: 'application/pdf' }
      );
      
      const pdf2File = new File(
        [Buffer.from(pdf2.data, 'base64')],
        pdf2.filename,
        { type: 'application/pdf' }
      );
      
      
      const formData = new FormData();
      formData.append('pdf1', pdf1File);
      formData.append('pdf2', pdf2File);
      
      const botResponse = await fetch('http://localhost:5000/response', {
        method: 'POST',
        body: formData
      });
  
      if (!botResponse.ok) {
        throw new Error('Failed to get analysis from bot');
      }
  
      const analysisResult = await botResponse.json();
      console.log(analysisResult)

      const analysisMessage = {
        roomId,
        message: analysisResult.message,
        sender: "Judy Bot", 
        system: true 
      };
      
      socket.current.emit("send-message", analysisMessage);
      // Optionally, update the local state to display immediately:
      // setMessages(prev => [...prev, analysisMessage]);

      return analysisResult.message;
      
    } catch (error) {
      console.error('Error in PDF analysis:', error);
      throw error;
    }
  };
  return (
    <div className="chatroom-container">
      <h2>Chat Room: {roomId}</h2>
      <p>State: {chatState}</p>
      <div className="messages">
        {messages.map((msg, index) =>
          msg.system ? (
            <p key={index} className="system-message">
              {msg.message}
            </p>
          ) : (
            <p key={index}>
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          )
        )}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={chatState === "Closed"}
        />
        <button onClick={sendMessage} disabled={chatState === "Closed"}>
          Send
        </button>
      </div>
      <div className="pdf-upload">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        {/* <button onClick={uploadPDF} disabled={!selectedFile}> */}
        <button onClick={uploadPDF}>
          Upload PDF
        </button>
      </div>
      <div>
        <button onClick={analyzePDFs} className="analyze-pdf-btn">
          Analyze PDFs
        </button>
      </div>
      <div>
        <button onClick={handleRoomClose} className="close-room-btn">
          Close Room
        </button>
      </div>
      <div>
        <button onClick={handleHome} className="close-room-btn">
          Home
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatRoom;
