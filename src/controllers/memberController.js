import { memberService } from "../services/memberService.js";
import { checkMemberSortFields } from "../helpers/allowedSortFields.js";

const addMember = async (req, res) => {
    try {
        const { name, email } = req.body;
        // if any of two fields are absent or empty string is sent, error
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email must not be empty.",
            });
        }

        const newMember = await memberService.addMember(name, email);
        if (!newMember) {
            throw new Error("Member creation failed");
        }
        res.status(201).json({
            success: true,
            message: "Member created successfully",
            newMember
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

const getMemberById = async (req, res) => {
    try {
        const memberId = parseInt(req.params.id);
        const member = await memberService.getMemberById(memberId);
        if (member) {
            res.status(200).json({
                success: true,
                message: "Member/s fetched successfully",
                member
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No member matched"
            });
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

const getMembersPagination = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = Math.min(50, parseInt(req.query.pageSize) || 10);
        const sortBy = checkMemberSortFields(req.query.sortBy)
        const order = req.query.order === 'desc' ? 'desc' : 'asc';

        const members = await memberService.getMembersPagination(page, pageSize, sortBy, order);
        if (members.length !== 0) {
            res.status(200).json({
                success: true,
                pageDetails:{page, pageSize},
                message: "Member/s fetched successfully",
                members
            });
        } else {
            res.status(200).json({
                success: false,
                message: "members empty"
            });
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

const updateMember = async (req, res) => {
    try {
        const memberId = parseInt(req.params.id);
        const { newName, newEmail } = req.body;

        // if both fields are absent or empty string is sent, error
        if (!newName && !newEmail) {
            return res.status(400).json({
                success: false,
                message: "Name or email must not be empty.",
            });
        }

        const updatedMember = await memberService.updateMember(memberId, newName, newEmail);

        res.status(200).json({
            success: true,
            message: "Member updated successfully",
            updatedMember
        });

    } catch (e) {
        //when no member found for given memberId
        if (e.message.includes("not found")) {
            res.status(404).json({
                success: false,
                message: e.message
            })
        }
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

const deleteMember = async (req, res) => {
    try {
        const memberId = parseInt(req.params.id);
        const deletedMember = await memberService.deleteMember(memberId);

        res.status(200).json({
            success: true,
            message: "Member updated successfully",
            deletedMember
        });

    } catch (e) {
        if (e.message.includes("not found")) {
            res.status(404).json({
                success: false,
                message: e.message
            })
        }
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

export const memberController = {
    addMember,
    getMemberById,
    getMembersPagination,
    updateMember,
    deleteMember
};