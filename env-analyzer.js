#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Known sensitive environment variables
const SENSITIVE_ENV_VARIABLES = {
  'API_KEY': 'API keys are sensitive credentials',
  'SECRET_KEY': 'Secret keys are sensitive credentials',
  'PASSWORD': 'Passwords are sensitive credentials',
  'ACCESS_TOKEN': 'Access tokens are sensitive credentials',
  'JWT_SECRET': 'JWT secrets are sensitive credentials',
  'PRIVATE_KEY': 'Private keys are sensitive credentials',
  'DB_PASSWORD': 'Database passwords are sensitive credentials',
  'AWS_ACCESS_KEY': 'AWS access keys are sensitive credentials',
  'AWS_SECRET_KEY': 'AWS secret keys are sensitive credentials',
  'STRIPE_SECRET_KEY': 'Stripe secret keys are sensitive credentials',
  'GITHUB_TOKEN': 'GitHub tokens are sensitive credentials'
};

// Common recommended environment variables
const COMMON_ENV_SUGGESTIONS = {
  'NODE_ENV': 'Specifies the runtime environment (development, production, test)',
  'PORT': 'Specifies the port the server will run on',
  'DATABASE_URL': 'Database connection URL',
  'DEBUG': 'Specifies debug mode',
  'LOG_LEVEL': 'Specifies logging level',
  'CORS_ORIGIN': 'Specifies allowed origins for CORS',
  'API_URL': 'API endpoint URL'
};

function parseEnvFile(content) {
  const env = {};
  const lines = content.split('\n');

  lines.forEach(line => {
    if (!line || line.trim().startsWith('#')) {
      return;
    }

    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';

      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith('\'') && value.endsWith('\'')) {
        value = value.substring(1, value.length - 1);
      }

      env[key] = value;
    }
  });

  return env;
}

function analyzeEnvVariables(envVariables) {
  const results = {
    sensitiveVariables: [],
    missingCommonVariables: [],
    emptyVariables: [],
    warnings: []
  };

  Object.keys(envVariables).forEach(key => {
    const upperKey = key.toUpperCase();
    
    if (!envVariables[key].trim()) {
      results.emptyVariables.push(key);
    }
    
    for (const sensitiveKey in SENSITIVE_ENV_VARIABLES) {
      if (upperKey.includes(sensitiveKey)) {
        results.sensitiveVariables.push({
          key,
          reason: SENSITIVE_ENV_VARIABLES[sensitiveKey]
        });
        break;
      }
    }
  });

  Object.keys(COMMON_ENV_SUGGESTIONS).forEach(key => {
    const exists = Object.keys(envVariables).some(envKey => 
      envKey.toUpperCase() === key || 
      envKey.toUpperCase().includes(key)
    );
    
    if (!exists) {
      results.missingCommonVariables.push({
        key,
        description: COMMON_ENV_SUGGESTIONS[key]
      });
    }
  });

  return results;
}

function generateEnvExample(envVariables, analysisResults) {
  let exampleContent = '# Example .env file\n# Copy this file as .env and update with your values\n\n';
  
  Object.keys(envVariables).forEach(key => {
    const isSensitive = analysisResults.sensitiveVariables.some(v => v.key === key);
    const value = isSensitive ? 'your_secure_value_here' : 'value_here';
    
    exampleContent += `${key}=${value}\n`;
  });
  
  if (analysisResults.missingCommonVariables.length > 0) {
    exampleContent += '\n# Recommended variables\n';
    analysisResults.missingCommonVariables.forEach(item => {
      exampleContent += `# ${item.description}\n${item.key}=value_here\n\n`;
    });
  }
  
  return exampleContent;
}

function printAnalysisResults(results) {
  console.log(chalk.bold('\n📋 ENV Analysis Results:\n'));

  if (results.sensitiveVariables.length > 0) {
    console.log(chalk.yellow('⚠️  Sensitive Variables:'));
    results.sensitiveVariables.forEach(item => {
      console.log(`  - ${chalk.bold(item.key)}: ${item.reason}`);
    });
    console.log(chalk.yellow('\nMake sure not to include the actual values of these variables in your .env.example file.\n'));
  } else {
    console.log(chalk.green('✅ Sensitive variable check: No issues found\n'));
  }

  if (results.emptyVariables.length > 0) {
    console.log(chalk.red('❌ Empty Variables:'));
    results.emptyVariables.forEach(key => {
      console.log(`  - ${chalk.bold(key)}: This variable is defined but has no value`);
    });
    console.log('\n');
  } else {
    console.log(chalk.green('✅ Empty variable check: No issues found\n'));
  }

  if (results.missingCommonVariables.length > 0) {
    console.log(chalk.blue('💡 Recommended Variables:'));
    results.missingCommonVariables.forEach(item => {
      console.log(`  - ${chalk.bold(item.key)}: ${item.description}`);
    });
    console.log('\n');
  } else {
    console.log(chalk.green('✅ Recommended variable check: All common variables present\n'));
  }
}

function main() {
  const envPath = path.resolve(process.cwd(), '.env');
  const envExamplePath = path.resolve(process.cwd(), '.env.example');

  try {
    if (!fs.existsSync(envPath)) {
      console.log(chalk.red('❌ Error: .env file not found!'));
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVariables = parseEnvFile(envContent);
    const analysisResults = analyzeEnvVariables(envVariables);
    
    printAnalysisResults(analysisResults);
    
    const exampleContent = generateEnvExample(envVariables, analysisResults);
    fs.writeFileSync(envExamplePath, exampleContent);
    
    console.log(chalk.green(`✅ .env.example file successfully created: ${envExamplePath}`));
    
  } catch (error) {
    console.log(chalk.red(`❌ Error: ${error.message}`));
  }
}

// Run main function when executed from command line
if (require.main === module) {
  main();
}

module.exports = {
  parseEnvFile,
  analyzeEnvVariables,
  generateEnvExample
};