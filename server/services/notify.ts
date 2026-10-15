import Notification from "../models/Notification.js";
import { User } from "../models/user.js";

interface NotifyPayload {
  type: string;
  title: string;
  message: string;
  link?: string;
}

// Kisi ek specific user ko
export const notifyUser = async (
  recipientId: string,
  payload: NotifyPayload
) => {
  return Notification.create({ recipient: recipientId, ...payload });
};

// Saare admins ko
export const notifyAdmins = async (payload: NotifyPayload) => {
  const admins = await User.find({ role: "admin" }).select("_id");
  if (admins.length === 0) return;
  return Notification.insertMany(
    admins.map((a) => ({ recipient: a._id, ...payload }))
  );
};

// Saare normal users ko (naya restaurant live hone pe)
export const notifyAllUsers = async (payload: NotifyPayload) => {
  const users = await User.find({ role: "user" }).select("_id");
  if (users.length === 0) return;
  return Notification.insertMany(
    users.map((u) => ({ recipient: u._id, ...payload }))
  );
};