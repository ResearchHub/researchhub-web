import { ClipLoader } from "react-spinners";
import { ID } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import { ReactElement, SyntheticEvent, useEffect } from "react";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import { useReferenceProjectUpsertContext } from "./context/ReferenceProjectsUpsertContext";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import ReferenceItemRhUserLookupInput from "../../form/ReferenceItemRhUserLookupInput";
import ReferenceItemRhUserLookupInputTag from "../../form/ReferenceItemRhUserLookupInputTag";
import Typography from "@mui/material/Typography";

type Props = {
  label: string;
  disabled?: boolean;
};

export default function ReferenceCollaboratorsSection({
  label,
  disabled,
}: Props): ReactElement {
  const {
    projectValue: { projectID, collaborators = [] },
    projectValue,
    setProjectValue,
  } = useReferenceProjectUpsertContext();

  const setCollaborators = (newCollaborators: SuggestedUser[]): void => {
    setProjectValue({
      ...projectValue,
      collaborators: newCollaborators,
    });
  };

  const inviteeEls = collaborators.map((targetInvitee: SuggestedUser) => {
    return (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
        key={`RefUserInviteSection-Invitee-${targetInvitee.id}`}
      >
        <span style={{ marginLeft: -12 }}>
          <ReferenceItemRhUserLookupInputTag user={targetInvitee} />
        </span>
        <ClearIcon
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            setCollaborators(
              collaborators.filter(
                (invitee: SuggestedUser): boolean =>
                  targetInvitee.id !== invitee.id
              )
            );
          }}
          sx={{ cursor: "pointer" }}
        />
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
          disabled={disabled}
          label={""}
          onUserSelect={(selectedUser: SuggestedUser): void => {
            setCollaborators([...collaborators, selectedUser]);
          }}
          placeholder="Look up ResearchHub user(s)"
          shouldClearOnSelect
          filterUserIDs={collaborators.map(
            (collaborators: SuggestedUser): ID => collaborators.id
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
          {disabled ? (
            <ClipLoader color={"#fff"} size={14} />
          ) : (
            <div style={{ color: "#fff", fontSize: 14 }}>{"Add"}</div>
          )}
        </Box>
      </Box>
      {!isEmpty(collaborators) ? (
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
