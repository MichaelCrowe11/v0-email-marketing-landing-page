#!/bin/bash

# Configuration
RESOURCE_GROUP="CroweMycologyRG"
LOCATION="eastus"
SERVER_NAME="crowe-sql-server-$RANDOM" # Randomize to avoid name conflicts
DB_NAME="crowe-mycology-db"
ADMIN_USER="croweadmin"
ADMIN_PASS="ChangeMe123!" # CHANGE THIS!

# Check azure cli
if ! command -v az &> /dev/null; then
    echo "Azure CLI could not be found. Please install it first."
    exit 1
fi

echo "Creating Azure Resources..."
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"

# 1. Create Resource Group
echo "Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Create SQL Server
echo "Creating SQL Server ($SERVER_NAME)..."
az sql server create \
    --name $SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --admin-user $ADMIN_USER \
    --admin-password $ADMIN_PASS

# 3. Configure Firewall (Allow Azure services)
echo "Configuring Firewall..."
az sql server firewall-rule create \
    --resource-group $RESOURCE_GROUP \
    --server $SERVER_NAME \
    --name AllowAzureServices \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0

# 4. Create Database
echo "Creating SQL Database ($DB_NAME)..."
az sql db create \
    --resource-group $RESOURCE_GROUP \
    --server $SERVER_NAME \
    --name $DB_NAME \
    --service-objective Basic \
    --max-size 2GB

echo "✅ Azure Resources Created!"
echo "Server: $SERVER_NAME.database.windows.net"
echo "Database: $DB_NAME"
echo "User: $ADMIN_USER"
echo ""
echo "Next Step: Run the schema script using sqlcmd or the Azure Portal Query Editor."
