class Time {
  static milisecondsFromString(time) {
    const parts = time.split(":");
    if (parts.length === 1) {
      return (parts[0] * 1000);
    }
    if (parts.length === 2) {
      return (parts[0] * 1000 * 60 + parts[1] * 1000);
    }
    return (parts[0] * 1000 * 60 * 60 + parts[1] * 1000 * 60 + parts[2] * 1000);
  }

  static stringFromMiliseconds(time) {
    let mili = time;

    let hours = Math.floor(mili / 1000 / 60 / 60);
    mili -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(mili / 1000 / 60);
    mili -= minutes * 1000 * 60;
    let seconds = Math.floor(mili / 1000);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
       hours = hours + 24;

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes + ':' + (seconds <= 9 ? "0" : "") + seconds;
  }

  static diffFromString(start, end) {
    start = start.split(":");
    end = end.split(":");
    const startDate = new Date(0, 0, 0, start[0], start[1], 0);
    const endDate = new Date(0, 0, 0, end[0], end[1], 0);
    return endDate.getTime() - startDate.getTime();
  }

  static distribute(quantity, startTime, endTime) {
    const diff = Time.diffFromString(startTime, endTime);
    const averageTime = diff / quantity;
    const averageTimeString = Time.stringFromMiliseconds(averageTime);
    return new Array(quantity).fill(averageTimeString);
  }
}

module.exports = Time;
