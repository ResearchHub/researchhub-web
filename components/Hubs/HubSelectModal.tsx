import { useEffect, useState } from "react";
import { breakpoints } from "~/config/themes/screen";
import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import { Hub } from "~/config/types/hub";
import HubSelect from "../Hubs/HubSelect";
import { getHubs } from "~/components/Hubs/api/fetchHubs";

const HubSelectModal = ({
  isModalOpen = true,
  handleModalClose,
  handleSelect,
}) => {
  const [hubs, setHubs] = useState<Array<Hub>>([]);

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const { hubs, count } = await getHubs({});
      setHubs(hubs);
    })();
  }, []);

  return (
    <BaseModal
      offset={"0px"}
      isOpen={isModalOpen}
      hideClose={false}
      title={"Filter by Hub"}
      closeModal={handleModalClose}
      zIndex={12}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
    >
      <div className={css(styles.formWrapper)}>
        <HubSelect
          count={1}
          hubs={hubs}
          withPagination={false}
          maxCardsPerRow={2}
          handleClick={(hub) => {
            handleSelect(hub);
          }}
        />
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    width: 540,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 25,
    boxSizing: "border-box",
    height: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "90%",
    },
  },
  modalStyle: {
    width: "540px",
    maxHeight: 600,
  },
  modalTitleStyleOverride: {},
  modalContentStyle: {
    position: "relative",
    minHeight: 560,
    overflowX: "hidden",
    padding: "50px 25px ",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      height: "100%",
    },
  },
  prevActionWrapper: {
    position: "absolute",
    top: 12,
    left: 10,
  },
});

export default HubSelectModal;
