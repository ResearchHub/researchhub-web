import { Input, Checkbox, Button } from "@fluentui/react-components";
import { css, StyleSheet } from "aphrodite";
import * as React from "react";
import { fetchCurrentUserReferenceCitations } from "../api/fetchCurrentUserReferenceCitation";
import { useOrgs } from "../Contexts/OrganizationContext";
import Cite from "citation-js";

const CitationScreen = ({}) => {
  const [citations, setCitations] = React.useState([]);
  const [selectedCitations, setSelectedCitations] = React.useState({});
  const { currentOrg } = useOrgs();

  const resetCitations = (citationList) => {
    const newCitations = {};

    citationList.forEach((_, index) => {
      newCitations[index] = false;
    });

    setSelectedCitations(newCitations);
  };

  React.useEffect(() => {
    const getCitations = async () => {
      const citations = await fetchCurrentUserReferenceCitations({
        getCurrentUserCitation: true,
        organizationID: currentOrg.id,
      });

      resetCitations(citations);

      setCitations(citations);
    };
    if (currentOrg.id) {
      getCitations();
    }
  }, [currentOrg.id]);

  const citationClicked = (index) => {
    const newCitations = { ...selectedCitations };
    newCitations[index] = !newCitations[index];
    setSelectedCitations(newCitations);
  };

  async function addTextAfterSelection(text) {
    await Word.run(async (context) => {
      // Create a proxy object for the document.
      var doc = context.document;

      // Queue a command to get the current selection and then create a proxy range object with the results.
      var range = doc.getSelection();

      // Synchronize the document state by executing the queued commands,
      // and return a promise to indicate task completion.
      await context.sync();

      // Queue a command to insert text at the end of the selection.
      range.insertText(` ${text}`, Word.InsertLocation.end);

      // Synchronize the document state by executing the queued commands,
      // and return a promise to indicate task completion.
      return context.sync().then(function () {
        console.log("Text added after the selection.");
      });
    }).catch(function (error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });
  }

  const insertCitation = () => {
    const allSelectedCitations = Object.entries(selectedCitations).filter((entry) => entry[1]);
    // @ts-ignore
    const citationObject = new Cite();
    for (let i = 0; i < allSelectedCitations.length; i++) {
      const selectedCitationIndex = parseInt(allSelectedCitations[i][0], 10);
      citationObject.add(citations[selectedCitationIndex].fields);
    }

    const bibliography = citationObject.format("bibliography", {
      format: "text",
      template: "apa",
      lang: "en-US",
    });

    const inlineCitation = citationObject.format("citation", {
      format: "text",
      template: "apa",
      lang: "en-US",
    });

    addTextAfterSelection(inlineCitation);

    Word.run(async (context) => {
      /**
       * Insert your Word code here
       */

      context.document.body.insertParagraph(bibliography, Word.InsertLocation.end);

      await context.sync();
    });

    resetCitations(citations);
  };

  const hasSelectedCitations = React.useMemo(() => {
    return Object.entries(selectedCitations).filter((entry) => entry[1]).length > 0;
  }, [selectedCitations]);

  return (
    <div className={css(styles.container)}>
      <div>
        <Input placeholder={"Search for a citation"} className={css(styles.input)} />
      </div>
      <div>
        {citations.map((citation, index) => {
          return (
            <>
              <div key={`citation-${index}`} className={css(styles.citation)}>
                <Checkbox
                  size="large"
                  className={css(styles.checkbox)}
                  input={{
                    className: css(styles.checkBoxInput),
                  }}
                  checked={selectedCitations[index]}
                  onChange={() => citationClicked(index)}
                  label={""}
                ></Checkbox>
                <div className={css(styles.citationLabel)} onClick={() => citationClicked(index)}>
                  <p className={css(styles.citationTitle)}>{citation.fields.title}</p>
                  <p>
                    {citation.fields.creators.map((creator, index) => {
                      if (index === 3 && index !== citation.fields.creators.length - 1) {
                        return "... ";
                      }
                      if (index > 2 && index !== citation.fields.creators.length - 1) {
                        return null;
                      }
                      return creator.first_name + " " + creator.last_name[0] + "., ";
                    })}
                    {citation.fields.date.split("-")[0]}
                  </p>
                </div>
              </div>
            </>
          );
        })}
      </div>
      {hasSelectedCitations && (
        <div className={css(styles.bottomDrawer)}>
          <Button className={css(styles.button)} onClick={insertCitation}>
            Insert Citation
          </Button>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    border: "1px solid #ddd",
    width: "100%",
    padding: "8px 16px",
    borderRadius: 4,
  },
  citation: {
    paddingBottom: 8,
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
    display: "flex",
    alignItems: "flex-start",
    paddingTop: 16,
  },
  citationTitle: {
    fontWeight: 700,
    marginTop: 0,
  },
  checkbox: {
    border: "1px solid #ddd",
    marginTop: 2,
  },
  checkBoxInput: {
    border: "1px solid #ddd",
  },
  citationLabel: {
    marginLeft: 16,
  },
  bottomDrawer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    height: 80,
    width: "100%",
    background: "#fff",
    boxShadow: "0px -2px 8px 0px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    // width: "100%",
    margin: "auto",
    background: "rgb(57, 113, 255)",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
  },
});

export default CitationScreen;
