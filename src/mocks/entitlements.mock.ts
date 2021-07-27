export const entitlementsMock = {
  resolveEntitlements: (triplets: string) => {
    if (triplets === 'Payments.ManagePositivePay.view') {
      return Promise.resolve(true);
    } else if (triplets === 'Payments.ManagePositivePay.create') {
      return Promise.resolve(true);
    } else if (triplets === 'Payments.ManageACHPositivePay.view') {
      return Promise.resolve(true);
    } else if (triplets === 'Payments.ManageACHPositivePay.create') {
      return Promise.resolve(true);
    }
    return Promise.resolve(true);
  },
};
