// this is to prevent sql injection

const checkMemberSortFields = (sortBy) => {
    const allowedMemberFields = ["name", "email", "id"];
    if (!allowedMemberFields.includes(sortBy)) {
        return "name";
    }
    return sortBy;
}

const checkMembershipSortFields = (sortBy) => {
    const allowedMembershipFields =["startDate", "endDate", "id"];
    if (!allowedMembershipFields.includes(sortBy)) {
        return "endDate";
    }
    return sortBy;
}

export {
    checkMemberSortFields,
    checkMembershipSortFields
}