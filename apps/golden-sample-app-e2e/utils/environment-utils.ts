export type EnvironmentType = 'mocks' | 'sandbox' | 'ephemeral';

export function getEnvironmentType(): EnvironmentType {
  const envType = process.env['ENV_TYPE'];
  if (envType === 'sandbox') {
    return 'sandbox';
  } else if (envType === 'ephemeral') {
    return 'ephemeral';
  } else {
    return 'mocks';
  }
}
