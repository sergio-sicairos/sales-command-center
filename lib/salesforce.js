// lib/salesforce.js
// Server-side Salesforce client using Client Credentials OAuth flow
// Requires env vars: SF_CLIENT_ID, SF_CLIENT_SECRET, SF_LOGIN_URL

let cachedToken = null;
let tokenExpiry = 0;

export async function getSalesforceToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const loginUrl = process.env.SF_LOGIN_URL || "https://login.salesforce.com";
  const res = await fetch(`${loginUrl}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SF_CLIENT_ID,
      client_secret: process.env.SF_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Salesforce auth failed: ${err}`);
  }

  const data = await res.json();
  cachedToken = { accessToken: data.access_token, instanceUrl: data.instance_url };
  tokenExpiry = Date.now() + 3500 * 1000; // refresh ~1hr
  return cachedToken;
}

export async function soql(query) {
  const { accessToken, instanceUrl } = await getSalesforceToken();
  const url = `${instanceUrl}/services/data/v59.0/query?q=${encodeURIComponent(query)}`;

  let allRecords = [];
  let nextUrl = url;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`SOQL failed: ${err}`);
    }
    const data = await res.json();
    allRecords = allRecords.concat(data.records || []);
    nextUrl = data.nextRecordsUrl ? `${instanceUrl}${data.nextRecordsUrl}` : null;
  }

  return allRecords;
}
