import { ApolloLink } from '@apollo/client';
import { print } from 'graphql/language';

import * as Console from 'app/utils/log';

export default () =>
  new ApolloLink((operation, forward) =>
    forward(operation).map((result) => {
      const { operationName, query: _query, variables } = operation;

      if (__DEV__) {
        const query = print(_query).replace(/\s+/g, ' ');
        Console.log(query, JSON.stringify(variables));
        if (result.errors) {
          for (const error of result.errors) {
            const path = error.path?.join('.');
            Console.error(`Error: ${path}: ${error.message}`)
          }
        }
      } else {
        // @ts-ignore
        const operationType = _query.definitions[0].operation;
        Console.log(`${operationType} ${operationName}`, variables);
      }

      return result;
    })
  );
