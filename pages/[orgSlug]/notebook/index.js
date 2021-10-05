import NotebookPage from "~/components/Notebook/Notebook";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const isPrivateNotebook = router.query.orgSlug === "me" ? true : false;

  return <NotebookPage isPrivateNotebook={isPrivateNotebook} />
}

export default Index;