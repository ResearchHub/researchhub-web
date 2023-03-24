const { camelCase } = require("lodash");

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Find all JSX elements with className starting with "fa-"
  const icons = root.find(j.JSXElement, {
    openingElement: {
      name: {
        name: "i",
      },
      attributes: [
        {
          name: {
            name: "className",
          },
        },
      ],
    },
  });

  const iconNames = new Set();

  // Convert icons to React Font Awesome format
  icons.forEach((icon) => {
    const classNameAttr = icon.node.openingElement.attributes.find(
      (attr) => attr.name.name === "className"
    );
    const iconClass = classNameAttr.value.value.split(" ");
    const iconName = camelCase(iconClass[1]);
    const iconType = iconClass[0].replace("fa-", "");

    // Replace <i> element with <FontAwesomeIcon> element
    j(icon).replaceWith(
      j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier("FontAwesomeIcon"), [
          j.jsxAttribute(
            j.jsxIdentifier("icon"),
            j.jsxExpressionContainer(j.identifier(iconName))
          ),
        ]),
        j.jsxClosingElement(j.jsxIdentifier("FontAwesomeIcon")),
        []
      )
    );

    if (iconNames.has(iconName)) {
    } else {
      iconNames.add(iconName);
      // Add import statement for icon
      root
        .get()
        .node.program.body.unshift(
          j.importDeclaration(
            [j.importSpecifier(j.identifier(`${iconName}`))],
            j.literal(`@fortawesome/pro-${iconType}-svg-icons`)
          )
        );
    }
  });

  // Add import statement for FontAwesomeIcon class
  root
    .get()
    .node.program.body.unshift(
      j.importDeclaration(
        [j.importSpecifier(j.identifier("FontAwesomeIcon"))],
        j.literal("@fortawesome/react-fontawesome")
      )
    );

  return root.toSource();
};
