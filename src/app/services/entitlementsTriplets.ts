export const triplets = {
  canViewTransactions: 'Payments.transactions.view',
  canViewTransfer: 'Payments.transfer.view',
  canMakeLimitlessAmountTransfer: 'Payments.transfer.limitless',
  canViewPositivePay: 'Payments.ManagePositivePay.view',
  canEditPositivePay: 'Payments.ManagePositivePay.create',
  canViewAchRule: 'Payments.AchPositivePay.view',
  canCreateAchRule: 'Payments.AchPositivePay.create',
};

export const buildEntitlementsByUser =
  (userPermissions: Record<string, boolean>): ((triplet: string) => Promise<boolean>) =>
  (triplet: string) =>
    new Promise((resolve) => {
      Object.keys(userPermissions).forEach((key) => {
        if (triplet === key) {
          resolve(userPermissions[key]);
        }
      });
    });
