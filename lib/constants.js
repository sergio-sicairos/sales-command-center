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
export const SDR_MEETING_QUOTA = 20; // Monthly meeting quota per SDR/AE

// Lead sources that count as SDR-booked meetings
export const SDR_LEAD_SOURCES = [
  "SDR Outbound",
  "Cold Outbound - Cold Call",
  "Cold Outbound - LinkedIn",
  "Cold Outbound - Email",
  "Cold Outbound - Community",
];
