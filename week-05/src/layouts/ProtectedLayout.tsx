import {useAuth} from "../context/AuthContext.tsx";

const ProtectedLayout = () => {
  const {accessToken} = useAuth();

  return 