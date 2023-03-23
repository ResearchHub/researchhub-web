import React from "react";
import icons from "./config/themes/icons.json";

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Find all instances of icons.____
  root
    .find(j.MemberExpression, {
      object: {
        name: "icons",
      },
    })
    .replaceWith((path) => {
      // Get the property name
      const propertyName = path.node.property.name;
      // Get the value from the icons object
      const value = icons[propertyName];

      if (value === undefined) {
        // If value is undefined, return original node
        return path.node;
      } else if (React.isValidElement(value)) {
        // If value is a React element, return it directly
        return value;
      } else {
        // Otherwise, replace with a literal containing the value
        return j.literal(value);
      }
    });

  return root.toSource();
};
