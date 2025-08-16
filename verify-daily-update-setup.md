# 🧪 Daily Update System - Setup Verification Guide

## ✅ Current Status

### Files Already Created:
- ✅ `.github/workflows/scheduled-redeploy.yml` - GitHub Actions workflow
- ✅ Build script with Brazilian timezone handling
- ✅ Calendar system that shows current date

### What's Working:
- ✅ **Build script**: Correctly calculates today's date in Brazilian timezone
- ✅ **GitHub workflow**: Ready to trigger Vercel deploys twice daily
- ✅ **International games**: Now includes Libertadores/Sul-Americana
- ✅ **Calendar navigation**: Shows 14 days ahead with game indicators

## 🔧 Setup Required (Manual Steps)

### 1. Create Vercel Deploy Hook

**Go to Vercel Dashboard:**
1. Visit: https://vercel.com/dashboard
2. Select your **hojetemjogo** project
3. Navigate to: **Settings** → **Deploy Hooks**
4. Click: **"Create Deploy Hook"**
5. Configure:
   - **Name**: `Daily Update`
   - **Branch**: `main`
6. **Copy the generated URL** (looks like: `https://api.vercel.com/v1/integrations/deploy/...`)

### 2. Add GitHub Secret

**Go to GitHub Repository:**
1. Visit: https://github.com/danisco/hojetemjogo
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click: **"New repository secret"**
4. Configure:
   - **Name**: `VERCEL_DEPLOY_HOOK_URL`
   - **Secret**: [paste the deploy hook URL from step 1]
5. Click: **"Add secret"**

### 3. Test Manual Trigger

**Test the GitHub Action:**
1. Go to: https://github.com/danisco/hojetemjogo/actions
2. Click: **"Daily Site Update"** workflow
3. Click: **"Run workflow"** → **"Run workflow"** (green button)
4. Wait for workflow to complete (should take ~30 seconds)
5. Check Vercel dashboard for new deployment

### 4. Verify Vercel Deployment

**Check Vercel Dashboard:**
1. Go to: https://vercel.com/dashboard → hojetemjogo → **Deployments**
2. Look for new deployment triggered by webhook
3. Verify build completes successfully
4. Check live site shows correct date

## 🕐 Automatic Schedule

### When Workflows Run:
- **Morning**: 9:00 AM UTC = **6:00 AM Brazil time**
- **Evening**: 9:00 PM UTC = **6:00 PM Brazil time**

### What Happens:
1. GitHub Action triggers at scheduled time
2. Sends POST request to Vercel Deploy Hook
3. Vercel starts new build with fresh data
4. Build script fetches today's games (correct date)
5. Site updates with current day's matches

## 🧪 Testing Checklist

### ✅ Pre-Deployment Test:
- [ ] GitHub secret `VERCEL_DEPLOY_HOOK_URL` is set
- [ ] Manual workflow trigger works
- [ ] Vercel deployment starts after trigger
- [ ] Build completes without errors
- [ ] Site shows today's date correctly

### ✅ Daily Verification (Tomorrow):
- [ ] Check GitHub Actions tab for automatic runs
- [ ] Verify site shows new date (August 17th tomorrow)
- [ ] Confirm calendar starts from current day
- [ ] Check that old days are removed

## 🔍 Monitoring Commands

### Check Current Site Date:
```bash
curl -s https://hojetemjogo.com.br | grep -o "Jogos de Hoje ([^)]*)"
```

### View GitHub Actions:
Visit: https://github.com/danisco/hojetemjogo/actions

### View Vercel Deployments:
Visit: https://vercel.com/dashboard → hojetemjogo → Deployments

## ⚠️ Troubleshooting

### If Manual Trigger Fails:
1. Check GitHub secret is set correctly
2. Verify Vercel Deploy Hook URL is valid
3. Check GitHub Actions logs for error details

### If Site Date Doesn't Update:
1. Check if Vercel deployment actually started
2. Verify build script timezone calculation
3. Check API-Football response in build logs

### If Calendar Shows Wrong Dates:
1. Run local build: `node scripts/build.js`
2. Check timezone output in console
3. Verify Brazilian timezone calculation

## 🎯 Success Criteria

The daily update system is working correctly when:

1. ✅ **GitHub Actions run automatically** twice daily
2. ✅ **Vercel deployments trigger** from webhook
3. ✅ **Site date updates daily** (shows current date)
4. ✅ **Calendar starts from today** (no past dates)
5. ✅ **Games show for current day** (including international)

## 🚀 Next Steps After Setup

1. **Set up the GitHub secret** using instructions above
2. **Test manual trigger** to verify connection works
3. **Wait 24 hours** and check if date updates automatically
4. **Monitor for a week** to ensure consistent daily updates

---

**Note**: The system is designed to be fully automated once the GitHub secret is configured. No further manual intervention should be required.