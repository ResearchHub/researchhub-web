module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find and remove duplicate imports
  const importDeclarations = root.find(j.ImportDeclaration);
  const importSources = new Set();
  importDeclarations.forEach((path) => {
    const sourceValue = path.node.source.value;
    if (importSources.has(sourceValue)) {
      j(path).remove();
    } else {
      importSources.add(sourceValue);
    }
  });

  return root.toSource();
};
