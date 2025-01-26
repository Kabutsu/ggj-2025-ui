import { useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useSocket } from '../../lib/socket';
import { User } from '../posts';
import { useRoomStore } from '../../components/feed/store';

// type Room = {
//   id: string;
//   code: string;
//   createdAt: Date;
//   users: Array<User>;
//   traitors: Array<User>;
// };

type JoinRequest = {
  code: string;
  name: string;
  profileUrl: string;
};

type RoomStatus = {
  traitorCount: number;
  blockedUsers: Array<User>;
};

const baseURL = `${import.meta.env.VITE_BASE_API_URL}/rooms`;

const joinRoom = async (req: JoinRequest) => await axios.post<JoinRequest, AxiosResponse<User>>('/join-room', req, { baseURL });
const getRoomStatus = async (code: string) => await axios.get<undefined, AxiosResponse<RoomStatus>>(`/${code}/status`, { baseURL });

export const useRooms = () => {
  const socket = useSocket();
  const { roomCode, setRoomCode, setUserId } = useRoomStore();

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

  const joinRoomMutation = useMutation<User, Error, JoinRequest>({
    mutationFn: async (req) => {
      const data = await joinRoom(req);

      if (data.status !== 200) throw new Error('Failed to join room');

      const { data: user } = data;

      localStorage.setItem('roomCode', user.roomId);
      localStorage.setItem('userId', user.id);

      setRoomCode(user.roomId);
      setUserId(user.id);
      
      // Join the room via WebSocket
      socket.emit('join-room', { roomCode: user.roomId, userId: user.id });

      return user;
    },
  });

  const roomStatus = useQuery<RoomStatus>({
    queryKey: ['room-status', roomCode],
    queryFn: async () => {
      const data = await getRoomStatus(roomCode);

      if (data.status !== 200) throw new Error('Failed to get room status');

      return data.data;
    },
    refetchInterval: 5000,
    enabled: !!roomCode?.length,
  });

  return { joinRoomMutation, roomStatus };
};
