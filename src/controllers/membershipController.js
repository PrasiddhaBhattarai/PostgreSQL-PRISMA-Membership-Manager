import { membershipService } from "../services/membershipService.js";
// to change date string into local time new Date() and validate it
import { newDateConverterAndValidate } from "../helpers/newDateConverter.js";
// predefine fields to prevent sql injection
import { checkMembershipSortFields } from "../helpers/allowedSortFields.js";
import { memberService } from "../services/memberService.js";

const addMembership = async (req, res) => {
    try {
        const memberId = parseInt(req.params.id);
        // dates are in format "2025-06-01"
        // they're extracted from json and in string dataType
        const { startDate, endDate } = req.body;

        // all fields are required
        if (!startDate || !endDate ||
            (isNaN(memberId) || memberId <= 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "fields missing or invalid.",
            });
        }

        // following method follow UTC time zone
        // const _startDate = new Date(startDate);

        //for local time
        const _startDate = newDateConverterAndValidate(startDate);
        const _endDate = newDateConverterAndValidate(endDate);
        // but Prisma saves the .toISOString() version (UTC) to your DB.
        // ("2025-05-15") is saved as 2025-05-14T18:15:00.000Z

        if (!_startDate || !_endDate) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Expected format: YYYY-MM-DD"
            });
        }

        const newMembership = await membershipService.addMembership(_startDate, _endDate, memberId);

        if (!newMembership) {
            throw new Error("Membership creation failed");
        }

        res.status(201).json({
            success: true,
            message: "Membership registered successfully",
            newMembership
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            error: e.message
        })
    }
}

const getMembershipById = async (req, res) => {
    try {
        const membershipId = parseInt(req.params.id);
        const membership = await membershipService.getMembershipById(membershipId);

        res.status(200).json({
            success: true,
            message: "Membership fetched successfully",
            membership
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

const getMembershipPagination = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const pageSize = Math.min(50, parseInt(req.query.pageSize) || 10);
        const sortBy = checkMembershipSortFields(req.query.sortBy);
        const order = req.params.order === "desc" ? "desc" : "asc";

        const memberships = await membershipService.getMembershipPagination(page, pageSize, sortBy, order);
        if (memberships.length !== 0) {
            res.status(200).json({
                success: true,
                pageDetails: {page, pageSize},
                message: "Membership/s fetched successfully",
                memberships
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

const updateMembership = async (req, res) => {
    try {
        const membershipId = parseInt(req.params.id);
        // dates are in format "2025-06-01"
        // they're extracted from json and in string dataType
        const { startDate, endDate } = req.body;

        // check for id
        if (isNaN(membershipId) || membershipId <= 0) {
            return res.status(400).json({
                success: false,
                message: "membershipId is missing or invalid.",
            });
        }

        // fetch existingMembership before update
        const existingMembership = await membershipService.getMembershipById(membershipId)
        let _startDate = existingMembership.startDate;
        let _endDate = existingMembership.endDate;

        // if startDate provided or not
         if (startDate) {
            const parsedStart = newDateConverterAndValidate(startDate);
            if (!parsedStart) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid startDate format. Expected format: YYYY-MM-DD"
                });
            }
            _startDate = parsedStart;
        }

        // if endDate provided not not
        if (endDate) {
            const parsedEnd = newDateConverterAndValidate(endDate);
            if (!parsedEnd) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid endDate format. Expected format: YYYY-MM-DD"
                });
            }
            _endDate = parsedEnd;
        }

        const newMembership = await membershipService.updateMembership(membershipId, _startDate, _endDate);

        if (!newMembership) {
            throw new Error("Membership creation failed");
        }

        res.status(201).json({
            success: true,
            message: "Membership updated successfully",
            newMembership
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
            error: e.message
        })
    }
};

const deleteMembership = async (req, res) => {
    try {
        const memberId = parseInt(req.params.id);

        const deletedMembership = await membershipService.deleteMembership(memberId);

        res.status(200).json({
            success: true,
            message: "Member deleted successfully",
            deletedMembership
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

export const membershipController = {
    addMembership,
    getMembershipById,
    getMembershipPagination,
    updateMembership,
    deleteMembership
}