import {
  TransactionsListFixture,
  TransactionsListPage,
} from '@backbase-gsa/transactions-journey/e2e-tests';
import {test as baseTest} from '../fixtures'
import { readFile } from 'fs';

export const test = baseTest.extend<TransactionsListFixture>({
  configPath: ['', { option: true }],
  config: async ({ configPath }, use) => {
    const configObject = readFile(configPath);
    await use(configObject);
  },
  listPage: async ({ page, baseURL }, use) => {
    const pageObject = new TransactionsListPage(page, { baseURL });
    await use(pageObject);
  },

  listData: async({page, baseURL}, use, workerInfo) => {
    if(workerInfo.project.name.includes('mocked')){
      await use({
          size: 10,
          searchExpectations: [
            { term: 'KLM', count: 7 },
            { term: 'cafe', count: 3 },
          ],
        },)
    } else  {
      await use({size: 0,  searchExpectations: []})
    }
  }
 
});
