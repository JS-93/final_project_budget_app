export const formatDate = (isoString) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const suffixes = ["th", "st", "nd", "rd"];

   
    const date = new Date(isoString);
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

    const day = localDate.getDate();
    const monthIndex = localDate.getMonth();
    const month = months[monthIndex];
    const year = localDate.getFullYear();
    const hour = localDate.getHours();
    const minute = localDate.getMinutes();

   
    let daySuffix = "th";
    const lastDigit = day % 10;
    if (lastDigit > 0 && lastDigit <= 3 && (day < 11 || day > 13)) {
        daySuffix = suffixes[lastDigit - 1];
    }
    const formattedDay = `${day}${daySuffix}`;

    
    const hourFormatted = hour % 12 || 12;
    const minuteFormatted = minute < 10 ? `0${minute}` : minute;
    const amPM = hour < 12 ? 'AM' : 'PM';


    return `${month} ${formattedDay}, ${year} ${hourFormatted}:${minuteFormatted}${amPM}`;
};
