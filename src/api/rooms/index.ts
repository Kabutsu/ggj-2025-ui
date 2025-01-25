import { useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import { useSocket } from '../../lib/socket';
import { User } from '../posts';
import { useRoomStore } from '../../components/feed/store';

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
const joinRoom = async (req: JoinRequest) => await axios.post('/join-room', req, { baseURL });

export const useRooms = () => {
  const socket = useSocket();
  const { setRoomCode, setUserId } = useRoomStore();

  // Check localStorage for existing room data on load
  useEffect(() => {
    const savedRoom = localStorage.getItem('roomCode');
    const savedUserId = localStorage.getItem('userId');
    
    if (savedRoom && savedUserId) {
      setRoomCode(savedRoom);
      setUserId(savedUserId);
      
      // Rejoin the room via WebSocket
      socket.emit('join-room', { roomCode: savedRoom, userId: savedUserId });
    }
  }, [socket, setRoomCode, setUserId]);

  const createRoomMutation = useMutation({
    onMutate: async () => {
      const { code } = await createRoom();
      localStorage.setItem('roomCode', code);
    },
  });

  const joinRoomMutation = useMutation<User, Error, JoinRequest>({
    onMutate: async (req) => {
      const data = await joinRoom(req);

      if (data.status !== 200) throw new Error('Failed to join room');

      const user = data.data as User;

      console.log('user', user);

      localStorage.setItem('roomCode', user.roomId);
      localStorage.setItem('userId', user.id);

      setRoomCode(user.roomId);
      setUserId(user.id);
      
      // Join the room via WebSocket
      socket.emit('join-room', { roomCode: user.roomId, userId: user.id });

      return user;
    },
  });

  return { createRoomMutation, joinRoomMutation };
};
