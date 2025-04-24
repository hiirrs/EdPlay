/**
 * This file contains tRPC's HTTP response handler
 */
// import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from '~/server/context';
import { appRouter } from '~/server/routers/_app';
import { createNextApiHandler } from '@trpc/server/adapters/next';

export default createNextApiHandler({
  router: appRouter,
  /**
   * @see https://trpc.io/docs/v11/context
   */
  createContext,
  /**
   * @see https://trpc.io/docs/v11/error-handling
   */
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error);
    }
  },
  /**
   * @see https://trpc.io/docs/v11/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
});
