# dotenv-analyzer

A lightweight, powerful tool for analyzing `.env` files, checking for security issues, and generating clean example configuration files.


<p align="center">
  <a href="https://www.npmjs.com/package/dotenv-analyzer">
    <img src="https://img.shields.io/npm/v/dotenv-analyzer.svg" alt="npm version">
  </a>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
<a href="https://github.com/gurelyusuf/dotenv-analyzer/commits main">
  <img src="https://img.shields.io/github/last-commit/gurelyusuf/dotenv-analyzer" alt="Last Commit">
</a>
</p>


## Overview

`env-analyzer` is a command-line tool that:

- Analyzes your existing `.env` files
- Identifies sensitive variables (API keys, passwords, tokens)
- Detects empty or misconfigured variables
- Suggests commonly used but missing variables
- Generates clean `.env.example` files for safe sharing

## Installation

### Global

```bash
npm install -g env-analyzer
```

### Local

```bash
npm install env-analyzer --save-dev
```

## Usage

### Basic Usage

Navigate to your project directory (containing a `.env` file) and run:

```bash
env-analyzer
```

### Example Output

```
📋 ENV Analysis Results:

⚠️  Sensitive Variables:
  - API_KEY: API keys are sensitive credentials
  - DB_PASSWORD: Database passwords are sensitive credentials

Make sure not to include the actual values of these variables in your .env.example file.

❌ Empty Variables:
  - CACHE_TTL: This variable is defined but has no value

💡 Recommended Variables:
  - LOG_LEVEL: Specifies logging level
  - CORS_ORIGIN: Specifies allowed origins for CORS

✅ .env.example file successfully created: /path/to/your/project/.env.example
```

## Features

- **Security Analysis**: Identifies potentially sensitive variables in your environment configuration
- **Missing Variable Detection**: Suggests common environment variables that might be missing
- **Clean Example Generation**: Creates a safe `.env.example` file for sharing with team members or in repositories

## Example .env.example Output

```
# Example .env file
# Copy this file as .env and update with your values

API_KEY=your_secure_value_here
DATABASE_URL=value_here
NODE_ENV=value_here
DB_PASSWORD=your_secure_value_here

# Recommended variables
# Specifies logging level
LOG_LEVEL=value_here

# Specifies allowed origins for CORS
CORS_ORIGIN=value_here
```

### Feedback

If you have any feedback, please reach out to my [email](mailto:yusufgureldev@gmail.com)

### License

MIT License. See [LICENSE](LICENSE) for details.
