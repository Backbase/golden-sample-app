import { readFileSync } from 'node:fs';

const accessControlMocks = {
  success: {
    '**/accessgroups/users/permissions/summary': JSON.parse(
      readFileSync(
        './mock-server/mocks/golden-sample-app/accessgroups/users_permission_summary.json',
        'utf-8'
      )
    ).responses.ok.data,
    '**/accessgroups/service-agreements/context': JSON.parse(
      readFileSync(
        './mock-server/mocks/golden-sample-app/accessgroups/user-context_service-agreements.json',
        'utf-8'
      )
    ).responses.ok.data,
  },
};
const arrangementsMocks = {
  success: {
    '**/productsummary/context/arrangements**': JSON.parse(
      readFileSync(
        './mock-server/mocks/golden-sample-app/productsummary/context_arrangements.json',
        'utf-8'
      )
    ).responses.ok.data,
  },
};
const transactionsMocks = {
  success: {
    '**/v2/transactions': JSON.parse(
      readFileSync(
        './mock-server/mocks/golden-sample-app/transactions/transactions.json',
        'utf-8'
      )
    ).responses.ok.data,
  },
};

export const defaultListMocks = {
  ...accessControlMocks.success,
  ...arrangementsMocks.success,
  ...transactionsMocks.success,
};

export const defaultDetailsMocks = {
  ...accessControlMocks.success,
  ...arrangementsMocks.success,
  ...transactionsMocks.success,
};
