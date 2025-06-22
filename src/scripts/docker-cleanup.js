/**
 * Script cleanup Docker containers và volumes cũ
 * Chạy: node src/scripts/docker-cleanup.js
 */

import { execSync } from 'child_process';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const runCommand = (command, description) => {
  try {
    log(`🔄 ${description}...`, colors.blue);
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    if (output.trim()) {
      log(`✅ ${description} completed`, colors.green);
      console.log(output);
    } else {
      log(`ℹ️  ${description} - nothing to clean`, colors.yellow);
    }
  } catch (error) {
    log(`⚠️  ${description} - ${error.message}`, colors.yellow);
  }
};

const cleanupDocker = async () => {
  log('🧹 Docker Cleanup Script\n', colors.blue);
  
  // Stop all KTX containers
  runCommand(
    'docker ps -q --filter "name=ktx-" | xargs -r docker stop',
    'Stopping KTX containers'
  );
  
  // Remove all KTX containers
  runCommand(
    'docker ps -aq --filter "name=ktx-" | xargs -r docker rm',
    'Removing KTX containers'
  );
  
  // Remove orphaned containers
  runCommand(
    'docker container prune -f',
    'Removing orphaned containers'
  );
  
  // Remove unused networks
  runCommand(
    'docker network prune -f',
    'Removing unused networks'
  );
  
  // Remove dangling images
  runCommand(
    'docker image prune -f',
    'Removing dangling images'
  );
  
  // List remaining KTX containers (should be empty)
  log('\n📋 Remaining KTX containers:', colors.blue);
  try {
    const remaining = execSync('docker ps -a --filter "name=ktx-"', { encoding: 'utf8' });
    if (remaining.trim().split('\n').length <= 1) {
      log('✅ No KTX containers remaining', colors.green);
    } else {
      console.log(remaining);
    }
  } catch (error) {
    log('✅ No containers found', colors.green);
  }
  
  log('\n🎉 Docker cleanup completed!', colors.green);
  log('💡 You can now run: make docker-up-dev', colors.blue);
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Cleanup interrupted');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

cleanupDocker().catch(error => {
  log(`💥 Cleanup failed: ${error.message}`, colors.red);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
