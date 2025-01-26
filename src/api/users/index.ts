import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

import { User } from "../posts";

const baseURL = `${import.meta.env.VITE_BASE_API_URL}/users`;

export const useUser = (userId: string, user?: User) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      if (user != null) console.log(user);

      return axios.get<undefined, AxiosResponse<User>>(`${userId}`, { baseURL }).then((res) => res.data);
    },
  });
};

export const useFlagUser = ({ userId, flaggedById }: { userId: string, flaggedById: string }) => {
  return useMutation({
    mutationFn: () => axios.post(`${userId}/flag`, { flaggedById}, { baseURL }),
  });
};
