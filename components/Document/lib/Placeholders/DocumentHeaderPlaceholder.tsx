import { StyleSheet, css } from "aphrodite";
import {
  RoundShape,
  TextBlock,
  RectShape,
} from "react-placeholder/lib/placeholders";
import { voteWidgetIcons } from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";

const DocumentHeaderPlaceholder = ({ color = "#EFEFEF" }) => {
  const metaRow = (index) => (
    <div key={index} className={css(styles.row, styles.metaRow)}>
      <div className={css(styles.metaKey)}>
        <TextBlock rows={1} color={color} style={{ width: "100%" }} />
      </div>
      <div className={css(styles.metaVal)}>
        <TextBlock rows={1} color={color} style={{ width: "100%" }} />
      </div>
    </div>
  );

  const header = (
    <div className={css(styles.header)}>
      <RectShape color={color} className={css(styles.badge)} />
      <RectShape color={color} className={css(styles.title)} />
      <RectShape color={color} className={css(styles.title)} />
      <div className={css(styles.metadata)}>
        {[1, 2, 3].map((i) => metaRow(i))}
      </div>
    </div>
  );

  const tabs = (
    <div className={css(styles.tabs)}>
      <RectShape color={color} className={css(styles.tab)} />
      <RectShape color={color} className={css(styles.tab)} />
      <RectShape color={color} className={css(styles.tab)} />
      <RectShape color={color} className={css(styles.tab)} />
      <RectShape color={color} className={css(styles.tab)} />
    </div>
  );

  const actions = (
    <div className={css(styles.row, styles.actionsContainer)}>
      <RoundShape className={css(styles.actions)} color={color} />
      <RoundShape className={css(styles.actions)} color={color} />
    </div>
  );

  return (
    <div
      className={css(styles.placeholderContainer) + " show-loading-animation"}
    >
      <div className={css(styles.voteContainer)}>
        {voteWidgetIcons.upvote}
        <RectShape color={color} className={css(styles.voteSquare)} />
        {voteWidgetIcons.downvote}
      </div>
      <div className={css(styles.spaceBetween)}>
        <div className={css(styles.column)}>
          {header}

          <div className={css(styles.additionalDetails)}>{actions}</div>
          <div className={css(styles.tabsWrapper)}>{tabs}</div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    width: "100%",
    position: "relative",
    paddingTop: 10,
  },
  tabsWrapper: {
    marginTop: 25,
  },
  tabs: {
    width: "100%",
    display: "flex",
  },
  tab: {
    width: "20%",
    height: 25,
    ":last-child": {
      marginRight: 0,
    },
  },
  round: {
    width: 53,
    height: 25,
    position: "absolute",
    top: 32,
    left: -70,
  },
  title: {
    height: 25,
    width: "100%",
    marginBottom: 10,
  },
  badge: {
    height: 25,
    width: 65,
    marginBottom: 10,
  },
  actionsContainer: {
    marginLeft: "auto",
    width: "auto",
    marginBottom: 0,
  },
  actions: {
    width: 100,
    height: 35,
    marginRight: 10,
    ":last-child": {
      marginRight: 0,
    },
  },
  voteSquare: {
    width: 28,
    height: 25,
    marginBottom: 7,
    marginTop: 7,
    borderRadius: 3,
    marginRight: 0,
  },
  voteContainer: {
    position: "absolute",
    left: -70,
    top: 25,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#EFEFEF",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  additionalDetails: {
    display: "flex",
    alignItems: "center",
  },
  additionalDetail: {
    width: 100,
    marginRight: 15,
  },
  header: {
    paddingBottom: 20,
  },
  paddingTop: {
    paddingTop: 8,
  },
  textRow: {},
  column: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  columnRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  row: {
    display: "flex",
    marginBottom: 15,
    width: "100%",
  },
  metaRow: {
    marginBottom: 10,
  },
  metadata: {
    marginTop: 15,
  },
  metaKey: {
    width: 100,
    marginRight: 15,
  },
  metaVal: {
    width: "250px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: 200,
    },
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  marginBottom: {
    marginBottom: 0,
  },
  bottom: {
    marginTop: 20,
    marginBottom: 0,
  },
  space: {},
  label: {},
});

export default DocumentHeaderPlaceholder;
