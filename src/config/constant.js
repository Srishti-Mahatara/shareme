export const url = "http://localhost:3001";
export const getHeaders = async () => {
  const access_token = await localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    authorization: `${access_token}`,
  };
};
