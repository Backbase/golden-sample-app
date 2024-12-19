export interface Account {
  id: string;
  name: string | undefined;
  amount: number;
}

export interface Transfer {
  fromAccount: string;
  toAccount: string;
  amount: number;
}
