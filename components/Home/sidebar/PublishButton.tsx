import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem as MuiMenuItem, Modal } from '@mui/material';
import { StyleSheet, css } from "aphrodite";
import { useState, ReactElement, MouseEvent } from "react";
import { 
  faChevronDown,
  faFlask,
  faShare,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import RhJournalIcon from "~/components/Icons/RhJournalIcon";
import { PostIcon, QuestionIcon, CloseIcon, BoltSvg } from "~/config/themes/icons";
import PaperVersionModal from "~/components/Document/lib/PaperVersion/PaperVersionModal";
import { ACTION } from "~/components/Document/lib/PaperVersion/PaperVersionTypes";
import { breakpoints } from "~/config/themes/screen";
import PaperUploadWizardContainer from "~/components/Paper/UploadWizard/PaperUploadWizardContainer";
import AskQuestionForm from "~/components/Question/AskQuestionForm";
import { createNewNote } from "~/config/fetch";
import { NOTE_GROUPS } from "~/components/Notebook/config/notebookConstants";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";

type MenuItemType = {
  id: string;
  icon: ReactElement;
  title: string;
  description: string;
  badge?: ReactElement;
  iconStyle?: React.CSSProperties;
};

function PublishButton({ customButtonStyle }: { customButtonStyle?: React.CSSProperties }): ReactElement {
  const user = useSelector((state: RootState) => state.auth?.user);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [paperModalAction, setPaperModalAction] = useState("INTRO_PUBLISH_RESEARCH");
  const [isMenuModal, setIsMenuModal] = useState(false);
  const [showPaperUploadWizard, setShowPaperUploadWizard] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    if (window.innerWidth <= breakpoints.xsmall.int) {
      setIsMenuModal(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = (): void => {
    setAnchorEl(null);
    setIsMenuModal(false);
  };

  const handleMenuItemClick = async (id: string): Promise<void> => {
    handleClose();

    switch (id) {
      case 'journal':
        setPaperModalAction("PUBLISH_IN_JOURNAL");
        setShowPaperModal(true);
        break;
      case 'research':
        setPaperModalAction("PUBLISH_RESEARCH");
        setShowPaperModal(true);
        break;
      case 'post':
        const note = await createNewNote({
          orgSlug: user?.organization_slug,
          grouping: NOTE_GROUPS.WORKSPACE,
        });
        router.push(`/${user?.organization_slug}/notebook/${note?.id ?? ""}`);
        break;
      case 'question':
        setShowQuestionForm(true);
        break;
      case 'paper':
        setShowPaperUploadWizard(true);
        break;
    }
  };

  const menuItems: MenuItemType[] = [
    {
      id: 'journal',
      icon: <RhJournalIcon color={colors.TEXT_GREY(0.8)} width={21} height={21} />,
      title: 'Publish in ResearchHub',
      description: 'Submit your research for peer review and publication in the ResearchHub journal.',
      badge: <div className={css(styles.badge, styles.journalBadge)}>
        <FontAwesomeIcon icon={faBolt as IconProp} className={css(styles.boltIcon)} />
        <span>14 days</span>
      </div>,
      iconStyle: { marginTop: -2 },
    },
    {
      id: 'research',
      icon: <FontAwesomeIcon icon={faFlask as IconProp} className={css(styles.menuIcon)} />,
      title: 'Publish your Preprint',
      description: 'Upload your preprint to share findings with the research community. Immediate, open-access visibility.',
      badge: <div className={css(styles.badge, styles.preprintBadge)}>Free</div>,
    },
    {
      id: 'post',
      icon: <PostIcon width={20} height={20} color={colors.TEXT_GREY(0.8)} onClick={undefined} />,
      title: 'Write a Post',
      description: 'Share research methods, developments, or insights in a rigorous and open (CC0) forum.',
    },
    {
      id: 'question',
      icon: <QuestionIcon color={colors.TEXT_GREY(0.8)} size={18} onClick={undefined} />,
      title: 'Ask a Question',
      description: 'Get expert insights and responses from leading researchers. Add a grant to accelerate response time.',
    },
    {
      id: 'paper',
      icon: <FontAwesomeIcon icon={faShare as IconProp} className={css(styles.menuIcon)} />,
      title: 'Share a Paper',
      description: 'Highlight and discuss impactful papers with the research community.',
    },
  ];

  const renderMenuItems = () => (
    menuItems.map((item, index) => (
      <div key={`${item.id}-wrapper`}>
        {index === 2 && <div className={css(styles.divider)} />}
        <MuiMenuItem 
          onClick={() => handleMenuItemClick(item.id)} 
          className={css(styles.menuItem)}
        >
          <div className={css(styles.iconColumn)} style={item.iconStyle}>
            {item.icon}
          </div>
          <div className={css(styles.menuItemContent)}>
            <div className={css(styles.menuItemHeader)}>
              <span>{item.title}</span>
              {item.badge && item.badge}
            </div>
            <span className={css(styles.menuItemDescription)}>
              {item.description}
            </span>
          </div>
        </MuiMenuItem>
      </div>
    ))
  );

  return (
    <>
      <Button
        id="create-new-button"
        aria-controls={open ? 'create-new-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        customButtonStyle={{
          ...styles.newButton,
          ...customButtonStyle,
        }}
        label={
          <div className={css(styles.newButtonContent)}>
            <span>Publish</span>
            <FontAwesomeIcon 
              icon={faChevronDown as IconProp} 
              className={css(styles.chevron, open && styles.chevronOpen)} 
            />
          </div>
        }
      />
      
      <Menu
        id="create-new-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'create-new-button',
          sx: { padding: '0 !important' }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: -10,
          horizontal: 'left',
        }}
        PaperProps={{
          elevation: 3,
          className: css(styles.menuPaper),
        }}
      >
        {renderMenuItems()}
      </Menu>

      <Modal
        open={isMenuModal}
        onClose={handleClose}
        aria-labelledby="mobile-publish-modal"
      >
        <div className={css(styles.modalContent)}>
          <div className={css(styles.modalHeader)}>
            <h2>Publish</h2>
            <CloseIcon 
              onClick={handleClose}
              color={colors.TEXT_GREY(0.8)}
              overrideStyle={styles.closeButton}
            />
          </div>
          {renderMenuItems()}
        </div>
      </Modal>
      
      {showPaperModal && paperModalAction && (
        <PaperVersionModal
          isOpen={showPaperModal}
          closeModal={() => setShowPaperModal(false)}
          action={paperModalAction as ACTION}
        />
      )}

      {/* Paper Upload Wizard Modal */}
      {showPaperUploadWizard && (
        <Modal
          open={showPaperUploadWizard}
          onClose={() => setShowPaperUploadWizard(false)}
        >
          <div className={css(styles.wizardModalContent)}>
            <PaperUploadWizardContainer 
              onExit={() => setShowPaperUploadWizard(false)} 
            />
          </div>
        </Modal>
      )}

      {/* Question Form Modal */}
      {showQuestionForm && (
        <Modal
          open={showQuestionForm}
          onClose={() => setShowQuestionForm(false)}
        >
          <div className={css(styles.wizardModalContent)}>
            <AskQuestionForm 
              onExit={() => setShowQuestionForm(false)} 
            />
          </div>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  newButton: {
    height: 40,
    width: "100%",
    backgroundColor: colors.NEW_BLUE(1),
    ':hover': {
      backgroundColor: colors.NEW_BLUE(0.9),
    }
  },
  newButtonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
  },
  chevron: {
    fontSize: 12,
    marginLeft: 4,
    transition: 'transform 0.2s ease',
  },
  chevronOpen: {
    transform: 'rotate(180deg)',
  },
  menuPaper: {
    width: '100%',
    maxWidth: 360,
    padding: 10,
  },
  menuItem: {
    padding: '12px 16px',
    borderRadius: 8,
    ':hover': {
      backgroundColor: colors.LIGHT_GREY(0.8),
    },
    display: 'flex',
    alignItems: 'flex-start',
  },
  iconColumn: {
    width: 24,
    marginRight: 12,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 2,
  },
  menuIcon: {
    fontSize: 18,
    color: colors.TEXT_GREY(0.8),
  },
  menuItemContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  menuItemHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    fontSize: 14,
    fontWeight: 500,
  },
  menuItemDescription: {
    fontSize: 13,
    color: colors.TEXT_GREY(1),
    lineHeight: '1.3',
    whiteSpace: 'pre-wrap',
  },
  badge: {
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 12,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  journalBadge: {
    backgroundColor: colors.ORANGE_LIGHT(),
    color: colors.BLACK(),
  },
  preprintBadge: {
    backgroundColor: colors.ORANGE_LIGHT(),
    color: colors.BLACK(),
  },
  boltIcon: {
    fontSize: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.NEW_BLUE(0.2),
    margin: '8px -16px',
  },
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: 8,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: `1px solid ${colors.LIGHT_GREY(0.5)}`,
    textAlign: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: -8,
    top: -8,
    cursor: 'pointer',
    padding: 8,
  },
  wizardModalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: 5,
    maxWidth: 800,
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      padding: '40px 16px',
      width: '100%',
      height: '100%',
      maxHeight: '100vh',
      borderRadius: 0,
    },
  },
}); 

export default PublishButton;