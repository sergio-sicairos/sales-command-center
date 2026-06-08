// lib/constants.js

// Current AE quotas (May 2026+)
export const AE_QUOTAS = {
  "Josh Jossart": 160000,
  "Devin McLaughlin": 160000,
  "Noah Post-Hyatt": 160000,
  "Alyssa Knight": 160000,
  "John White": 160000,
  "Agustin Yanez": 160000,
  "Sergio Sicairos": 160000,
  "Nano Schmidt": 160000,
  "Jenni Lee": 160000,
  "James Rheaume": 160000,
  "Nate Siebert": 96000,
  "Elias Ramirez": 0,
};

// Historical AE quotas by month (YYYY-MM)
const AE_QUOTAS_HISTORY = {
  "2026-04": {
    "Josh Jossart": 160000,
    "Devin McLaughlin": 96000,
    "Noah Post-Hyatt": 96000,
    "Alyssa Knight": 160000,
    "John White": 96000,
    "Agustin Yanez": 160000,
    "Sergio Sicairos": 160000,
    "Nano Schmidt": 160000,
    "Jenni Lee": 160000,
    "James Rheaume": 160000,
    "Nate Siebert": 0,
  },
};

export function getAEQuotas(monthParam) {
  return AE_QUOTAS_HISTORY[monthParam] || AE_QUOTAS;
}

// Current SDR quotas (May 2026+)
export const SDR_QUOTAS = {
  "Jesse Mon": 7,
  "London Vidaurri": 7,
  "Hemal Madaan": 7,
  "Chris Voith": 7,
  "Marianna Manolioudaki": 4,
  "Jaden Welborn": 4,
  "Willem Zook": 4,
  "Eve Thorsen": 4,
  "Jack Skerlj": 4,
  "Wossen Gedib": 4,
  "Donovan Swan": 7,
  "Tyler Parod": 7,
  "Izzy Weiss": 7,
};

// Historical SDR quotas by month (YYYY-MM)
const SDR_QUOTAS_HISTORY = {
  "2026-04": {
    "Jesse Mon": 4,
    "London Vidaurri": 4,
    "Hemal Madaan": 4,
    "Chris Voith": 7,
  },
};

export function getSDRQuotas(monthParam) {
  return SDR_QUOTAS_HISTORY[monthParam] || SDR_QUOTAS;
}

// Default quota for anyone not in the map
export const DEFAULT_AE_QUOTA = 160000;
export const SDR_MEETING_QUOTA = 10; // Default monthly meeting quota per SDR
export const SDR_TEAM_QUOTA = 105; // Company-level monthly SDR meeting goal
export const TEAM_GOAL = 2425000; // Company-level monthly ARR goal

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
  "Marianna Manolioudaki",
  "Jaden Welborn",
  "Willem Zook",
  "Eve Thorsen",
  "Jack Skerlj",
  "Wossen Gedib",
  "Donovan Swan",
  "Tyler Parod",
  "Izzy Weiss",
];

// Lead sources that count as SDR-booked meetings
export const SDR_LEAD_SOURCES = [
  "SDR Outbound",
  "Cold Outbound - Cold Call",
  "Cold Outbound - LinkedIn",
  "Cold Outbound - Email",
  "Cold Outbound - Community",
];
