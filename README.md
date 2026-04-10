# Sales Command Center

Real-time AE & SDR performance dashboard powered by Salesforce data.

## Architecture

```
Browser → Next.js Frontend → /api/dashboard → Salesforce REST API (SOQL)
```

- **Frontend**: React dashboard with AE ARR tracking + SDR meeting metrics
- **API Route**: Server-side SOQL queries with OAuth token caching
- **Data Source**: Salesforce directly (Opportunity_ARR__c field for ARR)
- **No MCP dependency**: Runs standalone on Vercel without any connector auth

## Setup

### 1. Salesforce Connected App

1. In Salesforce: **Setup → App Manager → New Connected App**
2. Enable OAuth Settings
3. Add scope: `full` (or `api refresh_token`)
4. Set callback URL: `https://login.salesforce.com/services/oauth2/callback`
5. Save and copy **Consumer Key** and **Consumer Secret**

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `SF_CLIENT_ID` | Connected App Consumer Key |
| `SF_CLIENT_SECRET` | Connected App Consumer Secret |
| `SF_USERNAME` | Salesforce login email |
| `SF_PASSWORD` | Salesforce password |
| `SF_SECURITY_TOKEN` | Security token (from Salesforce email) |
| `SF_LOGIN_URL` | `https://login.salesforce.com` (or `https://test.salesforce.com` for sandbox) |

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy to Vercel

```bash
# Push to GitHub, then in Vercel:
# 1. Import the repo
# 2. Add all SF_ env vars in Vercel project settings
# 3. Deploy
```

Or use the Vercel CLI:
```bash
npx vercel --prod
```

## Configuration

Edit `lib/constants.js` to update:
- **AE_ROSTER**: Add/remove AEs (must match Salesforce `Owner.Name` exactly)
- **AE_QUOTA**: Monthly ARR quota per AE (default: $160,000)
- **SDR_MEETING_QUOTA**: Monthly meeting quota (default: 20)
- **SDR_LEAD_SOURCES**: Lead sources that count as SDR meetings

## SOQL Queries

The dashboard runs 3 queries on each load:

1. **Closed Won ARR**: All `Closed Won` + `New Business` opps where `CloseDate` is in the current month, grouped by `Owner.Name`, summing `Opportunity_ARR__c`
2. **Open Pipeline**: All non-closed `New Business` opps
3. **SDR Meetings**: All `New Business` opps with SDR lead sources, created this month

All queries auto-paginate through Salesforce's 2,000-record limit per page.
