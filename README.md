# Email marketing landing page

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/michael-9927s-projects/v0-email-marketing-landing-page)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/A0ZpcM23EPs)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## 🚀 Quick Start

### Option 1: Quick Setup (5 minutes)
Get started quickly with our streamlined setup:
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

📖 **[Quick Start Guide](./QUICK_START_KEYVAULT.md)** - Complete setup in 5 minutes

### Option 2: Production Setup with Azure Key Vault
For production deployments with secure secret management:

📖 **[Azure Key Vault Setup Guide](./AZURE_KEYVAULT_SETUP.md)** - Complete Key Vault configuration

## 🔐 Secure Configuration

This application supports **Azure Key Vault** for secure API key management:

- ✅ Centralized secret management
- ✅ Automatic secret rotation support
- ✅ Fine-grained access control
- ✅ Fallback to environment variables
- ✅ Zero-downtime migration

### Key Features

- **Flexible Authentication**: Service Principal or Managed Identity
- **Fallback Mode**: Works without Key Vault using environment variables
- **Health Monitoring**: `/api/health` endpoint for deployment validation
- **Production Ready**: Comprehensive security and monitoring

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START_KEYVAULT.md)** - Get up and running in 5 minutes
- **[Azure Key Vault Setup](./AZURE_KEYVAULT_SETUP.md)** - Complete Key Vault configuration guide
- **[Migration Guide](./MIGRATION_TO_KEYVAULT.md)** - Migrate existing deployments to Key Vault
- **[Deployment Readiness](./DEPLOYMENT_READINESS.md)** - Production deployment checklist
- **[Setup Guide](./SETUP.md)** - Original setup instructions
- **[Environment Variables](./.env.example)** - Complete list of required variables

## 🏥 Health Check

Check your application health and configuration:
```bash
curl http://localhost:3000/api/health
```

This endpoint validates all required secrets and services are configured correctly.

## Deployment

Your project is live at:

**[https://vercel.com/michael-9927s-projects/v0-email-marketing-landing-page](https://vercel.com/michael-9927s-projects/v0-email-marketing-landing-page)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/A0ZpcM23EPs](https://v0.app/chat/projects/A0ZpcM23EPs)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 🔒 Security

- All secrets are managed through Azure Key Vault or secure environment variables
- No secrets are committed to version control
- Health monitoring and validation built-in
- Security headers configured in production

## 📞 Support

For issues or questions:
- Check the [documentation guides](./QUICK_START_KEYVAULT.md)
- Review the [deployment checklist](./DEPLOYMENT_READINESS.md)
- Open an issue in this repository
