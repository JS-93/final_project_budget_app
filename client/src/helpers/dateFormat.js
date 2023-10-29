export const formatDate = (isoString) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
    
      const suffixes = ["th", "st", "nd", "rd"];

      const date = new Date(isoString)
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hour = date.getHours();
      const minute = date.getMinutes();

      const daySuffix = suffixes[(day % 10) - 1] || suffixes[0];
      const formattedDay = `${day}${daySuffix}`;


      const hourFormatted = hour % 12 || 12;
      const minuteFormatted = minute < 10 ? `0${minute}` : minute;
      const amPM = hour < 12 ? 'am' : 'pm';

      return `${month} ${formattedDay} ${hourFormatted}:${minuteFormatted}${amPM}`;
}
