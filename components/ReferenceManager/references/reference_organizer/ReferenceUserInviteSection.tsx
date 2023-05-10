import { ReactElement, SyntheticEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import { ID, NullableString } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import Box from "@mui/material/Box";
import ReferenceItemRhUserLookupInput from "../../form/ReferenceItemRhUserLookupInput";
import Typography from "@mui/material/Typography";
import ReferenceItemRhUserLookupInputTag from "../../form/ReferenceItemRhUserLookupInputTag";

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
  const [invitees, setInvitees] = useState<SuggestedUser[]>([]);
  const [isSendingInvitation, setisSendingInvitation] =
    useState<boolean>(false);

  const inviteeEls = invitees.map((invitee: SuggestedUser) => {
    return <ReferenceItemRhUserLookupInputTag user={invitee} />;
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
          label={""}
          onUserSelect={(selectedUser: SuggestedUser): void => {
            setInvitees([...invitees, selectedUser]);
          }}
          placeholder="Look up ResearchHub user(s)"
          shouldClearOnSelect
          filterUserIDs={invitees.map(
            (invitees: SuggestedUser): ID => invitees.id
          )}
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
            // sendInvitation();
          }}
        >
          {isSendingInvitation ? (
            <ClipLoader color={"#fff"} size={14} />
          ) : (
            <div style={{ color: "#fff", fontSize: 14 }}>{"Invite"}</div>
          )}
        </Box>
      </Box>
      {!isEmpty(invitees) ? (
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
