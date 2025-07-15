import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addMember(name, email) {
    try {
        const newMember = await prisma.member.create({
            data: {
                name,
                email,
            }
        });
        return newMember;

    } catch (error) {
        console.error("error in adding member, ", error);
        throw error;
    }
}

async function getMemberById(memberId) {
    try {
        const fetchedMember = await prisma.member.findUnique({
            where: { id: memberId },
            include: { memberships: true },
        });
        //when include is used
        //clog(fetchedMember.memberships.startDate);
        return fetchedMember;

    } catch (error) {
        console.error(`Error in fetchig member with Id ${memberId}. `, error);
        throw error;
    }
}

// fetch members by pagination
async function getMembersPagination(page, pageSize, sortBy,order = 'asc') {
    try {
        const fetchedMembers = await prisma.member.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { 
                [sortBy]: order
            },
            include: {
                memberships: true,
            },
        });
        return fetchedMembers;

    } catch (error) {
        console.error("error in fetching members, ", error);
        throw error;
    }
}

async function updateMember(memberId, newName, newEmail) {
    try {
        // fetched existing data
        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
        });
        if (!existingMember) {
            throw new Error(`Member with ID ${memberId} not found.`);
        }

        const updatedMembers = await prisma.member.update({
            where: { id: memberId },
            data: {
                name: newName ?? existingMember.name,
                email: newEmail ?? existingMember.email,
            },
            include: {
                memberships: true,
            },
        });
        // '??' is the nullish coalescing operator — it uses the existing value if newName or newEmail is null or undefined.
        // But If newName is provided (even if it's an empty string), it will be used.

        return updatedMembers;

        // next way
        //using transaction
        //-> transaction is used to wrap multiple db operation into a single transaction
        // 
        // tx = the transaction-aware Prisma client passed into the callback function automatically by Prisma. You can name it whatever you want, but tx is the common convention.
        
        // const updatedMembers1 = await prisma.$transaction(async (tx) => {
        //     const member = await tx.member.findUnique({
        //         where: { id: memberId },
        //     });
        //     if (!member) {
        //         throw new Error(`Member with ID ${memberId} not found.`);
        //     }
        //     return tx.member.update({
        //         where: { id: memberId },
        //         data: {
        //             name: newName ?? member.name,
        //             email: newEmail ?? member.email,
        //         },
        //         include: {
        //             memberships: true,
        //         },
        //     })
        // });

        

    } catch (error) {
        console.error(`Error in updating member with Id ${memberId}. `, error);
        throw error;
    }
}

async function deleteMember(memberId) {
    try {
        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
        });
        if (!existingMember) {
            throw new Error(`Member with ID ${memberId} not found.`);
        }
        
        const deletedMember = await prisma.member.delete({
            where : {id : memberId},
            include : { memberships : true},
        })
        return deletedMember;

    } catch (e) {
        console.error(`Error in deleting member with Id ${memberId}. `, e);
        throw e
    }
}

export const memberService = {
    addMember,
    getMemberById,
    getMembersPagination,
    updateMember,
    deleteMember
};