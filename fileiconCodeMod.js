import icons from "./config/themes/icons.json";

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const fa = [
    "fa-light",
    "fa-duotone",
    "fa-regular",
    "fa-solid",
    "fa-solid",
    "fa-brands",
  ];

  const allImports = [
    "@fortawesome/pro-light-svg-icons",
    "@fortawesome/pro-duotone-svg-icons",
    "@fortawesome/pro-regular-svg-icons",
    "@fortawesome/pro-solid-svg-icons",
    "@fortawesome/free-solid-svg-icons",
    "@fortawesome/fontawesome-free-brands",
  ];
  for (let i = 0; i < allImports.length; i++) {
    const curImport = allImports[i];
    // Find the import statement for "@fortawesome/pro-duotone-svg-icons"
    const importStatement = root.find(j.ImportDeclaration, {
      source: {
        value: curImport,
      },
    });

    // Extract the imported icon names
    const iconNames = importStatement
      .find(j.ImportSpecifier)
      .nodes()
      .map((node) => node.imported.name);

    // Find object with key "icons" and value of an object expression
    const iconsObject = root.find(j.VariableDeclarator, {
      id: { name: "icons" },
      init: { type: "ObjectExpression" },
    });

    // Replace values of properties in icons object with equivalent <i> tags
    iconNames.forEach((iconName) => {
      const iconNameWithoutFa = iconName.slice(2);
      const iconNameCamelCase = `${iconNameWithoutFa
        .charAt(0)
        .toLowerCase()}${iconNameWithoutFa.slice(1)}`;

      iconsObject
        .find(j.Property, { key: { name: iconNameCamelCase } })
        .forEach((path) => {
          j(path).replaceWith(
            j.property(
              "init",
              j.identifier(iconNameCamelCase),
              j.jsxElement(
                j.jsxOpeningElement(j.jsxIdentifier("i"), [
                  j.jsxAttribute(
                    j.jsxIdentifier("className"),
                    j.literal(
                      `${fa[i]} fa-${iconNameCamelCase
                        .replace(/([a-z])([A-Z])/g, "$1-$2")
                        .toLowerCase()}`
                    )
                  ),
                ]),
                j.jsxClosingElement(j.jsxIdentifier("i"))
              )
            )
          );
        });
    });
  }
  return root.toSource();
};
