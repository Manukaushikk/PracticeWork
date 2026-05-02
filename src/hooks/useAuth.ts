import { useAppSelector } from "../app/hooks";

// Any component can call useAuth() to get the current user
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};
