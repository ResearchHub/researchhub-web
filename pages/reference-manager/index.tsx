import { ReferenceItemDrawerContextProvider } from "~/components/ReferenceManager/references/context/ReferenceItemDrawerContext";
import HeadComponent from "~/components/Head";
import ReferencesContainer from "~/components/ReferenceManager/references/ReferencesContainer";
import killswitch from "~/config/killswitch/killswitch";

export default function Index(props) {
  if (!killswitch("reference-manager")) {
    return null;
  } else
    return (
      <ReferenceItemDrawerContextProvider>
        <HeadComponent title={"ResearchHub Reference Manager"}></HeadComponent>
        <ReferencesContainer {...props} />
      </ReferenceItemDrawerContextProvider>
    );
}
