export interface Account {
  id: string;
  name: string;
  amount: number;
}

export interface Transfer {
  fromAccount: string;
  toAccount: string;
  amount: number;
}
