import { NextApiHandler } from 'next';

export interface QueryInterface {
  /**
   *
   * @param data with no attributes for now TODO: Add User ID
   * @returns true | Error message
   */
  init: NextApiHandler<{ data: true | null; error: string | null }>;
}
