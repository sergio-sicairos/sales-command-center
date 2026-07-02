// lib/constants.js

// Current AE quotas (Quarterly - Q2 2026+)
export const AE_QUOTAS = {
  "Josh Jossart": 450000,
  "Devin McLaughlin": 450000,
  "Noah Post-Hyatt": 450000,
  "Alyssa Knight": 450000,
  "John White": 450000,
  "Agustin Yanez": 450000,
  "Sergio Sicairos": 500000,
  "Nano Schmidt": 450000,
  "Jenni Lee": 450000,
  "James Rheaume": 450000,
  "Nate Siebert": 450000,
  "Elias Ramirez": 300000,
  "Dan Malkary": 150000,
  "Julia McCullough": 150000,
  "Chris Voith": 150000,
  "Colby Keces": 150000,
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
  "James Krepelka": 10,
  "Solomon Bandy": 10,
  "Jack Dudzik": 12,
  "Austin Kuo": 10,
  "Ross DeRose": 10,
  "Luke Singer": 10,
  "Matthew Hafizi": 12,
  "Jesse Mon": 10,
  "London Vidaurri": 10,
  "Hemal Madaan": 10,
  "Marianna Manolioudaki": 10,
  "Jaden Welborn": 10,
  "Eve Thorsen": 10,
  "Jack Skerlj": 10,
  "Wossen Gedib": 10,
  "Donovan Swan": 10,
  "Tyler Parod": 10,
  "Izzy Weiss": 10,
  "Shwetha Rajmohan": 7,
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

// Default quota for anyone not in the map (Quarterly)
export const DEFAULT_AE_QUOTA = 450000;

// Ramp quotas - for display purposes
export const RAMP_QUOTAS = {
  "Elias Ramirez": true,
  "Dan Malkary": true,
  "Julia McCullough": true,
  "Chris Voith": true,
  "Colby Keces": true,
  "Shwetha Rajmohan": true,
};
export const SDR_MEETING_QUOTA = 10; // Default monthly meeting quota per SDR
export const SDR_TEAM_QUOTA = 213; // Company-level monthly SDR meeting goal
export const TEAM_GOAL = 2425000; // Company-level monthly ARR goal (default)

// Quarterly team goals by quarter (YYYY-MM) - Q3 goal: $5,500,000
const TEAM_GOALS_HISTORY = {
  "2026-07": 5500000,
  "2026-08": 5500000,
  "2026-09": 5500000,
};

export function getTeamGoal(monthParam) {
  return TEAM_GOALS_HISTORY[monthParam] || TEAM_GOAL;
}

// Full SDR roster — ensures all SDRs appear even with 0 meetings
export const SDR_ROSTER = [
  "James Krepelka",
  "Solomon Bandy",
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
  "Eve Thorsen",
  "Jack Skerlj",
  "Wossen Gedib",
  "Donovan Swan",
  "Tyler Parod",
  "Izzy Weiss",
  "Shwetha Rajmohan",
];

// Map display names to Salesforce owner names (for cases where they differ)
export const SALESFORCE_NAME_MAP = {
  "Izzy Weiss": "Isabel Weiss",
};

// Lead sources that count as SDR-booked meetings
export const SDR_LEAD_SOURCES = [
  "SDR Outbound",
  "Cold Outbound - Cold Call",
  "Cold Outbound - LinkedIn",
  "Cold Outbound - Email",
  "Cold Outbound - Community",
];
