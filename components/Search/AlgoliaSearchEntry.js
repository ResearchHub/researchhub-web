import React from "react";
import PropTypes from "prop-types";

const AlgoliaSearchEntry = ({ hit, components }) => {
  return (
    <a href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">
          <components.Highlight hit={hit} attribute="title" />
        </div>
      </div>
    </a>
  );
};

PropTypes.propTypes = {
  hit: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
};

export default AlgoliaSearchEntry;
