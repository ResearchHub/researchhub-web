import ReferencesContainer from "~/components/ReferenceManager/references/ReferencesContainer";
import { ReferencesTabContextProvider } from "~/components/ReferenceManager/references/context/ReferencesTabContext";
import HeadComponent from "~/components/Head";

export default function Index(props) {
  return (
    <ReferencesTabContextProvider>
      <HeadComponent title={"ResearchHub Reference Manager"}></HeadComponent>
      <ReferencesContainer {...props} />
    </ReferencesTabContextProvider>
  );
}
