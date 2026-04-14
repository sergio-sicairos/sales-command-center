// lib/constants.js

// Per-AE monthly quota — most are $160K, some are ramping
export const AE_QUOTAS = {
  "Josh Jossart": 160000,
  "Devin McLaughlin": 96000,
  "Noah Post-Hyatt": 96000,
  "Alyssa Knight": 160000,
  "John White": 96000,
  "Agustin Yanez": 160000,
  "Sergio Sicairos": 160000,
  "Nano Schmidt": 160000,
  "Jenni Lee": 160000,
  "Swasthi Malladi": 160000,
  "Meghan Ministri": 160000,
  "James Rheaume": 160000,
  "Blanchard Kenfack": 160000,
  "Nate Siebert": 0,
};

// Default quota for anyone not in the map
export const DEFAULT_AE_QUOTA = 160000;
export const SDR_MEETING_QUOTA = 10; // Default monthly meeting quota per SDR
export const SDR_TEAM_QUOTA = 105; // Company-level monthly SDR meeting goal
export const TEAM_GOAL = 1900000; // Company-level monthly ARR goal

// Per-SDR monthly meeting quota overrides (default is SDR_MEETING_QUOTA)
export const SDR_QUOTAS = {
  "Jesse Mon": 4,
  "London Vidaurri": 4,
  "Hemal Madaan": 4,
};

// Full SDR roster — ensures all SDRs appear even with 0 meetings
export const SDR_ROSTER = [
  "Dan Malkary",
  "Julia McCullough",
  "James Krepelka",
  "Solomon Bandy",
  "Chris Voith",
  "Colby Keces",
  "Jack Dudzik",
  "Austin Kuo",
  "Ross DeRose",
  "Luke Singer",
  "Matthew Hafizi",
  "Jesse Mon",
  "London Vidaurri",
  "Hemal Madaan",
];

// Lead sources that count as SDR-booked meetings
export const SDR_LEAD_SOURCES = [
  "SDR Outbound",
  "Cold Outbound - Cold Call",
  "Cold Outbound - LinkedIn",
  "Cold Outbound - Email",
  "Cold Outbound - Community",
];
