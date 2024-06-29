import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import io from "socket.io-client";
import axios from "axios";
import UserContext from "../../contexts/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import LoaderContext from "../../contexts/LoaderContext";

let socket;

const Chat = () => {
  const { id } = useParams();
  const [chats, setChats] = useState([]);
  const [messagesByChat, setMessagesByChat] = useState({});
  const { userData, fetchUserData } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const senderMessages = {};
  const { setLoader } = useContext(LoaderContext);
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("sm"));

  // Initialize socket connection
  useEffect(() => {
    socket = io("http://localhost:3000", {
      extraHeaders: {
        jwt: localStorage.getItem("token"),
      },
    });

    socket.on("connect", () => {
     });

    socket.on("chat message", (message) => {
      if (
        (message.sender === userData?._id && message.receiver === id) ||
        (message.sender === id && message.receiver === userData?._id)
      ) {
        setMessagesByChat((prevMessagesByChat) => ({
          ...prevMessagesByChat,
          message,
        }));
        getMessages();
      } else {
        getConversations();
      }
     });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [id, userData?._id]);

  useEffect(() => {
    setLoader(false);
  }, []);

  const getMessages = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/api/v1/auth/usersMessages",
        { sender: userData?._id, receiver: id }
      );

      response.data.forEach((message) => {
        if (!senderMessages[message.sender._id]) {
          senderMessages[message.sender._id] = []; // Initialize array if not exists
        }
        senderMessages[message.sender._id].push(message);
      });

      const senderArrays = Object.values(senderMessages);
      setChats(response.data);
      setChatMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const getConversations = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/api/v1/auth/conversation",
        { sender: userData?._id }
      );
      const x = await response.data;
      setConversation(x);
      await getMessages();

      return x.length;
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    getMessages();
    getConversations();
  }, []);

  useEffect(() => {
    fetchUserData();
    getMessages();
    getConversations();
  }, [id, userData?._id]);

  const sendMessage = async () => {
    const message = { sender: userData?._id, receiver: id, content: input };
    await socket.emit("chat message", message);
    setInput("");
    await getMessages();
    const x = await getConversations();

    if (x === 0) {
      await getConversations();
    }
  };

  const handleChatClick = (chat) => {
    const participantId =
      userData._id === chat.participants[0]._id
        ? chat.participants[1]._id
        : chat.participants[0]._id;
    navigate(`/chat/${participantId}`);
    setSelectedChat(chat);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        width: "100%",
         height: "100vh",
        position: "relative",
      }}
    >
      <Sidebar
        conversation={conversation}
        userData={userData}
        handleChatClick={handleChatClick}
      />

      {id && (
        <ChatWindow
          messagesByChat={messagesByChat}
          selectedChat={selectedChat}
          messages={messages}
          id={id}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          userData={userData}
        />
      )}
    </Box>
  );
};

export default Chat;
