import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { generateApiUrl } from "~/config/api";
import { faGraduationCap } from "@fortawesome/pro-solid-svg-icons";
import Image from "next/image";

// Components
import Button from "../../Form/Button";

// Utils
import { createEditorSummary, createEduSummary } from "~/config/utils/user";
import { parseUser, ID, RHUser } from "~/config/types/root_types";
import { timeSince } from "~/config/utils/dates";
import colors from "~/config/themes/colors";
import { truncateText } from "~/config/utils/string";
import { breakpoints } from "~/config/themes/screen";
import { useRouter } from "next/router";

const TRUNCATE_SIZE = 100;

const UserPopover = ({ userId }: { userId: ID }): ReactElement | null => {
  const [fetchedUser, setUser] = useState<RHUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchPopover = async () => {
      const url = generateApiUrl(`popover/${userId}/get_user`);
      const resp = await fetch(url);
      const json = await resp.json();
      if (resp.ok) {
        setUser(parseUser(json));
        setLoading(false);
      }
    };

    fetchPopover();
  }, []);

  if (loading) {
    return null;
  }

  const educationSummary = createEduSummary(fetchedUser?.authorProfile);

  return (
    <div className={css(styles.container)}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Image
          height={56}
          width={56}
          className={css(styles.avatar)}
          alt={`${fetchedUser?.firstName} ${fetchedUser?.lastName}`}
          src={fetchedUser?.authorProfile?.profileImage || ""}
        />
        <div className={css(styles.descSection)}>
          <div className={css(styles.name)}>
            {fetchedUser?.firstName} {fetchedUser?.lastName}
          </div>

          <div
            className={css(
              styles.desc,
              !fetchedUser?.authorProfile?.description && styles.autoDesc
            )}
          >
            {fetchedUser?.authorProfile?.description
              ? !showMore
                ? truncateText(
                    fetchedUser?.authorProfile?.description,
                    TRUNCATE_SIZE
                  )
                : fetchedUser?.authorProfile?.description
              : `${fetchedUser?.firstName} joined ResearchHub ${timeSince(
                  fetchedUser?.createdAt
                )}`}

            {fetchedUser?.authorProfile?.description?.length >
              TRUNCATE_SIZE && (
              <div
                className={css(styles.showMore)}
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Show Less" : "Show More"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px", color: "#7C7989" }}>
        {!!fetchedUser?.editorOf && !!fetchedUser?.editorOf?.length && (
          <div className={css(styles.row)}>
            <div className={css(styles.iconColumn)}>
              <Image
                alt="editor-star"
                height={17}
                src="/static/user/editor-star.png"
                width={17}
                className={css(styles.editorImg)}
              />
            </div>
            <div>Editor of</div>

            {createEditorSummary(fetchedUser?.editorOf)}
          </div>
        )}

        {!!educationSummary && (
          <div className={css(styles.row)}>
            <div
              className={css(styles.iconColumn)}
              style={{ color: colors.BLACK(0.25), marginRight: 4 }}
            >
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            {educationSummary}
          </div>
        )}

        <div className={css(styles.row, styles.reputationRow)}>
          <div className={css(styles.iconColumn)}>
            <img
              src="/static/user/user-desc-rsc.png"
              className={css(styles.rhIcon)}
              height={18}
              style={{ marginRight: 5, marginLeft: 3 }}
              alt="reserachhub-icon"
            />
          </div>
          <div>Lifetime Reputation: {fetchedUser?.reputation}</div>
        </div>
      </div>

      <div style={{ marginTop: 15 }}>
        <Button
          hideRipples={true}
          fullWidth={true}
          onClick={(e) => {
            if (e.metaKey) {
              window.open(fetchedUser?.authorProfile?.url, "_blank");
            } else {
              router.push(fetchedUser?.authorProfile?.url);
            }
          }}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    background: colors.WHITE(),
    padding: 16,
    width: 300,
    maxWidth: 300,
    borderRadius: 4,
    lineHeight: 1.4,
    display: "flex",
    flexDirection: "column",
    // textAlign: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  iconColumn: {
    width: 22,
  },
  reputationRow: {
    alignItems: "center",
  },
  showMore: {
    color: colors.BLUE(),
    marginTop: 4,
    cursor: "pointer",
  },
  descSection: {
    textAlign: "left",
    marginLeft: 12,
  },
  name: {
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 500,
  },
  desc: {
    marginTop: 6,
    fontSize: 14,
  },
  avatar: {
    borderRadius: "50%",
    objectFit: "cover",
  },
  editorImg: {
    // marginRight: 4,
    marginRight: 2,
  },
  row: {
    display: "flex",
    columnGap: "5px",
    alignItems: "flex-start",
    fontSize: 14,
    marginBottom: 8,
  },
  autoDesc: {
    fontStyle: "italic",
    fontSize: 14,
    opacity: 0.5,
  },
});

export default UserPopover;
