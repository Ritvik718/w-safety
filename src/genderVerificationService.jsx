import axios from "axios";

export const verifyGender = async (name) => {
  try {
    const response = await axios.get(`https://api.genderize.io?name=${name}`);
    console.log("API Response:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    console.error("Error verifying gender:", error);
    return null;
  }
};
