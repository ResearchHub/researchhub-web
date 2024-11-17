import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem as MuiMenuItem } from '@mui/material';
import { StyleSheet, css } from "aphrodite";
import { useState, ReactElement, MouseEvent } from "react";
import { 
  faChevronDown,
  faFlask,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import RhJournalIcon from "~/components/Icons/RhJournalIcon";
import { PostIcon, QuestionIcon } from "~/config/themes/icons";
import PaperVersionModal from "~/components/Document/lib/PaperVersion/PaperVersionModal";
import { paper } from "~/redux/paper/shims";
import { ACTION } from "~/components/Document/lib/PaperVersion/PaperVersionTypes";

type MenuItemType = {
  id: string;
  icon: ReactElement;
  title: string;
  description: string;
  badge?: ReactElement;
  iconStyle?: React.CSSProperties;
};

function PublishButton({ customButtonStyle }: { customButtonStyle?: React.CSSProperties }): ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [paperModalAction, setPaperModalAction] = useState("INTRO_PUBLISH_RESEARCH");
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: string): void => {
    if (action === 'journal') {
      setPaperModalAction("PUBLISH_IN_JOURNAL");
      setShowPaperModal(true);
    } else if (action === 'research') {
      setPaperModalAction("PUBLISH_RESEARCH");
      setShowPaperModal(true);
    }
    handleClose();
  };

  const menuItems: MenuItemType[] = [
    {
      id: 'journal',
      icon: <RhJournalIcon color={colors.TEXT_GREY(0.8)} width={21} height={21} />,
      title: 'Publish in ResearchHub Journal',
      description: 'Submit your research for peer review and publication in our journal',
      badge: <div style={{ backgroundColor: colors.ORANGE_LIGHT() }} className={css(styles.badge)}>Low APCs</div>,
      iconStyle: { marginTop: -2 },
    },
    {
      id: 'research',
      icon: <FontAwesomeIcon icon={faFlask as IconProp} className={css(styles.menuIcon)} />,
      title: 'Publish your research',
      description: 'Share your findings, preprints, or research papers with the community',
      badge: <div style={{ backgroundColor: "rgb(211 237 247)" }} className={css(styles.badge)}>Free and Open</div>,
    },
    {
      id: 'post',
      icon: <PostIcon width={20} height={20} color={colors.TEXT_GREY(0.8)} onClick={undefined} />,
      title: 'Publish a post',
      description: 'Write about research developments, insights, or scientific discussions',
    },
    {
      id: 'question',
      icon: <QuestionIcon color={colors.TEXT_GREY(0.8)} size={18} onClick={undefined} />,
      title: 'Ask a Question',
      description: 'Get answers and insights from the research community',
    },
    {
      id: 'paper',
      icon: <FontAwesomeIcon icon={faShare as IconProp} className={css(styles.menuIcon)} />,
      title: 'Share a paper',
      description: 'Share and discuss published papers with the research community',
    },
  ];

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
        {menuItems.map((item, index) => (
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
                  {item.badge && (
                    <span className={css(styles.badge)}>{item.badge}</span>
                  )}
                </div>
                <span className={css(styles.menuItemDescription)}>
                  {item.description}
                </span>
              </div>
            </MuiMenuItem>
          </div>
        ))}
      </Menu>
      
      {showPaperModal && paperModalAction && (
        <PaperVersionModal
          isOpen={showPaperModal}
          closeModal={() => setShowPaperModal(false)}
          action={paperModalAction as ACTION}
        />
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
  menu: {
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
    padding: '0px 8px',
    borderRadius: 4,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.NEW_BLUE(0.2),
    margin: '8px -16px',
  },
}); 

export default PublishButton;