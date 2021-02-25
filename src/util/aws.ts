import { EC2, SecretsManager } from 'aws-sdk';
import { DescribeInstancesRequest, Instance } from 'aws-sdk/clients/ec2';
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

export async function describeInstance(instanceId: string): Promise<Instance> {
  const params: DescribeInstancesRequest = {
    InstanceIds: [instanceId]
  };

  const ec2 = new EC2();

  try {
    const response = await ec2.describeInstances(params).promise();
    return response.Reservations[0].Instances[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}