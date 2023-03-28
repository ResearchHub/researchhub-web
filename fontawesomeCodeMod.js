module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  root
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: "FontAwesomeIcon",
        },
      },
    })
    .replaceWith((path) => {
      const iconProp = path.node.openingElement.attributes.find(
        (attribute) => attribute.name.name === "icon"
      );
      if (iconProp) {
        return j.jsxElement(
          j.jsxOpeningElement(j.jsxIdentifier("i"), [
            j.jsxAttribute(
              j.jsxIdentifier("className"),
              j.literal(`fa fa-${iconProp.value.expression.value}`)
            ),
          ]),
          j.jsxClosingElement(j.jsxIdentifier("i")),
          []
        );
      } else {
        return path.node;
      }
    });

  return root.toSource();
};
