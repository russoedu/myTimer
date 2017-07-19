class Format {
  static time(time) {
    const parts = time.split(":");
    if (parts.length === 1) {
      return (parts[0] * 1000);
    }
    if (parts.length === 2) {
      return (parts[0] * 1000 * 60 + parts[1] * 1000);
    }
    return (parts[0] * 1000 * 60 * 60 + parts[1] * 1000 * 60 + parts[2] * 1000);
  }

  static ordinal(num) {
    const j = num % 10;
    const k = num % 100;

    if (j == 1 && k != 11) {
      return num + "st";
    }
    if (j == 2 && k != 12) {
      return num + "nd";
    }
    if (j == 3 && k != 13) {
      return num + "rd";
    }
    return num + "th";
  }
}

module.exports = Format;
