import { StyleSheet, css } from "aphrodite";
import { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";

const SearchBestResults = ({ apiResponse }) => {
  console.log(apiResponse);

  return "best";
};

const styles = StyleSheet.create({});

SearchBestResults.propTypes = {
  apiResponse: PropTypes.object,
};

export default SearchBestResults;
