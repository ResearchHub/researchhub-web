import { ChangeEvent, ReactElement, SyntheticEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import { faCircleUser } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ID, NullableString } from "~/config/types/root_types";
import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { isValidEmail } from "~/config/utils/validation";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import ReferenceItemRhUserLookupInput from "../../form/ReferenceItemRhUserLookupInput";
import Typography from "@mui/material/Typography";

type Props = {
  initialInviteList?: SuggestedUser[];
  label: string;
  onInputChange: (string: NullableString) => void;
  projectID: ID;
};

export default function ReferenceUserInviteSection({
  label,
  onInputChange,
  projectID,
}: Props): ReactElement {
  const [inviteeEmail, setInviteeEmail] = useState<NullableString>(null);
  const [inviteList, setInviteList] = useState<SuggestedUser[]>([]);
  const [isSendingInvitation, setisSendingInvitation] =
    useState<boolean>(false);
  const _initialInviteList =
    []; /* TODO: calvinhlee -  move this to a api call + useEffect */
  const sendInvitation = () => {
    if (isValidEmail(inviteeEmail)) {
      setInviteList([
        ...inviteList,
        {
          userEmail: nullthrows(
            inviteeEmail,
            "inviteeEmail should not be null"
          ),
        },
      ]);
    }
  };

  const inviteeEls = inviteList.map(({ userEmail }: Invitee) => {
    return (
      <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
        <FontAwesomeIcon icon={faCircleUser} style={{ marginRight: 8 }} />
        {userEmail}
      </div>
    );
  });
  return (
    <Box
      sx={{
        background: "transparent",
        marginBottom: "16px",
        width: "100%",
      }}
    >
      <Typography
        color="rgba(36, 31, 58, 1)"
        fontSize="14px"
        fontWeight={600}
        lineHeight="22px"
        letterSpacing={0}
        mb="4px"
        sx={{ background: "transparent" }}
        width="100%"
      >
        {label}
      </Typography>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ReferenceItemRhUserLookupInput
          disabled={isSendingInvitation}
          onInputChange={(event: ChangeEvent<HTMLInputElement>): void => {
            const stringValue = event?.target?.value ?? "";
            setInviteeEmail(stringValue);
            onInputChange(stringValue);
          }}
          placeholder="Look up ResearchHub user(s)"
          formID={"user-invite"}
          label={""} // value={inviteeEmail}
        />
        <Box
          sx={{
            alignItems: "center",
            background: "#3971FF",
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: "90px",
            height: "40px",
            borderRadius: "4px",
            marginLeft: "8px",
          }}
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            sendInvitation();
          }}
        >
          {isSendingInvitation ? (
            <ClipLoader color={"#fff"} size={14} />
          ) : (
            <div style={{ color: "#fff", fontSize: 14 }}>{"Invite"}</div>
          )}
        </Box>
      </Box>
      {!isEmpty(inviteList) ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: 2,
          }}
        >
          {inviteeEls}
        </Box>
      ) : null}
    </Box>
  );
}
