import { Response } from "express";
import Notification from "../models/Notification.js";
import { AuthRequest } from "../middlewares/auth.js"; 
import { notifyAdmins } from "../services/notify.js";

// Meri latest 20 notifications
export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ recipient: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Notifications load nahi hui" });
  }
};

// Bell ke badge ke liye unread count
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user!._id,
      isRead: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Count load nahi hua" });
  }
};

// Ek notification read mark karo
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user!._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification nahi mili" });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Update nahi hua" });
  }
};

// Sab read mark karo
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { recipient: req.user!._id, isRead: false },
      { isRead: true }
    );
    res.json({ message: "Sab read ho gayi" });
  } catch (err) {
    res.status(500).json({ message: "Update nahi hua" });
  }
};