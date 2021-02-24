import { SecretsManager } from 'aws-sdk';
import { GetSecretValueRequest } from 'aws-sdk/clients/secretsmanager';

export async function getSecretValue(secretId: string): Promise<any> {
  const secretsManager = new SecretsManager();

  const params: GetSecretValueRequest = {
    SecretId: secretId
  };

  try {
    const response = await secretsManager.getSecretValue(params).promise();
    return JSON.parse(response.SecretString);
  } catch (err) {
    console.error(err);
    return null;
  }
}