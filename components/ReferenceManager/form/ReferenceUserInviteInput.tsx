import { ChangeEvent, ReactElement, SyntheticEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import { ID, NullableString } from "~/config/types/root_types";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { isEmpty, nullthrows } from "~/config/utils/nullchecks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/pro-solid-svg-icons";
import { isValidEmail } from "~/config/utils/validation";

type Invitee = { userID?: ID; userEmail?: string };
type Props = {
  // initialInviteList: Invitee[];
  label: string;
  onInputChange: (string: NullableString) => void;
  projectID: ID;
};

export default function ReferenceUserInviteInput({
  label,
  onInputChange,
  projectID,
}: Props): ReactElement {
  const [inviteeEmail, setInviteeEmail] = useState<NullableString>(null);
  const [inviteList, setInviteList] = useState<Invitee[]>([]);
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
        <FontAwesomeIcon
          icon={faCircleUser}
          style={{ marginRight: 8 }}
        ></FontAwesomeIcon>
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
        <OutlinedInput
          disabled={isSendingInvitation}
          fullWidth
          onChange={(event: ChangeEvent<HTMLInputElement>): void => {
            const stringValue = event?.target?.value ?? "";
            setInviteeEmail(stringValue);
            onInputChange(stringValue);
          }}
          onKeyDown={(event): void => {
            if (event.key === "Enter" || event?.keyCode === 13) {
              sendInvitation();
            }
          }}
          placeholder="Enter collaborator's email"
          size="small"
          value={inviteeEmail}
          sx={{
            background: "#fff",
          }}
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
