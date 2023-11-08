export const formatDate = (isoString) => {
    const date = new Date(isoString);

  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }); 
  const dayOfMonth = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' }); 
  const year = date.getFullYear();
  

 
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const ordinalSuffix = getOrdinalSuffix(dayOfMonth);


  return `${dayOfWeek}, ${month} ${dayOfMonth}${ordinalSuffix}, ${year}`;
};


export const dateFormatDate = (isoString) => {


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
   

   
    let daySuffix = "th";
    const lastDigit = day % 10;
    if (lastDigit > 0 && lastDigit <= 3 && (day < 11 || day > 13)) {
        daySuffix = suffixes[lastDigit - 1];
    }
    const formattedDay = `${day}${daySuffix}`;

    

    return `${month} ${formattedDay}, ${year}`;

}
