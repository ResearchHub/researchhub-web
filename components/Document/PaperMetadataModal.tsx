import { DocumentMetadata, Paper } from "~/components/Document/lib/types";
import BaseModal from "../Modals/BaseModal";
import { useState } from "react";
import { css, StyleSheet } from "aphrodite";
import HorizontalTabBar, { Tab } from "../HorizontalTabBar";
import PaperPageAbstractSection from "../Paper/abstract/PaperPageAbstractSection";
import { MessageActions } from "~/redux/message";
import { useDispatch } from "react-redux";
import PaperMetadataForm from "./PaperMetadataForm";
import HubSelect from "../Hubs/HubSelectDropdown";
import Button from "../Form/Button";
import { Hub, parseHub } from "~/config/types/hub";
import updatePaperMetadataAPI from "./api/updatePaperMetadataAPI";

const { setMessage, showMessage } = MessageActions;

interface Props {
  paper: Paper;
  children: any;
  onUpdate?: Function;
  isOpen?: boolean;
  metadata: DocumentMetadata;
}

const tabs: Array<Tab> = [
  {
    label: "Metadata",
    value: "metadata",
  },
  {
    label: "Abstract",
    value: "abstract",
  },
];

const PaperMetadataModal = ({
  paper,
  children,
  onUpdate,
  metadata,
  isOpen = false,
}: Props) => {
  const [_isOpen, setIsOpen] = useState<boolean>(isOpen);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].value);
  const _tabs = tabs.map((tab) => ({
    ...tab,
    isSelected: tab.value === activeTab,
  }));
  const dispatch = useDispatch();

  return (
    <div>
      <BaseModal
        modalStyle={modalStyles.modalStyle}
        closeModal={() => {
          setIsOpen(false);
        }}
        offset={"0px"}
        zIndex={99999999}
        isOpen={_isOpen}
        title={`Edit Paper`}
      >
        <div className={css(modalStyles.bodyWrapper)}>
          <div className={css(modalStyles.tabsWrapper)}>
            <HorizontalTabBar
              tabs={_tabs}
              onClick={(tab) => setActiveTab(tab.value)}
            />
          </div>
          <div
            className={css(
              modalStyles.tabContentWrapper,
              activeTab === "abstract" && modalStyles.tabContentWrapperActive
            )}
          >
            <PaperPageAbstractSection
              paper={paper.raw}
              permanentEdit={true}
              onUpdate={(updated) => {
                dispatch(setMessage("Abstract updated"));
                // @ts-ignore
                dispatch(showMessage({ show: true, error: false }));
                setIsOpen(false);

                onUpdate &&
                  onUpdate({
                    abstract: updated,
                    abstractHtml: updated,
                  });

                setIsOpen(false);
              }}
            />
          </div>
          <div
            className={css(
              modalStyles.tabContentWrapper,
              activeTab === "metadata" && modalStyles.tabContentWrapperActive
            )}
          >
            <PaperMetadataForm
              metadata={metadata}
              onUpdate={(updated) => {
                onUpdate && onUpdate(updated);
                setIsOpen(false);
              }}
              paper={paper}
            />
          </div>
        </div>
      </BaseModal>
      <div
        onClick={() => {
          setActiveTab(tabs[0].value);
          setIsOpen(true);
        }}
      >
        {children}
      </div>
    </div>
  );
};

const modalStyles = StyleSheet.create({
  modalStyle: {
    width: 850,
  },
  bodyWrapper: {
    width: "100%",
    marginTop: 45,
  },
  tabContentWrapper: {
    display: "none",
    maxHeight: 400,
    overflowY: "scroll",
    padding: 10,
  },
  tabContentWrapperActive: {
    display: "block",
  },
  tabsWrapper: {
    borderBottom: "2px solid #E5E5E5",
  },
});

export default PaperMetadataModal;
