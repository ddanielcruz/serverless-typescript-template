import type { AWS } from '@serverless/typescript'

import * as functions from '@/functions'

const serverlessConfiguration: AWS = {
  org: 'ddanielcruz',
  app: 'serverless-typescript-template',
  service: 'serverless-typescript-template',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild', 'serverless-offline-sqs', 'serverless-offline', 'serverless-prune-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    stage: 'local',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      AWS_LOG_LEVEL: '${env:AWS_LOG_LEVEL}',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
    }
  },
  functions,
  package: { individually: true },
  custom: {
    stage: '${opt:stage, self:provider.stage}',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    },
    prune: {
      automatic: true,
      number: 3
    },
    'serverless-offline-sqs': {
      autoCreate: true,
      apiVersion: '2012-11-05',
      endpoint: 'http://0.0.0.0:9324',
      region: 'us-east-1',
      accessKeyId: 'root',
      secretAccessKey: 'root',
      skipCacheInvalidation: false
    },
    'serverless-offline': {
      host: '0.0.0.0'
    }
  }
}

module.exports = serverlessConfiguration
