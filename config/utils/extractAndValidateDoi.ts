function extractAndValidateDOI({ doi }: { doi: string }) {
  // Remove the protocol and domain if present
  let _doi = doi.replace(/^https?:\/\/doi\.org\//, "");

  // Remove any query string
  _doi = _doi.split("?")[0];

  // Regex for validating the DOI
  const regex = /^10\.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;

  return regex.test(_doi);
}

export default extractAndValidateDOI;
