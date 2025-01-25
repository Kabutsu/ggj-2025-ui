import { useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import { useSocket } from '../../lib/socket';
import { User } from '../posts';

type Room = {
  id: string;
  code: string;
  createdAt: Date;
  users: Array<User>;
  traitors: Array<User>;
};

type JoinRequest = {
  code: string;
  name: string;
  profileUrl: string;
};

const baseURL = `${import.meta.env.VITE_BASE_API_URL}/rooms`;

const createRoom = async () => await axios.post<undefined, Room>('/create', { baseURL });
const joinRoom = async (req: JoinRequest) => await axios.post<JoinRequest, User>('/join-room', req, { baseURL });

type Props = {
  setRoomCode: (roomCode: string) => void;
  setUsername: (username: string) => void;
};

export const useRooms = ({
  setRoomCode,
  setUsername,
}: Props) => {
  const socket = useSocket();
  const [inRoom, setInRoom] = useState(false);

  // Check localStorage for existing room data on load
  useEffect(() => {
    const savedRoom = localStorage.getItem('roomCode');
    const savedUsername = localStorage.getItem('username');
    
    if (savedRoom && savedUsername) {
      setRoomCode(savedRoom);
      setUsername(savedUsername);
      setInRoom(true);
      
      // Rejoin the room via WebSocket
      socket.emit('join-room', { roomCode: savedRoom, username: savedUsername });
    }
  }, [setInRoom, setRoomCode, setUsername, socket]);

  const createRoomMutation = useMutation({
    onMutate: async () => {
      const { code } = await createRoom();
      setRoomCode(code);
      localStorage.setItem('roomCode', code);
    },
  });

  const joinRoomMutation = useMutation({
    onMutate: async (req: JoinRequest) => {
      const user = await joinRoom(req);
      setUsername(user.name);
      localStorage.setItem('roomCode', req.code);
      localStorage.setItem('username', user.name);
      setInRoom(true);
      
      // Join the room via WebSocket
      socket.emit('join-room', { roomCode: req.code, username: user.name });
    },
  });

  return { inRoom, createRoomMutation, joinRoomMutation };
};
