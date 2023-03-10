import { useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { generateApiUrl } from "~/config/api";
import ALink from "../ALink";
import Button from "../Form/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/pro-solid-svg-icons";
import { createEditorSummary, createEduSummary } from "~/config/utils/user";

interface UserPopoverType {
  id?: number;
  first_name?: string;
  last_name?: string;
  reputation?: number;

  author_profile?: {
    id: number;
    profile_image: string;
    description: string;
  };
  editor_of?: [
    {
      source: {
        id: number;
        name: string;
        slug: string;
      };
    }
  ];
}

const UserPopover = ({ userId }) => {
  const [fetchedUser, setUser] = useState<UserPopoverType>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopover = async () => {
      const url = generateApiUrl(`popover/${userId}/get_user`);
      const resp = await fetch(url);
      const json = await resp.json();
      setUser(json);
      setLoading(false);
    };

    fetchPopover();
  }, []);

  if (loading) {
    return null;
  }

  const educationSummary = createEduSummary(fetchedUser.author_profile);

  console.log(educationSummary);

  return (
    <div className={css(styles.container)}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <img
          height={90}
          width={90}
          className={css(styles.avatar)}
          src={fetchedUser.author_profile?.profile_image}
        />
      </div>
      <div className={css(styles.name)}>
        {fetchedUser.first_name} {fetchedUser.last_name}
      </div>
      <div className={css(styles.desc)}>
        {fetchedUser.author_profile?.description}
      </div>

      <div style={{ marginTop: "auto" }}>
        {!!fetchedUser?.editor_of && !!fetchedUser?.editor_of?.length && (
          <div className={css(styles.row)}>
            <img
              height={20}
              src="/static/icons/editor-star.png"
              width={20}
              className={css(styles.editorImg)}
            />
            <div>Editor of</div>

            {createEditorSummary(fetchedUser?.editor_of)}
          </div>
        )}

        {!!educationSummary && (
          <div className={css(styles.row)}>
            <div style={{ color: "#BCBAC2", marginRight: 4 }}>
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            {educationSummary}
          </div>
        )}

        <div className={css(styles.row)}>
          <img
            src="/static/ResearchHubIcon.png"
            className={css(styles.rhIcon)}
            height={20}
            style={{ marginRight: 5, marginLeft: 3 }}
            alt="reserachhub-icon"
          />
          <div>Lifetime Reputation: {fetchedUser?.reputation}</div>
        </div>
      </div>

      <div style={{ marginTop: 15 }}>
        <Button
          hideRipples={true}
          isLink={{
            href: "/user/[authorId]/[tabName]",
            linkAs: `/user/${fetchedUser?.author_profile?.id}/overview`,
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
    background: "#fff",
    padding: 16,
    width: 300,
    maxWidth: 300,
    borderRadius: 4,
    lineHeight: 1.4,
    display: "flex",
    flexDirection: "column",
    // textAlign: "center",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  name: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 500,
    textAlign: "center",
  },
  desc: {
    textAlign: "center",
    marginBottom: 8,
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
    alignItems: "center",
    fontSize: 14,
    marginBottom: 8,
  },
});

export default UserPopover;
