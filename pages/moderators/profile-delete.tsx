import { StyleSheet, css } from "aphrodite";
import { useContext, useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";

import { useEffectCheckModCredentials } from "~/components/Moderator/useEffectCheckModCredentials";
import ContentPage from "~/components/ContentPage/ContentPage";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import SideColumn from "~/components/Home/SideColumn";
import api, { generateApiUrl } from "~/config/api";
import { NavbarContext } from "../Base";
import Link from "next/link";
import colors from "~/config/themes/colors";
import Button from "~/components/Form/Button";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import dynamic from "next/dynamic";

const SimpleEditor = dynamic(
  () => import("../../components/CKEditor/SimpleEditor")
);

export default function ModeratorProfileDelete() {
  const shouldRenderUI = useEffectCheckModCredentials({ shouldRedirect: true });
  const { setNumProfileDeletes, numProfileDeletes } = useContext(NavbarContext);
  const [profileDeletes, setProfileDeletes] = useState([]);

  const removeFromProfileDeletes = ({ index }) => {
    const newProfileDeletes = [...profileDeletes];
    newProfileDeletes.splice(index, 1);
    setProfileDeletes(newProfileDeletes);
    setNumProfileDeletes(numProfileDeletes - 1);
  };

  const fetchProfileDeletes = async () => {
    const url = generateApiUrl(
      "user_verification",
      "?ordering=created_date&status=INITIATED"
    );
    const res = await fetch(url, api.GET_CONFIG());
    const json = await res.json();
    setNumProfileDeletes(json.count);
    setProfileDeletes(json.results);
  };

  useEffect(() => {
    fetchProfileDeletes();
  }, []);

  if (!shouldRenderUI) {
    return null;
  }

  return (
    <ContentPage
      mainFeed={
        <div className={css(styles.container)}>
          <h1 className={css(styles.header)}>Profile Delete Requests</h1>
          <div className={css(styles.profileDeletes)}>
            {profileDeletes.map((profile, index) => {
              if (!profile.related_author) {
                return null;
              }

              return (
                <AuthorProfileCard
                  profile={profile}
                  index={index}
                  key={index}
                  removeFromProfileDeletes={removeFromProfileDeletes}
                />
              );
            })}
          </div>
        </div>
      }
      sidebar={
        <SideColumn
          listItems={<ModeratorDashboardSidebar />}
          title={"Admin"}
          ready={true}
        />
      }
    />
  );
}

function AuthorProfileCard({ profile, index, removeFromProfileDeletes }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = profile.files.map((images) => ({
    src: images.file,
  }));

  const deleteProfile = async () => {
    const url = generateApiUrl(`author/${profile.related_author}`);
    const res = await fetch(url, api.DELETE_CONFIG());
    removeFromProfileDeletes({ index });
    alert("Profile successfully removed!");
  };

  const cancelRequest = async () => {
    const url = generateApiUrl(`user_verification/${profile.id}`);
    const res = await fetch(url, api.PATCH_CONFIG({ status: "DENIED" }));
    removeFromProfileDeletes({ index });
    alert("Request closed!");
  };

  return (
    <div className={css(styles.profileCard)}>
      <a
        target="_blank"
        href={`/user/${profile.related_author_object.id}/overview`}
        className={css(styles.link)}
        rel="noopener noreferrer"
      >
        View Profile
      </a>

      <div className={css(styles.name)}>
        {profile.related_author_object?.first_name}{" "}
        {profile.related_author_object?.last_name}
      </div>
      <div className={css(styles.reasoning)}>
        {/* <SimpleEditor
          id="details"
          initialData={profile.details}
          label="Removal Details"
          readOnly
          placeholder={
            "Include any relevant information to verify your identity to this profile"
          }
          labelStyle={styles.label}
          containerStyle={styles.editor}
        /> */}
        <div
          // ref={contentRef}
          id="postBody"
          className={css(styles.postBody) + " rh-post"}
          dangerouslySetInnerHTML={{ __html: profile.details }}
        />
      </div>
      <div className={css(styles.images)}>
        {profile.files.map((image, index) => {
          return (
            <img
              className={css(styles.image)}
              src={image.file}
              key={index}
              onClick={() => {
                setLightboxOpen(true);
                setSlideIndex(index);
              }}
            ></img>
          );
        })}
      </div>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images}
        index={slideIndex}
      />

      <div className={css(styles.actionButtons)}>
        <Button
          label={"Close Request"}
          onClick={cancelRequest}
          isWhite={true}
        />
        <Button label={"Delete Profile"} onClick={deleteProfile} />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: "32px",
    maxWidth: 1024,
    // margin: "0 auto",
  },
  header: {
    alignItems: "center",
    display: "flex",
    fontFamily: "Roboto",
    fontSize: "30px",
    fontWeight: 500,
    height: "100%",
  },
  reasoning: {
    marginBottom: 16,
  },
  profileCard: {
    border: "1px solid #ddd",
    padding: 16,
    borderRadius: 4,
    position: "relative",
  },
  link: {
    textDecoration: "none",
    color: colors.BLACK(),
    position: "absolute",
    right: 16,
    top: 16,
    border: "1px solid #ddd",
    padding: "8px 16px",
    borderRadius: 4,
  },
  name: {
    fontSize: 24,
    marginBottom: 16,
  },
  actionButtons: {
    display: "flex",
    gap: 16,
    marginTop: 32,
    justifyContent: "flex-end",
  },
  images: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
  },
  image: {
    maxHeight: 150,
    cursor: "pointer",
    borderRadius: 4,
  },
  profileDeletes: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
});
