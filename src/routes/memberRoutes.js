import express from "express";
import { memberController } from "../controllers/memberController.js";

const router = express.Router();

router.post("/", memberController.addMember);

// /api/member?page=1&pageSize=10&sortBy=name&order=desc
router.get("/", memberController.getMembersPagination);

// /api/member/1
router.get("/:id", memberController.getMemberById);
router.put("/:id", memberController.updateMember);
router.delete("/:id", memberController.deleteMember);


export default router;