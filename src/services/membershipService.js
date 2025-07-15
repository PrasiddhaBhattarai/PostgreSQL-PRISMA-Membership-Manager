import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

async function addMembership(startDate, endDate, memberId) {
    try {
        const newMembership = await prisma.membership.create({
            data : {
                startDate,
                endDate,
                member : {
                    connect : { id : memberId}
                }
            },
            include : {
                member : true
            }
        });
        return newMembership;

    } catch (e) {
        console.error("error in adding membership, ", e);
        throw e;
    }
}

async function getMembershipById(membershipId) {
    try {
        const membershipById = await prisma.membership.findUnique({
            where: { id: membershipId },
            include: {member: true},
        });
        if (!membershipById) {
            throw new Error(`Membership with ID ${membershipId} not found.`);
        }
        return membershipById;
        
    } catch (e) {
        console.error(`Error in loading membership with Id ${memberId}. `, e);
        throw e
    }
}

async function getMembershipPagination(page, pageSize, sortBy,order = 'asc') {
    try {
        const fetchedMemberships = await prisma.membership.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { 
                [sortBy]: order
            },
            include: {
                member: true,
            },
        });
        return fetchedMemberships;

    } catch (error) {
        console.error("error in fetching membership by pagination, ", error);
        throw error;
    }
}

async function updateMembership(membershipId, newStartDate, newEndDate) {
    try {
        const existingMembership = await prisma.membership.findUnique({
            where: { id: membershipId },
        });
        if (!existingMembership) {
            throw new Error(`Membership with ID ${membershipId} not found.`);
        }
        
        const updatedMembership = await prisma.membership.update({
            where: { id: membershipId },
            data: {
                startDate: newStartDate ?? existingMembership.startDate,
                endDate: newEndDate ?? existingMembership.endDate,
            },
            include: {
                member: true,
            },
        });

        return updatedMembership;
        
    } catch (e) {
        console.error(`Error in updating membership with Id ${memberId}. `, e);
        throw e
    }
}

async function deleteMembership(membershipId) {
    try {
        const existingMembership = await prisma.membership.findUnique({
            where: { id: membershipId },
        });
        if (!existingMembership) {
            throw new Error(`Membership with ID ${membershipId} not found.`);
        }
        
        const deletedMembership = await prisma.membership.delete({
            where : {id : membershipId},
            include : { member : true},
        })
        return deletedMembership;

    } catch (e) {
        console.error(`Error in deleting membership with Id ${memberId}. `, e);
        throw e
    }
}

export const membershipService = {
    addMembership,
    getMembershipById,
    getMembershipPagination,
    updateMembership,
    deleteMembership
}