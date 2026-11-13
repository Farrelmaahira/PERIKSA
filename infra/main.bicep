targetScope = 'resourceGroup'

param location string = resourceGroup().location
param environmentName string
param acrName string
param postgresServerName string
param redisName string
param storageAccountName string
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

var backendAppName = 'periksa-backend'
var aiAppName = 'periksa-ai'
var storageShareName = 'files'
var placeholderImage = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${environmentName}-logs'
  location: location
  properties: {
    retentionInDays: 30
    workspaceCapping: {
      dailyQuotaGb: 1
    }
  }
}

resource environment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: environmentName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

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

resource redis 'Microsoft.Cache/Redis@2023-08-01' = {
  name: redisName
  location: location
  properties: {
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    sku: {
      name: 'Basic'
      family: 'C'
      capacity: 0
    }
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

resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-05-01' = {
  name: '${storage.name}/default/${storageShareName}'
  properties: {
    accessTier: 'TransactionOptimized'
    shareQuota: 100
  }
}

resource environmentStorage 'Microsoft.App/managedEnvironments/storages@2023-05-01' = {
  parent: environment
  name: 'files'
  properties: {
    azureFile: {
      accountName: storage.name
      accountKey: storage.listKeys().keys[0].value
      shareName: storageShareName
      accessMode: 'ReadWrite'
    }
  }
}

var postgresUrl = 'postgresql://${postgresAdminUser}:${postgresAdminPassword}@${postgresServerName}.postgres.database.azure.com:5432/${postgresDatabaseName}?sslmode=require'
var redisUrl = 'rediss://:${redis.listKeys().primaryKey}@${redis.name}.redis.cache.windows.net:6380/0'

resource aiApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: aiAppName
  location: location
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      ingress: {
        external: false
        transport: 'tcp'
        targetPort: 50051
        exposedPort: 50051
      }
      registries: [
        {
          server: registry.properties.loginServer
          username: registry.listCredentials().username
          passwordSecretRef: 'registry-password'
        }
      ]
      secrets: [
        {
          name: 'registry-password'
          value: registry.listCredentials().passwords[0].value
        }
        {
          name: 'ai-api-key'
          value: aiApiKey
        }
        {
          name: 'gemini-api-key'
          value: geminiApiKey
        }
        {
          name: 'groq-api-key'
          value: groqApiKey
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'ai-engine'
          image: placeholderImage
          env: [
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
              secretRef: 'ai-api-key'
            }
            {
              name: 'GEMINI_API_KEY'
              secretRef: 'gemini-api-key'
            }
            {
              name: 'GROQ_API_KEY'
              secretRef: 'groq-api-key'
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 2
      }
    }
  }
}

resource backendApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: backendAppName
  location: location
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      ingress: {
        external: true
        transport: 'http'
        targetPort: 8080
        allowInsecure: false
      }
      secrets: [
        {
          name: 'registry-password'
          value: registry.listCredentials().passwords[0].value
        }
        {
          name: 'postgres-url'
          value: postgresUrl
        }
        {
          name: 'redis-url'
          value: redisUrl
        }
        {
          name: 'periksa-secret'
          value: periksaSecret
        }
        {
          name: 'ai-api-key'
          value: aiApiKey
        }
      ]
      registries: [
        {
          server: registry.properties.loginServer
          username: registry.listCredentials().username
          passwordSecretRef: 'registry-password'
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'backend'
          image: placeholderImage
          env: [
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
              secretRef: 'postgres-url'
            }
            {
              name: 'REDIS_URL'
              secretRef: 'redis-url'
            }
            {
              name: 'PERIKSA_SECRET'
              secretRef: 'periksa-secret'
            }
            {
              name: 'AI_API_KEY'
              secretRef: 'ai-api-key'
            }
            {
              name: 'AI_ENGINE_GRPC_ADDR'
              value: 'periksa-ai:50051'
            }
            {
              name: 'AI_ENGINE_GRPC_TLS'
              value: 'false'
            }
            {
              name: 'STORAGE_DIR'
              value: '/data/files'
            }
            {
              name: 'WEB_ORIGIN'
              value: webOrigin
            }
          ]
          volumeMounts: [
            {
              volumeName: 'files'
              mountPath: '/data/files'
            }
          ]
          probes: [
            {
              type: 'Liveness'
              httpGet: {
                path: '/healthz'
                port: 8080
              }
              initialDelaySeconds: 10
              periodSeconds: 30
            }
            {
              type: 'Readiness'
              httpGet: {
                path: '/readyz'
                port: 8080
              }
              initialDelaySeconds: 10
              periodSeconds: 15
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      volumes: [
        {
          name: 'files'
          storageType: 'AzureFile'
          storageName: 'files'
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}

output registryLoginServer string = registry.properties.loginServer
output backendAppName string = backendApp.name
output backendFqdn string = backendApp.properties.configuration.ingress.fqdn
output postgresHost string = postgres.properties.fullyQualifiedDomainName
output redisHost string = redis.properties.hostName
