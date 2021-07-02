import { HttpResponse } from '@angular/common/http';

/**
 * Map response object with the count comes from the x-total-count header
 *
 * @param response {HttpResponse} response object
 * @param index
 * @returns response object with count property
 * @example
 * const res = new HttpResponse({body: [], headers: new HttpHeaders({'x-total-count': '10'})});
 * mapResponseWithCount(res) // {...res, count: 10}
 */
export const mapResponseWithCount = <T extends HttpResponse<U | null>, U>( // eslint-disable-line
  response: T,
  index?: number | keyof U,
): T & { count: number } => {
  let count = 0;
  // eslint-disable-next-line no-null/no-null
  if (response.body === null) {
    return { ...response, count };
  }
  if (Array.isArray(response.body)) {
    count = response.body.length;
  }
  const items = response.body[index as keyof U];
  if (Array.isArray(items)) {
    count = items.length;
  }
  const totalCountFromHeader = response.headers.get('x-total-count');
  const totalCount = totalCountFromHeader ? parseInt(totalCountFromHeader, 10) : count;
  return { ...response, count: totalCount };
};
