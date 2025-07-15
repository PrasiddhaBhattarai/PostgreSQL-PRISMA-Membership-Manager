import express from "express";
import { membershipController } from "../controllers/membershipController.js";

const router = express.Router();

router.post("/:id", membershipController.addMembership);

// /api/memberships?page=2&pageSize=10&sortBy=startDate&order=desc
router.get("/", membershipController.getMembershipPagination);

router.get("/:id", membershipController.getMembershipById);
router.put("/:id", membershipController.updateMembership);
router.delete("/:id", membershipController.deleteMembership);

export default router;