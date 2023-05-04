import HorizontalTabBar from "~/components/HorizontalTabBar";
import { useRouter } from "next/router";
import Error from "next/error";
import { getTabs } from "./tabbedNavigation";

interface Args {
  documentData?: any;
  errorCode?: number;
}

const SharedDocumentPage = ({ documentData, errorCode }: Args) => {
  const router = useRouter();
  const tabs = getTabs({ router });

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <div>
      <HorizontalTabBar tabs={tabs} />
    </div>
  );
};

export default SharedDocumentPage;
