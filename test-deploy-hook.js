// Test script to verify Vercel deploy hook and GitHub Actions setup
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testGitHubActions() {
  console.log('🔍 Testing GitHub Actions setup...\n');
  
  try {
    // Check if we're in a git repository
    const { stdout: gitStatus } = await execAsync('git status --porcelain');
    console.log('✅ Git repository detected');
    
    // Check remote origin
    const { stdout: remoteUrl } = await execAsync('git remote get-url origin');
    console.log(`📡 Remote repository: ${remoteUrl.trim()}`);
    
    // Check if workflow file exists
    const workflowExists = require('fs').existsSync('.github/workflows/scheduled-redeploy.yml');
    console.log(`📋 Workflow file exists: ${workflowExists ? '✅ Yes' : '❌ No'}`);
    
    if (workflowExists) {
      console.log('📄 Workflow configuration:');
      console.log('   - Runs twice daily (6 AM and 6 PM Brazil time)');
      console.log('   - Manual trigger available via workflow_dispatch');
      console.log('   - Requires VERCEL_DEPLOY_HOOK_URL secret');
    }
    
  } catch (error) {
    console.error('❌ Error checking Git setup:', error.message);
  }
}

function checkEnvironmentVariables() {
  console.log('\n🔧 Environment Variables Check...');
  
  const requiredVars = ['API_FOOTBALL_KEY'];
  const optionalVars = ['TZ', 'VERCEL_DEPLOY_HOOK_URL'];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`   ${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
  });
  
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`   ${varName}: ${value ? '✅ Set' : '⚠️ Not set (optional)'}`);
  });
}

async function testManualTrigger() {
  console.log('\n🚀 Manual Trigger Test...');
  
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  
  if (!deployHookUrl) {
    console.log('❌ VERCEL_DEPLOY_HOOK_URL not set');
    console.log('📝 To set up:');
    console.log('   1. Go to Vercel Dashboard → Project → Settings → Deploy Hooks');
    console.log('   2. Create a new Deploy Hook (name: "Daily Update")');
    console.log('   3. Copy the URL');
    console.log('   4. Add to GitHub → Settings → Secrets → VERCEL_DEPLOY_HOOK_URL');
    return;
  }
  
  try {
    console.log('🌐 Testing deploy hook URL...');
    const { default: fetch } = await import('node-fetch');
    
    const response = await fetch(deployHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ Deploy hook triggered successfully!');
      console.log(`📊 Response status: ${response.status}`);
      console.log('🚀 Vercel should start building the site now');
    } else {
      console.log(`❌ Deploy hook failed: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.log(`❌ Error testing deploy hook: ${error.message}`);
  }
}

function printSetupInstructions() {
  console.log('\n📋 Setup Instructions for GitHub Actions + Vercel Deploy Hook:\n');
  
  console.log('1️⃣ **Create Vercel Deploy Hook:**');
  console.log('   • Go to https://vercel.com/dashboard');
  console.log('   • Select your project (hojetemjogo)');
  console.log('   • Settings → Deploy Hooks');
  console.log('   • Click "Create Deploy Hook"');
  console.log('   • Name: "Daily Update"');
  console.log('   • Branch: main');
  console.log('   • Copy the generated URL');
  
  console.log('\n2️⃣ **Add GitHub Secret:**');
  console.log('   • Go to https://github.com/danisco/hojetemjogo');
  console.log('   • Settings → Secrets and variables → Actions');
  console.log('   • Click "New repository secret"');
  console.log('   • Name: VERCEL_DEPLOY_HOOK_URL');
  console.log('   • Value: [paste the deploy hook URL]');
  
  console.log('\n3️⃣ **Test Manual Trigger:**');
  console.log('   • Go to GitHub → Actions tab');
  console.log('   • Click "Daily Site Update" workflow');
  console.log('   • Click "Run workflow" → "Run workflow"');
  console.log('   • Check if it triggers a Vercel deployment');
  
  console.log('\n4️⃣ **Verify Automatic Schedule:**');
  console.log('   • Workflows run at 9 AM and 9 PM UTC daily');
  console.log('   • That\'s 6 AM and 6 PM Brazil time');
  console.log('   • Check GitHub Actions history tomorrow');
  
  console.log('\n📊 **How to Monitor:**');
  console.log('   • GitHub: Actions tab shows workflow runs');
  console.log('   • Vercel: Deployments tab shows triggered builds');
  console.log('   • Site: Check if "Jogos de Hoje" date updates daily');
}

async function main() {
  console.log('🧪 Testing Daily Update System\n');
  console.log('=' * 50);
  
  await testGitHubActions();
  checkEnvironmentVariables();
  await testManualTrigger();
  printSetupInstructions();
  
  console.log('\n🎯 **Next Steps:**');
  console.log('1. Set up the VERCEL_DEPLOY_HOOK_URL secret in GitHub');
  console.log('2. Test manual trigger from GitHub Actions');
  console.log('3. Verify tomorrow that the site shows the new date');
  console.log('4. Check GitHub Actions history for automated runs');
}

main().catch(console.error);