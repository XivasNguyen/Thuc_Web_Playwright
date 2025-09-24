/**
 * Environment configuration for different test environments
 */

export interface Environment {
  name: string;
  baseUrl: string;
  timeout: number;
  retries: number;
  workers: number;
  headless: boolean;
}

export const environments: Record<string, Environment> = {
  dev: {
    name: 'Development',
    baseUrl: 'https://demo.nopcommerce.com',
    timeout: 30000,
    retries: 1,
    workers: 2,
    headless: true,
  },
  staging: {
    name: 'Staging',
    baseUrl: 'https://demo.nopcommerce.com',
    timeout: 45000,
    retries: 2,
    workers: 3,
    headless: true,
  },
  prod: {
    name: 'Production',
    baseUrl: 'https://demo.nopcommerce.com',
    timeout: 60000,
    retries: 3,
    workers: 1,
    headless: true,
  },
};

export const getEnvironment = (env: string = 'dev'): Environment => {
  return environments[env] || environments.dev;
};
