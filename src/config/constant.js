import { getAuth, signOut } from "firebase/auth";

// export const url = "http://localhost:3001";
export const url = "https://shareme.loca.lt";
export const getHeaders = async () => {
  const auth = await getAuth();
  if (!auth);
  const access_token = await auth.currentUser.getIdToken();

  return {
    "Content-Type": "application/json",
    authorization: `${access_token}`,
  };
};
