import { useEffect, useState } from "react";
import BaseModal from "~/components/Modals/BaseModal";
import { StyleSheet, css } from "aphrodite";
import { fetchDocumentByType } from "./fetchDocumentByType";
import { DocumentVersion, Paper, parsePaper, WORK_TYPE } from "./types";
import FormInput from "~/components/Form/FormInput";
import FormSelect from "~/components/Form/FormSelect";

interface Args {
  isOpen: boolean;
  closeModal: () => void;
  versions: DocumentVersion[];
}

export const articleTypeOptions: Array<{ value: WORK_TYPE; label: string }> = [
  {
    value: "article",
    label: "Research Article",
  },
  {
    value: "review",
    label: "Review Article",
  },
];

export type STEP =
  | "CONTENT"
  | "AUTHORS_AND_METADATA"
  | "DECLARATIONS"
  | "PREVIEW";

export const ORDERED_STEPS: STEP[] = [
  "CONTENT",
  "AUTHORS_AND_METADATA",
  "DECLARATIONS",
  "PREVIEW",
];

const PaperVersionModal = ({ isOpen, closeModal, versions }: Args) => {
  const [step, setStep] = useState<STEP>("CONTENT");
  const [latestPaper, setLatestPaper] = useState<Paper | null>(null);
  const handleNext = () => {};

  useEffect(() => {
    (async () => {
      const latestVersion = versions.filter((version) => version.isLatest)[0];
      const rawPaper = await fetchDocumentByType({
        documentType: "paper",
        documentId: latestVersion.id,
      });
      const parsed = parsePaper(rawPaper);
      setLatestPaper(parsed);
    })();
  }, []);

  return (
    <BaseModal
      isOpen={isOpen}
      hideClose={false}
      closeModal={() => {
        closeModal();
      }}
      zIndex={1000000}
      title={"Submit new version"}
      modalContentStyle={styles.modalStyle}
    >
      <div className={css(styles.modalBody)}>
        {step === "CONTENT" && <ContentStep paper={latestPaper} />}
      </div>
    </BaseModal>
  );
};

const ContentStep = ({ paper }: { paper: Paper | null }) => {
  const [title, setTitle] = useState<null | string>(null);
  const [selectedWorkType, setSelectedWorkType] =
    useState<WORK_TYPE>("article");

  useEffect(() => {
    setTitle(paper?.title || null);
    setSelectedWorkType(paper?.workType || "article");
  }, [paper]);

  return (
    <div>
      <div className={css(formStyles.inputWrapper)}>
        <FormInput
          error={typeof title === "string" && title.length === 0}
          value={title}
          label="Title"
          placeholder={"Paper title"}
          containerStyle={formStyles.inputContainer}
          onChange={(name, value) => {
            setTitle(value);
          }}
        />
      </div>

      <div className={css(formStyles.inputWrapper)}>
        <FormSelect
          onChange={(_type: string, value): void => {
            setSelectedWorkType(value);
          }}
          id="article-type"
          label="Article type"
          options={articleTypeOptions}
          placeholder="Select article type"
          required={true}
          type="select"
          value={articleTypeOptions.find(
            (option) => option.value === selectedWorkType
          )}
        />
      </div>
    </div>
  );
};

const formStyles = StyleSheet.create({
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {},
});

const styles = StyleSheet.create({
  modalBody: {
    width: "100%",
  },
  modalStyle: {
    minWidth: 650,
    minHeight: 500,
  },
});

export default PaperVersionModal;
