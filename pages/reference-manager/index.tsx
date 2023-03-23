import HeadComponent from "~/components/Head";
import ReferencesContainer from "~/components/ReferenceManager/references/ReferencesContainer";
import { ReferenceItemDrawerContextProvider } from "~/components/ReferenceManager/references/context/ReferenceItemDrawerContext";

export default function Index(props) {
  return (
    <ReferenceItemDrawerContextProvider>
      <HeadComponent title={"ResearchHub Reference Manager"}></HeadComponent>
      <ReferencesContainer {...props} />
    </ReferenceItemDrawerContextProvider>
  );
}
