export const ADD_NEW_TEXT = "Add New";

export const ABOUT_POST_CARD = {
  title: "Posting to Research Hub",
  sections: [
    {
      title: "What can you post here?",
      items: [
        "Ask a scientific question",
        "Share a theory or hypothesis",
        "Publish a research output",
      ],
    },
    {
      title: "What counts as research output?",
      items: [
        "Research posters",
        "Conference proceedings",
        "Experimental datasets",
        "Peer-reviews",
        "Unfinished works in progress",
      ],
    },
    {
      title: "Guidelines",
      items: [
        "Be civil",
        "Offer suggestions and corrections",
        "Back up your claims by linking to relevant sources",
      ],
    },
  ],
} as const;

export const ABOUT_PAPER_CARD = {
  title: "Uploading a Paper",
  before: (
    <>
      <p>
        When submitting a paper to ResearchHub, please use the following
        guidelines:
      </p>

      <ul>
        <li>
          Use research that follows the scientific method
          <ul>
            <li>No anecdotes or opinions</li>
            <li>No biased or sensational headlines</li>
            <li>Use peer reviewed or in progress work</li>
          </ul>
        </li>
        <li>
          No illegal content
          <ul>
            <li>Upload pre-prints and public domain work only</li>
            <li>Link to paywalls on other sites where needed</li>
          </ul>
        </li>
        <li>No off-topic content (science only!)</li>
      </ul>

      <p>
        In addition, **we ask that all paper uploads be written in English**. We
        plan to add support for other languages in the future - but for the sake
        of building a unified early-stage community we will focus on English
        language papers while we grow.
      </p>
    </>
  ),
} as const;

export const ABOUT_HYPOTHESIS_CARD = {
  title: "Creating a Hypothesis",
  sections: [
    {
      title: "What can you post here?",
      items: [
        "Make a hypothesis -- a proposed explanation for an observation.",
        "After you create the hypothesis, add relevant papers to support or reject the hypothesis",
      ],
    },
    {
      title: "Guidelines",
      items: ["Be civil", "Offer suggestions and corrections"],
    },
  ],
} as const;
