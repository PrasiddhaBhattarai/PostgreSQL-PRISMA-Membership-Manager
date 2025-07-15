function newDateConverter(strDate) {
    const [year, month, day] = strDate.split("-").map(Number);
    //.map(Number) converts each item in an array to a number

    // month is 0 indexed, 0 -> January
    const localDate = new Date(year, month -1, day);
    return localDate;
}

function checkPastDate(localDate){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // today variable becomes exactly midnight at the start of the day (e.g., 2025-05-15T00:00:00.000)
    return(localDate < today);
}

function newDateConverterAndValidate(strDate){
    // Regex to check format YYYY-MM-DD
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(strDate)) return null;

    const localDate = newDateConverter(strDate);

    if (checkPastDate(localDate)) return null;

    return localDate;
}

export {newDateConverterAndValidate};