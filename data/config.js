// Commute settings (hand-edited; scripts/update_schedules.py never touches this file).
// Drive and walk minutes are estimates; tune them to taste.
// Line colors live in index.html (CSS variables --NCS, --MDN, --UPNW).
window.COMMUTE_CONFIG = {
  lines: {
    NCS:  { name: "North Central Service",   short: "NCS",   station: "Mundelein",        terminal: "Union Station", driveMin: 15, walkMin: 12 },
    MDN:  { name: "Milwaukee District North", short: "MD-N",  station: "Prairie Crossing", terminal: "Union Station", driveMin: 20, walkMin: 12 },
    UPNW: { name: "Union Pacific Northwest",  short: "UP-NW", station: "Barrington",       terminal: "Ogilvie", driveMin: 20, walkMin: 10 }
  },
  parkBufferMin: 5, // park the car and get to the platform (morning only)
  window: {
    toWork: { leaveHomeAfter: "06:00", arriveWorkBy: "09:30" },
    toHome: { leaveWorkAfter: "15:30", arriveHomeBy: "19:00" }
  }
};
