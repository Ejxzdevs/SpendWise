// utils/authStorage.ts
import { saveItem, getItem, removeItem } from "./storage";

export const setUserToken = (token: string) => saveItem("userToken", token);
export const getUserToken = () => getItem("userToken");
export const removeUserToken = () => removeItem("userToken");

export const setUserInfo = (user: any) =>
  saveItem("userInfo", JSON.stringify(user));
export const getUserInfo = () => getItem("userInfo");
export const removeUserInfo = () => removeItem("userInfo");
