import express from "express";
import {
  addReminder,
  allReminders,
  editReminder,
  singleReminder,
} from "../controllers/reminderController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/add-update").post(authenticateUser, addReminder);
router.route("/allReminders").get(authenticateUser, allReminders);
router
  .route("/singleReminder/:id")
  .get(authenticateUser, singleReminder)
  .patch(authenticateUser, editReminder);

export default router;
