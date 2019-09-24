import { useRouter } from "next/router";

const Paper = () => {
  const router = useRouter();
  const { paperId, tabName } = router.query;

  return (
    <div>
      <div>Paper: {paperId}</div>
      <div>Tab: {tabName}</div>
    </div>
  );
};

export default Paper;
