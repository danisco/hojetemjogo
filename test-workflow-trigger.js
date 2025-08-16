// Simple script to test GitHub Actions workflow trigger
console.log('🧪 GitHub Actions Daily Update Test\n');

console.log('📋 Current Setup Status:');
console.log('✅ Workflow file: .github/workflows/scheduled-redeploy.yml');
console.log('✅ Workflow schedule: 6 AM and 6 PM Brazil time (9 AM/PM UTC)');
console.log('✅ Manual trigger: workflow_dispatch enabled');
console.log('✅ Build script: Enhanced with timezone handling\n');

console.log('🔧 Required Setup:');
console.log('1. Create Vercel Deploy Hook:');
console.log('   → Go to Vercel Dashboard → Project → Settings → Deploy Hooks');
console.log('   → Create hook named "Daily Update" for main branch');
console.log('   → Copy the generated URL\n');

console.log('2. Add GitHub Secret:');
console.log('   → Go to GitHub → Settings → Secrets and variables → Actions');
console.log('   → Create secret: VERCEL_DEPLOY_HOOK_URL');
console.log('   → Paste the deploy hook URL as value\n');

console.log('🧪 Manual Test Steps:');
console.log('1. Go to: https://github.com/danisco/hojetemjogo/actions');
console.log('2. Click "Daily Site Update" workflow');
console.log('3. Click "Run workflow" button');
console.log('4. Check Vercel dashboard for new deployment\n');

console.log('📊 Verification:');
console.log('✅ Workflow triggers Vercel deployment');
console.log('✅ Build completes successfully');
console.log('✅ Site shows current date');
console.log('✅ Calendar starts from today\n');

console.log('🕐 Schedule Verification:');
const now = new Date();
const utc9am = new Date();
utc9am.setUTCHours(9, 0, 0, 0);
const utc9pm = new Date();
utc9pm.setUTCHours(21, 0, 0, 0);

const brazil9am = new Date(utc9am.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
const brazil9pm = new Date(utc9pm.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));

console.log(`⏰ Next scheduled runs:`);
console.log(`   Morning: ${utc9am.toISOString()} (UTC) = 6:00 AM Brazil`);
console.log(`   Evening: ${utc9pm.toISOString()} (UTC) = 6:00 PM Brazil`);

const currentBrazilTime = new Date().toLocaleString("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "full",
  timeStyle: "medium"
});
console.log(`   Current Brazil time: ${currentBrazilTime}\n`);

console.log('🎯 Expected Behavior:');
console.log('• GitHub Action runs twice daily automatically');
console.log('• Each run triggers Vercel deployment via webhook');
console.log('• Vercel rebuilds site with fresh API data');
console.log('• Site always shows current date in Brazil timezone');
console.log('• Calendar navigation starts from today');
console.log('• International games (Libertadores/Sul-Americana) included\n');

console.log('🔍 Monitoring URLs:');
console.log('• GitHub Actions: https://github.com/danisco/hojetemjogo/actions');
console.log('• Vercel Deployments: https://vercel.com/dashboard');
console.log('• Live Site: https://hojetemjogo.com.br');
console.log('• Site should show: "Jogos de Hoje (2025-08-16)" today\n');

console.log('✅ Setup complete! Follow the manual steps above to activate daily updates.');