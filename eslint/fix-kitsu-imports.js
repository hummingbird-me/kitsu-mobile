module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "Enforce that all imports from 'kitsu/' are disallowed in favor of '@/' imports",
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      'ImportDeclaration[source.value=/kitsu.*/]': (node) => {
        if (node.source.value.startsWith('kitsu/')) {
          context.report({
            node: node,
            message: `Import from 'kitsu/' is disallowed. Use '@/' instead.`,
            fix(fixer) {
              return fixer.replaceTextRange(
                [node.source.range[0] + 1, node.source.range[1] - 1],
                node.source.value.replace('kitsu/', '@/')
              );
            },
          });
        }
      },
    };
  },
};
