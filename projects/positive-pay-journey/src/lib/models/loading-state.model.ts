/** Common loading states for all views */
/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line no-shadow
export enum LoadingState {
  /** No loading. Default state. */
  IDLE = 'IDLE',
  /** Loading in progress. */
  LOADING = 'LOADING',
  /** Loading more items in a list. */
  LOADING_MORE = 'LOADING_MORE',
  /** Loading next page in a table. */
  LOADING_TABLE = 'LOADING_TABLE',
  /** Loading completed. Used for submitting data. */
  LOADED = 'LOADED',
}
/* eslint-enable @typescript-eslint/naming-convention */
