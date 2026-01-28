# Daily Task Updater

Automatically fetch tasks from ClickUp and send a daily update to Google Chat using GitHub Actions.

## Features

- 📋 Fetches tasks from ClickUp API
- 🤖 Runs on a scheduled cron (default: 9 AM UTC daily)
- 💬 Sends formatted message to Google Chat
- 🚀 Zero-dependency date handling (native JavaScript)
- 🔐 Secure environment variable management

## Setup

### 1. GitHub Repository Setup

Push this project to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/dailyTaskUpdater.git
git branch -M main
git push -u origin main
```

### 2. Add GitHub Secrets

Go to your repository **Settings → Secrets and variables → Actions** and add:

| Secret Name | Value |
|---|---|
| `CLICKUP_API_TOKEN` | Your ClickUp API token |
| `LIST_ID` | Your ClickUp list ID |
| `GOOGLE_CHAT_WEBHOOK_URL` | Your Google Chat webhook URL |

#### How to get these values:

**ClickUp API Token:**
1. Go to https://app.clickup.com/settings/integrations
2. Click "Create app"
3. Copy your API Token

**List ID:**
1. Go to ClickUp and open your list
2. Copy the ID from the URL: `clickup.com/l/{LIST_ID}`

**Google Chat Webhook:**
1. In Google Chat, open your space
2. Create a webhook in Space → Apps & integrations → Create new webhook
3. Copy the webhook URL

### 3. Customize Schedule

Edit `.github/workflows/daily-task-update.yml` to change the cron schedule:

```yaml
schedule:
  - cron: '0 9 * * *'  # 9 AM UTC daily
```

**Cron format:** `minute hour day month day-of-week`

Common examples:
- `'0 9 * * *'` - 9 AM daily
- `'0 8-17 * * 1-5'` - Every hour 8 AM-5 PM, Mon-Fri
- `'30 8 * * *'` - 8:30 AM daily
- `'0 10 * * 1'` - 10 AM every Monday

### 4. Manual Trigger

You can manually run the workflow from the **Actions** tab in your repository without waiting for the schedule.

## Local Testing

```bash
npm install
CLICKUP_API_TOKEN=your_token LIST_ID=your_id GOOGLE_CHAT_WEBHOOK_URL=your_webhook node script.js
```

## Environment Variables

- `CLICKUP_API_TOKEN` - ClickUp API authentication
- `LIST_ID` - ClickUp list to fetch tasks from
- `GOOGLE_CHAT_WEBHOOK_URL` - Google Chat webhook endpoint

## Project Structure

```
.
├── script.js                 # Main entry point
├── messageFormatter.js       # Format tasks into chat message
├── googleChatWebhook.js      # Send message to Google Chat
├── package.json             # Dependencies
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
└── .github/
    └── workflows/
        └── daily-task-update.yml  # GitHub Actions workflow
```

## Troubleshooting

### Workflow not running?
- Check that the schedule is correct (UTC timezone)
- Verify GitHub Actions is enabled in repository settings
- Check the **Actions** tab for workflow logs

### API errors?
- Verify secrets are correctly set in GitHub
- Check ClickUp API token is valid
- Ensure LIST_ID matches your ClickUp list
- Confirm Google Chat webhook URL is current

## License

ISC
