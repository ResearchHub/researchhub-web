import withWebSocket from "~/components/withWebSocket";
import Button from "../../Form/Button";
import { useEffect, useState } from "react";
import FormInput from "../../Form/FormInput";
import { StyleSheet, css } from "aphrodite";
import { ID, parseUser } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
import { OpenAlexAuthor, OpenAlexWork } from "../../Verification/lib/types";
import FormSelect from "../../Form/FormSelect";
import colors from "~/config/themes/colors";
import VerificationPaperResult from "../../Verification/VerificationPaperResult";
import CheckBox from "~/components//Form/CheckBox";
import { AuthorClaimError } from "~/components/Publication/lib/types";
import { Avatar } from "@mui/material";
import {
  fetchPublicationsByDoi,
  addPublicationsToAuthor,
} from "~/components/Publication/lib/api";
import { useSelector, connect } from "react-redux";
import { useAlert } from "react-alert";
import showGenericToast from "~/components/Notifications/lib/showGenericToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faInfoCircle } from "@fortawesome/pro-solid-svg-icons";
import {
  faArrowLeft,
  faInfoCircle as faInfoCircleLight,
} from "@fortawesome/pro-light-svg-icons";
import { PaperIcon } from "~/config/themes/icons";
import { TextBlock, RoundShape } from "react-placeholder/lib/placeholders";
import UnifiedDocFeedCardPlaceholder from "~/components/UnifiedDocFeed/UnifiedDocFeedCardPlaceholder";
import { ClipLoader } from "react-spinners";

import {
  Notification,
  parseNotification,
} from "~/components/Notifications/lib/types";
import IconButton from "~/components/Icons/IconButton";

export type STEP =
  | "DOI"
  | "NEEDS_AUTHOR_CONFIRMATION"
  | "RESULTS"
  | "ERROR"
  | "LOADING"
  | "FINISHED";
type ERROR_TYPE =
  | "DOI_NOT_FOUND"
  | "GENERIC_ERROR"
  | "ALREADY_CLAIMED_BY_CURRENT_USER"
  | "ALREADY_CLAIMED_BY_ANOTHER_USER"
  | null;
export const ORDERED_STEPS: Array<STEP> = [
  "DOI",
  "NEEDS_AUTHOR_CONFIRMATION",
  "RESULTS",
  "LOADING",
  "FINISHED",
];

interface Props {
  wsResponse: any;
  onStepChange?: ({ step }: { step: STEP }) => void;
  onDoThisLater?: () => void;
  allowDoThisLater: boolean;
}

const AddPublicationsForm = ({
  wsResponse,
  onStepChange,
  onDoThisLater,
  allowDoThisLater,
}: Props) => {
  const [paperDoi, setPaperDoi] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<
    null | undefined | ID
  >(null);
  const [availableAuthors, setAvailableAuthors] = useState<OpenAlexAuthor[]>(
    []
  );
  const [publications, setPublications] = useState<OpenAlexWork[]>([]);
  const [error, setError] = useState<ERROR_TYPE>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [step, setStep] = useState<STEP>("DOI");
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const [selectedPaperIds, setSelectedPaperIds] = useState<Array<string>>([]);
  const [notificationsReceived, setNotificationsReceived] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    if (!wsResponse) return;

    try {
      const incomingNotification = parseNotification(wsResponse);
      setNotificationsReceived([
        ...notificationsReceived,
        incomingNotification,
      ]);

      if (incomingNotification.type === "PUBLICATIONS_ADDED") {
        setStep("FINISHED");
      }
    } catch (e) {
      console.error(`Failed to parse notification: ${e}`);
    }
  }, [wsResponse]);

  const handleFetchPublications = async ({
    doi,
    authorId,
  }: {
    doi: string;
    authorId?: null | undefined | ID;
  }) => {
    try {
      setIsFetching(true);
      const response = await fetchPublicationsByDoi({ doi, authorId });

      // Set publications but put the publication that matches DOI first
      const foundIdx = response.works.findIndex(
        (work) => work.doi?.includes(doi) || work.doiUrl?.includes(doi)
      );
      if (foundIdx > -1) {
        const publication = response.works[foundIdx];
        response.works.splice(foundIdx, 1);
        response.works.unshift(publication);
        setSelectedPaperIds([publication.id]);
      }

      setPublications(response.works);
      setSelectedAuthorId(response.selectedAuthorId);
      setAvailableAuthors(response.availableAuthors);

      if (!response.selectedAuthorId) {
        setStep("NEEDS_AUTHOR_CONFIRMATION");
      } else if (selectedAuthorId && response.works.length > 0) {
        setStep("RESULTS");
      }
      setIsFetching(false);
    } catch (error) {
      if (error instanceof Error && error.message === "404") {
        setError("DOI_NOT_FOUND");
      } else {
        setError("GENERIC_ERROR");
      }
      setIsFetching(false);
    }
  };

  const handleDoThisLater = () => {
    onDoThisLater && onDoThisLater();
    showGenericToast({
      body: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon
            fontSize={24}
            style={{ color: colors.MEDIUM_GREY(), marginRight: 10 }}
            icon={faInfoCircle}
          />
          Visit the 'Publications' tab on your profile to resume
        </div>
      ),
      closeLabel: "OK",
      withCloseBtn: true,
    });
  };

  useEffect(() => {
    if (onStepChange) {
      onStepChange({ step });
    }
  }, [step]);

  const authorDropdownOptions = availableAuthors.map((author, index) => ({
    ...author,
    label: author.displayName,
    value: author.id,
    id: author.id,
  }));
  const selectedAuthor = availableAuthors.find(
    (author) => author.id === selectedAuthorId
  );

  return (
    <div>
      {(step === "RESULTS" || step === "NEEDS_AUTHOR_CONFIRMATION") && (
        <IconButton overrideStyle={styles.backButton}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            onClick={() => {
              if (step === "RESULTS" || step === "NEEDS_AUTHOR_CONFIRMATION") {
                setStep("DOI");
              }
            }}
          />
        </IconButton>
      )}
      {step === "DOI" && (
        <div>
          <FormInput
            error={
              paperDoi &&
              error &&
              (error === "GENERIC_ERROR"
                ? "Please enter a valid DOI."
                : "Paper not found. Please try another DOI.")
            }
            value={paperDoi || ""}
            label="Enter a DOI for any paper you authored:"
            placeholder={"e.g. 10.1038/s41586-023-06466-x"}
            disabled={isFetching}
            containerStyle={styles.inputContainer}
            onChange={(name, value) => {
              setPaperDoi(value.trim());
            }}
          />
          <div className={css(styles.buttonsWrapper)}>
            {allowDoThisLater && (
              <Button
                onClick={() => handleDoThisLater()}
                customButtonStyle={styles.doThisLaterButton}
                variant="text"
              >
                Do this later
              </Button>
            )}
            <div className={css(styles.nextBtnWrapper)}>
              <Button
                size="med"
                fullWidth
                disabled={!paperDoi || isFetching}
                onClick={() => handleFetchPublications({ doi: paperDoi })}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {isFetching ? (
                    <ClipLoader
                      loading={true}
                      size={24}
                      color={colors.WHITE()}
                    />
                  ) : (
                    <>Next</>
                  )}
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
      {step === "NEEDS_AUTHOR_CONFIRMATION" && (
        <div>
          <div>Please confirm which of these authors you are:</div>

          <FormSelect
            onChange={(_type: string, authorDatum: OpenAlexAuthor): void => {
              setSelectedAuthorId(authorDatum.id);
            }}
            id="author"
            label="Author"
            options={authorDropdownOptions}
            placeholder="Choose an Author"
            required={true}
            type="select"
            reactSelect={{ styles: { menuList: styles.menuListOverride } }}
            value={authorDropdownOptions.find(
              (author) => author.id === selectedAuthorId
            )}
          />
          <div style={{ justifyContent: "flex-end", display: "flex" }}>
            <div className={css(styles.nextBtnWrapper)}>
              <Button
                fullWidth
                disabled={!selectedAuthorId || isFetching}
                onClick={() => {
                  handleFetchPublications({
                    doi: paperDoi,
                    authorId: selectedAuthorId,
                  });
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {isFetching ? (
                    <ClipLoader
                      loading={true}
                      size={24}
                      color={colors.WHITE()}
                    />
                  ) : (
                    <>Next</>
                  )}
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
      {step === "RESULTS" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className={css(styles.selectAll)}>
              <CheckBox
                active={selectedPaperIds.length === publications.length}
                isSquare={true}
                small={true}
                onChange={(a, b) => {
                  if (selectedPaperIds.length === publications.length) {
                    setSelectedPaperIds([]);
                  } else {
                    setSelectedPaperIds(
                      publications.map((publication) => publication.id)
                    );
                  }
                }}
                label={undefined}
                labelStyle={undefined}
              />
              Select All
              {selectedPaperIds.length > 0 && (
                <span>&nbsp;({selectedPaperIds.length})</span>
              )}
            </div>
            <div>
              {selectedAuthor && (
                <div className={css(styles.authorWrapper)}>
                  <div className={css(styles.author)}>
                    <Avatar sx={{ height: 24, width: 24, fontSize: 14 }}>
                      {selectedAuthor.initials}
                    </Avatar>
                    {selectedAuthor.displayName}
                  </div>
                  <span
                    className={css(styles.changeAuthor)}
                    onClick={() => setStep("NEEDS_AUTHOR_CONFIRMATION")}
                  >
                    (Change)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={css(styles.publicationsWrapper)}>
            {publications.map((publication) => (
              <div
                className={css(
                  styles.publicationWrapper,
                  selectedPaperIds.includes(publication.id) &&
                    styles.selectedPublication
                )}
              >
                <CheckBox
                  active={selectedPaperIds.includes(publication.id)}
                  isSquare={true}
                  small={true}
                  onChange={() => {
                    selectedPaperIds.includes(publication.id)
                      ? setSelectedPaperIds(
                          selectedPaperIds.filter((id) => id !== publication.id)
                        )
                      : setSelectedPaperIds([
                          ...selectedPaperIds,
                          publication.id,
                        ]);
                  }}
                  label={undefined}
                  labelStyle={undefined}
                />
                <VerificationPaperResult result={publication} />
              </div>
            ))}
          </div>
          <div
            className={css(
              styles.buttonsWrapper,
              styles.buttonsWrapperForResults
            )}
          >
            {/* <div className={css(styles.paperMissingText)}>
              <FontAwesomeIcon
                fontSize={18}
                icon={faInfoCircleLight}
                style={{ marginRight: 5 }}
              />
              Don’t see all your papers?
              <br />
              You will have the ability to add additional papers in your author
              profile.
            </div> */}

            <Button
              disabled={selectedPaperIds.length === 0 || isFetching}
              fullWidth
              onClick={async () => {
                try {
                  setStep("LOADING");
                  setIsFetching(true);
                  const response = await addPublicationsToAuthor({
                    authorId: currentUser?.authorProfile.id,
                    openAlexPublicationIds: selectedPaperIds,
                    openAlexAuthorId: selectedAuthorId,
                  });
                  setIsFetching(false);
                } catch (error: any) {
                  setStep("ERROR");
                  if (error instanceof AuthorClaimError) {
                    // @ts-ignore
                    setError(error.reason);
                  } else {
                    setError("GENERIC_ERROR");
                  }
                  setIsFetching(false);
                }
              }}
            >
              Add Publications
            </Button>
          </div>
        </div>
      )}
      {step === "LOADING" && (
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PaperIcon
              withAnimation
              width={60}
              height={60}
              color={`#aeaeae`}
              onClick={undefined}
            />
          </div>
          <div className={css(styles.loadingTitle)}>
            Adding publications to your profile...
          </div>
          <div className={css(styles.loadingText)}>
            This may take a few minutes. We will notify you when the process is
            complete. Feel free to close this popup.
          </div>
        </div>
      )}
      {step === "ERROR" && (
        <div>An unexpected error has occured. Please try again later.</div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  menuListOverride: {
    maxHeight: 80,
  },
  loadingTitle: {
    display: "flex",
    justifyContent: "center",
    marginTop: 15,
    fontSize: 22,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 15,
  },
  loadingText: {
    textAlign: "center",
    color: colors.MEDIUM_GREY2(),
    fontSize: 18,
  },
  selectedPublication: {
    border: `1px solid ${colors.NEW_BLUE(1.0)}`,
  },
  paperMissingText: {
    color: "#7C7989",
    display: "flex",
    width: 300,
    fontSize: 14,
    columnGap: "10px",
  },
  doThisLaterButton: {
    color: colors.NEW_BLUE(),
    fontWeight: 400,
  },
  buttonsWrapper: {
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "10px",
  },
  buttonsWrapperForResults: {},
  nextBtnWrapper: {
    width: 100,
  },
  author: {
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
  },
  authorWrapper: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
  },
  changeAuthor: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    fontSize: 12,
  },
  publicationsWrapper: {
    overflowY: "scroll",
  },
  publicationWrapper: {
    border: `1px solid ${colors.LIGHT_GREY()}`,
    display: "flex",
    padding: 10,
    alignItems: "baseline",
    marginBottom: 10,
  },
  selectAll: {
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 0,
    color: colors.NEW_BLUE(),
    fontWeight: 500,
    // backgroundColor: colors.LIGHT_GREY(1.0),
    borderRadius: "4px",
    display: "inline-flex",
    // padding: "10px 20px",
  },
  inputContainer: {
    marginBottom: 0,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 7,
    fontSize: 20,
    cursor: "pointer",
  },
  close: {
    position: "absolute",
    right: 10,
    top: 7,
    cursor: "pointer",
  },
  titleWrapper: {
    padding: 15,
    marginBottom: 15,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    display: "flex",
    fontSize: 16,
  },
  titleWrapperWithBorder: {
    borderBottom: `1px solid ${colors.LIGHT_GREY()}`,
  },
});

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});

const mapDispatchToProps = (dispatch) => ({});

export default withWebSocket(
  // @ts-ignore legacy hook
  connect(mapStateToProps, mapDispatchToProps)(AddPublicationsForm)
);
