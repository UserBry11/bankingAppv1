terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "practice_rg" {
  name     = "my-practice-group"
  location = "eastus"
}

# Definition for your existing PostgreSQL Server
resource "azurerm_postgresql_flexible_server" "banking_db" {
  name                = "bryan-banking-db-v1"
  resource_group_name = azurerm_resource_group.practice_rg.name
  location            = "westus3"
  
  version             = "16"                 
  sku_name            = "GP_Standard_D4ads_v5" 
  storage_mb          = 131072               
  storage_tier        = "P10"
  administrator_login = "admindb"
  administrator_password = "10Password!"

  lifecycle {
    ignore_changes = [version, zone]
  }
}

# Definition for your existing App Service Plan
resource "azurerm_service_plan" "app_plan" {
  name                = "ASP-mypracticegroup-ba37"
  resource_group_name = azurerm_resource_group.practice_rg.name
  location            = "westus3"
  os_type             = "Linux"
  sku_name            = "B1"
}

# Definition for your existing Web App
resource "azurerm_linux_web_app" "banking_app" {
  name                = "my-banking-app"
  resource_group_name = azurerm_resource_group.practice_rg.name
  location            = "westus3"
  service_plan_id     = azurerm_service_plan.app_plan.id
  https_only          = true

  site_config {
    ftps_state = "FtpsOnly"
  }

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "SPRING_DATASOURCE_DRIVER_CLASS_NAME"        = "org.postgresql.Driver"
    "SPRING_DATASOURCE_USERNAME"                 = "admindb"
    "SPRING_DATASOURCE_PASSWORD"                 = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.db_password.id})"
    "SPRING_DATASOURCE_URL"                      = "jdbc:postgresql://bryan-banking-db-v1.banking.postgres.database.azure.com:5432/postgres?sslmode=require"
    "VITE_API_BASE_URL"                          = "https://azurewebsites.net"
    "APPINSIGHTS_INSTRUMENTATIONKEY"             = "d2a48200-a877-4d59-8517-408af4f0b67c"
    "APPLICATIONINSIGHTS_CONNECTION_STRING"      = "InstrumentationKey=d2a48200-a877-4d59-8517-408af4f0b67c;IngestionEndpoint=https://azure.com"
    "ApplicationInsightsAgent_EXTENSION_VERSION" = "~3"
    "XDT_MicrosoftApplicationInsights_Mode"      = "recommended"
  }
}

# 1. Create the secure Virtual Network sandbox
resource "azurerm_virtual_network" "banking_vnet" {
  name                = "banking-enterprise-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.practice_rg.location
  resource_group_name = azurerm_resource_group.practice_rg.name
}

# 2. Create a subnet specifically for my Web App tunnel
resource "azurerm_subnet" "app_subnet" {
  name                 = "app-service-subnet"
  resource_group_name  = azurerm_resource_group.practice_rg.name
  virtual_network_name = azurerm_virtual_network.banking_vnet.name
  address_prefixes     = ["10.0.1.0/24"]

  delegation {
    name = "appservice-delegation"
    service_delegation {
      name    = "Microsoft.Web/serverFarms"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

# 3. Create a private subnet specifically for my own PostgreSQL Server
resource "azurerm_subnet" "db_subnet" {
  name                 = "postgres-private-subnet"
  resource_group_name  = azurerm_resource_group.practice_rg.name
  virtual_network_name = azurerm_virtual_network.banking_vnet.name
  address_prefixes     = ["10.0.2.0/24"]
  service_endpoints    = ["Microsoft.Storage"]

  delegation {
    name = "postgres-delegation"
    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

# 4. Create a Private DNS Zone so my app can find the database inside the network
resource "azurerm_private_dns_zone" "postgres_dns" {
  name                = "banking.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.practice_rg.name
}

# Link the Private DNS Zone directly to my VNet
resource "azurerm_private_dns_zone_virtual_network_link" "dns_vnet_link" {
  name                  = "vnet-dns-link"
  resource_group_name   = azurerm_resource_group.practice_rg.name
  private_dns_zone_name = azurerm_private_dns_zone.postgres_dns.name
  virtual_network_id    = azurerm_virtual_network.banking_vnet.id
}

# 1. Fetch current client data for authorization configuration
data "azurerm_client_config" "current" {}

# 2. Build the brand new secure Azure Key Vault using RBAC authorization
resource "azurerm_key_vault" "banking_vault" {
  name                        = "bryan-vault-2026-v1" 
  location                    = azurerm_resource_group.practice_rg.location
  resource_group_name         = azurerm_resource_group.practice_rg.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  sku_name                    = "standard"

  # Crucial change: Turn on RBAC and remove all inline access_policy blocks
  enable_rbac_authorization   = true
}

# 3. Securely vaulting your active database secret connection key
resource "azurerm_key_vault_secret" "db_password" {
  name         = "spring-datasource-password"
  value        = "10Password!" 
  key_vault_id = azurerm_key_vault.banking_vault.id
}

# Dynamically reads the live web app attributes straight from Azure at apply-time
data "azurerm_linux_web_app" "banking_app_data" {
  name                = "my-banking-app"
  resource_group_name = azurerm_resource_group.practice_rg.name
  
  # This depends_on forces the update to complete before this data is fetched
  depends_on = [azurerm_linux_web_app.banking_app] 
}


# 4. Grant YOURSELF permission to manage secrets via RBAC (Replaces Access Policy A)
resource "azurerm_role_assignment" "terraform_kv_admin" {
  scope                = azurerm_key_vault.banking_vault.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azurerm_client_config.current.object_id
}
# 5. Grant the WEB APP permission to read secrets via RBAC (Replaces Access Policy B)
resource "azurerm_role_assignment" "webapp_kv_reader" {
  scope                = azurerm_key_vault.banking_vault.id
  role_definition_name = "Key Vault Secrets User"
  
  # 🛠️ FIXED: Swap this string to consume the dynamic data source value instead
  principal_id         = data.azurerm_linux_web_app.banking_app_data.identity.0.principal_id
}
