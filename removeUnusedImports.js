export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const removeIfUnused = (importSpecifier, importDeclaration) => {
    const varName = importSpecifier.value.local.name;
    if (varName === "React") {
      return false;
    }

    const isUsedInScopes = () => {
      return (
        j(importDeclaration)
          .closestScope()
          .find(j.Identifier, { name: varName })
          .filter((p) => {
            if (p.value.start === importSpecifier.value.local.start)
              return false;
            if (p.parentPath.value.type === "Property" && p.name === "key")
              return false;
            if (p.name === "property") return false;
            return true;
          })
          .size() > 0
      );
    };

    // Caveat, this doesn't work with annonymously exported class declarations.
    const isUsedInDecorators = () => {
      // one could probably cache these, but I'm lazy.
      let used = false;
      root.find(j.ClassDeclaration).forEach((klass) => {
        used =
          used ||
          (klass.node.decorators &&
            j(klass.node.decorators)
              .find(j.Identifier, { name: varName })
              .filter((p) => {
                if (p.parentPath.value.type === "Property" && p.name === "key")
                  return false;
                if (p.name === "property") return false;
                return true;
              })
              .size() > 0);
      });
      return used;
    };

    if (!(isUsedInScopes() || isUsedInDecorators())) {
      j(importSpecifier).remove();
      return true;
    }
    return false;
  };

  const removeUnusedDefaultImport = (importDeclaration) => {
    return (
      j(importDeclaration)
        .find(j.ImportDefaultSpecifier)
        .filter((s) => removeIfUnused(s, importDeclaration))
        .size() > 0
    );
  };

  const removeUnusedNonDefaultImports = (importDeclaration) => {
    return (
      j(importDeclaration)
        .find(j.ImportSpecifier)
        .filter((s) => removeIfUnused(s, importDeclaration))
        .size() > 0
    );
  };

  // Return True if somethin was transformed.
  const processImportDeclaration = (importDeclaration) => {
    // e.g. import 'styles.css'; // please Don't Touch these imports!
    if (importDeclaration.value.specifiers.length === 0) return false;

    const hadUnusedDefaultImport = removeUnusedDefaultImport(importDeclaration);
    const hadUnusedNonDefaultImports =
      removeUnusedNonDefaultImports(importDeclaration);

    if (importDeclaration.value.specifiers.length === 0) {
      j(importDeclaration).remove();
      return true;
    }
    return hadUnusedDefaultImport || hadUnusedNonDefaultImports;
  };

  return root
    .find(j.ImportDeclaration)
    .filter(processImportDeclaration)
    .size() > 0
    ? root.toSource(options.printOptions || { quote: "single" })
    : null;
}
