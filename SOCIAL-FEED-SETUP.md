# Social Feed Setup Guide
## Facebook + Instagram Graph API → GitHub Actions → `social-cache.json`

This guide gets you from zero to working tokens. Follow each step in order.
Estimated time: **45–60 minutes**.

---

## Prerequisites Checklist

Before starting, confirm all of these are true:

- [ ] You have admin access to the **Casa de España Facebook Page** (`facebook.com/CasadeEspanaIN`)
- [ ] The Facebook Page has an **Instagram Business or Creator account linked** to it
  - To check: Facebook Page → Settings → Linked Accounts → Instagram
  - If not linked: go to Instagram → Settings → Account → Switch to Professional → Connect to Facebook Page
- [ ] You have a **personal Facebook account** that is an Admin of the Page
- [ ] You have access to the **GitHub repository** settings (to add Secrets)

---

## Part 1 — Create a Facebook Developer App

### Step 1: Go to Meta for Developers

1. Open [https://developers.facebook.com](https://developers.facebook.com)
2. Click **Log In** (top right) — use your personal Facebook account that administers the Page
3. If this is your first time, click **Get Started** and follow the brief onboarding

### Step 2: Create a New App

1. Click **My Apps** (top right) → **Create App**
2. Select use case: **"Other"** → click Next
3. Select app type: **"Business"** → click Next
4. Fill in:
   - **App Name**: `Casa de España Feed` (or any name)
   - **App contact email**: `info@casaespanaindiana.org`
   - **Business Account**: Select your Business account if prompted, or leave blank
5. Click **Create App** — Facebook may ask you to re-enter your password

### Step 3: Add the Instagram Product

1. Inside your new app dashboard, scroll down to **"Add Products to Your App"**
2. Find **Instagram** → click **Set Up**
3. On the left sidebar you should now see **Instagram** under your app

### Step 4: Add the Facebook Login Product (needed for token generation)

1. Back on the dashboard, find **Facebook Login** → click **Set Up**
2. Choose **"Web"** when asked for platform
3. Enter Site URL: `https://casaespanaindiana.org`
4. Click **Save** and continue through the setup (you can skip the optional steps)

---

## Part 2 — Get Your IDs

### Step 5: Find Your Facebook Page ID

1. Go to your Facebook Page: `https://www.facebook.com/CasadeEspanaIN`
2. Click **About** (in the left sidebar or under the Page name)
3. Scroll to the bottom of the About section — you'll see **Page ID** (a long number like `123456789012345`)
4. **Copy and save this number** — this is your `FACEBOOK_PAGE_ID`

   > Alternatively: Go to [https://www.facebook.com/CasadeEspanaIN/about](https://www.facebook.com/CasadeEspanaIN/about) and look in the URL or page source for `page_id`.

### Step 6: Find Your Instagram Business Account ID

You'll get this after generating a token in Part 3. Skip for now — come back here.

---

## Part 3 — Generate a Short-Lived User Access Token

### Step 7: Use the Graph API Explorer

1. Go to [https://developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. In the top right of the Explorer:
   - **Meta App**: Select the app you just created (`Casa de España Feed`)
   - **User or Page**: Select **"User Token"**
3. Click **"Generate Access Token"**
4. A permissions dialog will appear. **Add these permissions** by typing each one in the search box and checking it:
   - `pages_show_list`
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish` *(optional, skip if not listed)*
5. Click **"Generate Access Token"** — approve all the permissions Facebook asks about
6. Copy the token that appears in the **Access Token field** — it starts with `EAAB...`

   > This is a **short-lived token** (1 hour). Don't save this anywhere yet — you'll extend it in the next step.

---

## Part 4 — Convert to a Long-Lived Token

Short-lived tokens expire in 1 hour. You need a **long-lived token** (60 days) for GitHub Actions.

### Step 8: Find Your App ID and App Secret

1. In your app dashboard, click **App Settings** → **Basic** (left sidebar)
2. Copy:
   - **App ID** (shown at the top, ~15 digits)
   - **App Secret** (click **Show** next to it, ~32 character hex string)
3. Keep this tab open — you'll need these values

### Step 9: Exchange for a Long-Lived Token

Open a new browser tab and paste this URL, replacing the three values:

```
https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_LIVED_TOKEN
```

Example:
```
https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=123456789&client_secret=abc123def456&fb_exchange_token=EAAB...
```

Press Enter. You'll get a JSON response like:
```json
{
  "access_token": "EAAB...very_long_string...",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

**Copy the `access_token` value** — this is your long-lived User Access Token (~60 days).

---

## Part 5 — Get a Never-Expiring Page Access Token

The long-lived User token expires in 60 days. For the Facebook Page feed, you want a **Page Access Token** that never expires.

### Step 10: Get Page Access Token

In the Graph API Explorer ([https://developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)):

1. Paste your **long-lived User token** into the Access Token field
2. In the query field, type:
   ```
   /me/accounts
   ```
3. Click **Submit**
4. Find your Casa de España page in the results. Copy:
   - `"id"` — this confirms your **FACEBOOK_PAGE_ID**
   - `"access_token"` — this is your **Page Access Token** (never expires as long as you are a Page admin)

**Save this `access_token`** — this is your `FACEBOOK_PAGE_ACCESS_TOKEN`.

---

## Part 6 — Get Your Instagram User ID

### Step 11: Find Instagram Business Account ID

In the Graph API Explorer, with your **Page Access Token** active:

1. Query:
   ```
   /YOUR_FACEBOOK_PAGE_ID?fields=instagram_business_account
   ```
   Replace `YOUR_FACEBOOK_PAGE_ID` with your actual Page ID.

2. You'll get:
   ```json
   {
     "instagram_business_account": {
       "id": "17841400000000000"
     },
     "id": "123456789012345"
   }
   ```

3. Copy the `instagram_business_account.id` — this is your `INSTAGRAM_USER_ID`.

### Step 12: Verify Instagram Token Works

In the Explorer, switch back to your **long-lived User Access Token**, then query:

```
/YOUR_INSTAGRAM_USER_ID/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=4
```

You should see your last 4 Instagram posts as JSON. If you see data, the token works.

---

## Part 7 — Add Tokens to GitHub Secrets

### Step 13: Add Secrets to the Repository

1. Go to your GitHub repository: `https://github.com/w1ldr1/CasaDeEspanaTest`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** for each of the following:

| Secret Name | Value |
|---|---|
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived User Access Token from Step 9 |
| `INSTAGRAM_USER_ID` | Instagram Business Account ID from Step 11 |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Page Access Token from Step 10 |
| `FACEBOOK_PAGE_ID` | Facebook Page ID from Step 5 |

4. Repeat for the **production repo**: `https://github.com/w1ldr1/w1ldr1.github.io` → Settings → Secrets → Actions → add the same 4 secrets.

---

## Part 8 — Token Refresh Strategy

### Instagram token (expires in 60 days)

A GitHub Actions workflow will auto-refresh it monthly by calling:
```
https://graph.facebook.com/v19.0/oauth/access_token?grant_type=ig_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&access_token=CURRENT_TOKEN
```
I'll set this up in the code.

### Facebook Page token (never expires)

No refresh needed as long as you remain a Page admin and don't revoke app permissions.

### If tokens ever stop working

1. Go back to the Graph API Explorer
2. Generate a new short-lived token → exchange for long-lived (Steps 7–9)
3. Get a new Page token (Step 10)
4. Update the GitHub Secrets

---

## Part 9 — Verify Everything

### Step 14: Test in Graph API Explorer

Before proceeding, confirm these queries return real data:

**Instagram posts:**
```
GET /{INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=4
```
(use User Access Token)

**Facebook page posts:**
```
GET /{FACEBOOK_PAGE_ID}/posts?fields=message,full_picture,permalink_url,created_time&limit=4
```
(use Page Access Token)

Both should return JSON arrays with your actual posts. Screenshot or note the response shape.

---

## Summary — Values to Send

Once done, you'll have collected these 4 values. You can paste them directly as GitHub Secrets — **do not share them anywhere else** (not email, not Slack, not a doc):

```
INSTAGRAM_ACCESS_TOKEN   = EAAB...
INSTAGRAM_USER_ID        = 17841400000000000
FACEBOOK_PAGE_ACCESS_TOKEN = EAAB...
FACEBOOK_PAGE_ID         = 123456789012345
```

Once all 4 secrets are in GitHub, let me know and I'll write the fetch script, Actions workflow, and site section.

---

## Common Errors

| Error | Fix |
|---|---|
| `#200 Permissions error` | Make sure you added all 3 permissions in Step 7 |
| `instagram_business_account` not in response | Instagram account not linked to the Facebook Page — link it first (see Prerequisites) |
| `/me/accounts` returns empty array | Your personal account is not an admin of the Page |
| Page token shows but IG query fails | The IG account must be a **Business** or **Creator** account, not Personal |
| `Invalid OAuth access token` | Token expired — re-run Steps 7–9 |
