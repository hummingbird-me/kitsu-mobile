import { initGraphQLTada } from 'gql.tada';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { introspection } from '@/types/graphql-env.d.ts';

export const graphql = initGraphQLTada<{
  introspection: introspection;
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
