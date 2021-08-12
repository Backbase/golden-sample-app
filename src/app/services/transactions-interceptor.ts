import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import * as mocks from '../mock-data/transactions.json';
import { Transaction } from 'transactions-journey';
import { Observable, of } from 'rxjs';
const data =  [
  {
    additions: {},
    resource: 'Flow',
    function: 'Manage Task',
    permissions: {
      execute: true,
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Flow',
    function: 'Manage Task Dates',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'User',
    function: 'Manage Users',
    permissions: {
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Message Center',
    function: 'Manage Messages',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Entitlements',
    function: 'Manage Data Groups',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'ACH Credit Transfer',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Account Statements',
    function: 'Manage Statements',
    permissions: {
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Flow',
    function: 'Assign Task',
    permissions: {
      execute: true,
    },
  },
  {
    additions: {},
    resource: 'Identities',
    function: 'Unlock User',
    permissions: {
      create: true,
      view: true,
      edit: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Message Center',
    function: 'Manage Topics',
    permissions: {
      create: true,
      view: true,
      edit: true,
      execute: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Personal Finance Management',
    function: 'Manage Budgets',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Legal Entity',
    function: 'Manage Legal Entities',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Flow',
    function: 'Access Journey Definitions',
    permissions: {
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Contacts',
    function: 'US Billpay Payees',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Identities',
    function: 'Lock User',
    permissions: {
      create: true,
      view: true,
      edit: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Service Agreement',
    function: 'Assign Users',
    permissions: {
      create: true,
      view: true,
      edit: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'Intra Company Payments',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Personal Finance Management',
    function: 'Manage Saving Goals',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Limits',
    function: 'Manage Limits',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Transactions',
    function: 'Transactions',
    permissions: {
      edit: true,
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Support Access',
    function: 'Support Access for Payments',
    permissions: {
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Service Agreement',
    function: 'Assign Permissions',
    permissions: {
      create: true,
      view: true,
      edit: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'US Domestic Wire - Intracompany',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Flow',
    function: 'Archive Case',
    permissions: {
      execute: true,
    },
  },
  {
    additions: {},
    resource: 'Service Agreement',
    function: 'Manage Service Agreements',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'ACH Debit',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'ACH Credit - Intracompany',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'User Profiles',
    function: 'Manage User Profiles',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Flow',
    function: 'Manage Case Documents',
    permissions: {
      create: true,
      view: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Arrangements',
    function: 'US Billpay Accounts',
    permissions: {
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'US Billpay Payments',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Flow',
    function: 'Access Case Changelog',
    permissions: {
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Approvals',
    function: 'Assign Approval Policies',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Actions',
    function: 'Access Actions History',
    permissions: {
      execute: true,
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'A2A Transfer',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Device',
    function: 'Manage Devices',
    permissions: {
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Notifications',
    function: 'Manage Notifications',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Limits',
    function: 'Manage Shadow Limits',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Approvals',
    function: 'Manage Approval Policy and Level',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'Remote Deposit Capture',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'Stop Checks',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Product Summary',
    function: 'Product Summary',
    permissions: {
      edit: true,
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Billpay',
    function: 'US Billpay Enrolment',
    permissions: {
      execute: true,
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Contacts',
    function: 'US Billpay Payees-Search',
    permissions: {
      execute: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'US Domestic Wire',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Batch',
    function: 'Batch - SEPA CT',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'US Foreign Wire',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Batch',
    function: 'Batch - ACH Credit',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Flow',
    function: 'Access Journey Statistics',
    permissions: {
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Flow',
    function: 'Manage Case Comments',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Actions',
    function: 'Manage Action Recipes',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      execute: true,
    },
  },
  {
    additions: {},
    resource: 'Contacts',
    function: 'US Billpay Payees-Summary',
    permissions: {
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Message Center',
    function: 'Supervise Messages',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Contacts',
    function: 'Contacts',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Batch',
    function: 'Batch - ACH Debit',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Entitlements',
    function: 'Manage Function Groups',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'SEPA CT',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Flow',
    function: 'Access Case Statistics',
    permissions: {
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Identities',
    function: 'Manage Identities',
    permissions: {
      create: true,
      view: true,
      edit: true,
      approve: true,
    },
  },
  {
    additions: {},
    resource: 'Audit',
    function: 'Audit',
    permissions: {
      create: true,
      view: true,
    },
  },
  {
    additions: {},
    resource: 'Cash Flow',
    function: 'Cash Flow Forecasting',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'SEPA CT - Intracompany',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'User',
    function: 'Manage Authorized Users',
    permissions: {
      create: true,
      view: true,
      edit: true,
    },
  },
  {
    additions: {},
    resource: 'Flow',
    function: 'Manage Case',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'US Foreign Wire - Intracompany',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Device',
    function: "Manage Other User's Devices",
    permissions: {
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Payments',
    function: 'SEPA CT - closed',
    permissions: {
      cancel: true,
      view: true,
      edit: true,
      approve: true,
      create: true,
      delete: true,
    },
  },
  {
    additions: {},
    resource: 'Limits',
    function: 'Manage Global Limits',
    permissions: {
      create: true,
      view: true,
      edit: true,
      delete: true,
      approve: true,
    },
  },
];
@Injectable()
export class EntitlementsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('api/transactions')) {
      const page = Number(req.params.get('page')) || 0;
      const pageSize = Number(req.params.get('pageSize')) || 0;

      return of(new HttpResponse({
        status: 200,
        body: mocks.data
          .sort((a: Transaction, b: Transaction) => b.dates.valueDate - a.dates.valueDate)
          .slice(page, pageSize)
      }));
    }

    if (req.url.endsWith('api/entitlements')) {  
      return of(new HttpResponse({
        status: 200,
        body: data
      }))
    }
    return next.handle(req);
  }
}
