targetScope = 'resourceGroup'

param location string = resourceGroup().location
param acrName string
param postgresServerName string
param storageAccountName string
param appServicePlanName string = 'periksa-plan'
param backendAppName string = 'periksa-backend'
param aiContainerName string = 'periksa-ai'
param aiDnsLabel string
@secure()
param postgresAdminPassword string
@secure()
param periksaSecret string
@secure()
param aiApiKey string
@secure()
param geminiApiKey string = ''
@secure()
param groqApiKey string = ''
param webOrigin string = 'http://localhost:3000'
param postgresAdminUser string = 'periksaadmin'
param postgresDatabaseName string = 'periksa'

var placeholderImage = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
var postgresUrl = 'postgresql://${postgresAdminUser}:${postgresAdminPassword}@${postgresServerName}.postgres.database.azure.com:5432/${postgresDatabaseName}?sslmode=require'
var aiFqdn = '${aiDnsLabel}.${location}.azurecontainer.io'

resource registry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2023-06-01-preview' = {
  name: postgresServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: postgresAdminUser
    administratorLoginPassword: postgresAdminPassword
    version: '16'
    storage: {
      storageSizeGB: 32
      autoGrow: 'Enabled'
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    network: {
      publicNetworkAccess: 'Enabled'
    }
  }
}

resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-06-01-preview' = {
  parent: postgres
  name: postgresDatabaseName
}

resource postgresFirewallAzure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-06-01-preview' = {
  parent: postgres
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  properties: {
    reserved: true
  }
}

resource aiContainer 'Microsoft.ContainerInstance/containerGroups@2023-05-01' = {
  name: aiContainerName
  location: location
  properties: {
    osType: 'Linux'
    restartPolicy: 'Always'
    ipAddress: {
      type: 'Public'
      dnsNameLabel: aiDnsLabel
      ports: [
        {
          port: 50051
          protocol: 'TCP'
        }
        {
          port: 8000
          protocol: 'TCP'
        }
      ]
    }
    imageRegistryCredentials: [
      {
        server: registry.properties.loginServer
        username: registry.listCredentials().username
        password: registry.listCredentials().passwords[0].value
      }
    ]
    containers: [
      {
        name: 'ai-engine'
        properties: {
          image: placeholderImage
          ports: [
            {
              port: 50051
            }
            {
              port: 8000
            }
          ]
          environmentVariables: [
            {
              name: 'APP_ENV'
              value: 'production'
            }
            {
              name: 'GRPC_PORT'
              value: '50051'
            }
            {
              name: 'AI_API_KEY'
              secureValue: aiApiKey
            }
            {
              name: 'GEMINI_API_KEY'
              secureValue: geminiApiKey
            }
            {
              name: 'GROQ_API_KEY'
              secureValue: groqApiKey
            }
          ]
          resources: {
            requests: {
              cpu: json('0.5')
              memoryInGB: json('1.0')
            }
          }
        }
      }
    ]
  }
}

resource backendApp 'Microsoft.Web/sites@2022-03-01' = {
  name: backendAppName
  location: location
  kind: 'app,linux,container'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOCKER|${registry.properties.loginServer}/periksa-backend:bootstrap'
      alwaysOn: true
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'true'
        }
        {
          name: 'APP_ENV'
          value: 'production'
        }
        {
          name: 'PORT'
          value: '8080'
        }
        {
          name: 'DATABASE_URL'
          value: postgresUrl
        }
        {
          name: 'PERIKSA_SECRET'
          value: periksaSecret
        }
        {
          name: 'AI_API_KEY'
          value: aiApiKey
        }
        {
          name: 'AI_ENGINE_GRPC_ADDR'
          value: '${aiFqdn}:50051'
        }
        {
          name: 'AI_ENGINE_URL'
          value: 'http://${aiFqdn}:8000'
        }
        {
          name: 'AI_ENGINE_GRPC_TLS'
          value: 'false'
        }
        {
          name: 'STORAGE_DIR'
          value: '/home/data/files'
        }
        {
          name: 'WEB_ORIGIN'
          value: webOrigin
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${registry.properties.loginServer}'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: registry.listCredentials().username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: registry.listCredentials().passwords[0].value
        }
      ]
    }
  }
}

output registryLoginServer string = registry.properties.loginServer
output backendHostName string = backendApp.properties.defaultHostName
output aiFqdn string = aiFqdn
