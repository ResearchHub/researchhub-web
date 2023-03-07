import { useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { generateApiUrl } from "~/config/api";
import ALink from "../ALink";
import Button from "../Form/Button";

interface UserPopoverType {
  id?: number;
  first_name?: string;
  last_name?: string;
  reputation?: number;

  author_profile?: {
    profile_image: string;
    description: string;
  };
}

const UserPopover = ({ userId }) => {
  const [fetchedUser, setUser] = useState<UserPopoverType>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopover = async () => {
      const url = generateApiUrl(`popover/user/${userId}`);
      const resp = await fetch(url);
      const json = await resp.json();
      setUser(json);
      setLoading(false);
    };

    fetchPopover();
  }, []);

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
      <div>{fetchedUser.author_profile?.description}</div>

      <div style={{ lineHeight: "24px" }}>
        <div
          style={{
            display: "flex",
            columnGap: "5px",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <div style={{ display: "flex", columnGap: "5px" }}>
            <img
              height={20}
              src="/static/icons/editor-star.png"
              width={20}
              className={css(styles.editorImg)}
            />
            Editor of
          </div>
          <div>
            <ALink theme="solidPrimary" href="">
              Immunology
            </ALink>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            columnGap: "5px",
            alignItems: "center",
          }}
        >
          {/* <div style={{ color: "#BCBAC2" }}>{icons.graduationCap}</div> */}
          Immunology MS '21, University of Alberta
        </div>

        <div
          style={{
            display: "flex",
            columnGap: "5px",
            alignItems: "center",
          }}
        >
          <img
            src="/static/ResearchHubIcon.png"
            className={css(styles.rhIcon)}
            height={20}
            style={{ marginRight: 5 }}
            alt="reserachhub-icon"
          />
          <div>Lifetime reputation: {fetchedUser?.reputation}</div>
        </div>
      </div>

      <div style={{ marginTop: 15 }}>
        <Button hideRipples={true} fullWidth={true}>
          View profile
        </Button>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    background: "#fff",
    padding: 16,
    maxWidth: 350,
    borderRadius: 4,
    textAlign: "center",
  },
  name: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 500,
    textAlign: "center",
  },
  avatar: {
    borderRadius: "50%",
    objectFit: "cover",
  },
});

export default UserPopover;
