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
  "Dan Malkary": 12,
  "Julia McCullough": 12,
  "James Krepelka": 10,
  "Solomon Bandy": 10,
  "Chris Voith": 9,
  "Colby Keces": 12,
  "Jack Dudzik": 12,
  "Austin Kuo": 10,
  "Ross DeRose": 10,
  "Luke Singer": 10,
  "Matthew Hafizi": 9,
  "Jesse Mon": 10,
  "London Vidaurri": 10,
  "Hemal Madaan": 10,
  "Marianna Manolioudaki": 7,
  "Jaden Welborn": 7,
  "Eve Thorsen": 7,
  "Jack Skerlj": 7,
  "Wossen Gedib": 7,
  "Donovan Swan": 7,
  "Tyler Parod": 7,
  "Izzy Weiss": 7,
  "Shwetha Rajmohan": 4,
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
export const SDR_TEAM_QUOTA = 213; // Company-level monthly SDR meeting goal
export const TEAM_GOAL = 2425000; // Company-level monthly ARR goal (default)

// Monthly team goals by month (YYYY-MM)
const TEAM_GOALS_HISTORY = {
  "2026-07": 4700000,
};

export function getTeamGoal(monthParam) {
  return TEAM_GOALS_HISTORY[monthParam] || TEAM_GOAL;
}

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
