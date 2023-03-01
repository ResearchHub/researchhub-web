import Bounty from "~/config/types/bounty"
import { CreatedBy } from "~/config/types/root_types"
import AuthorAvatar from "../AuthorAvatar"

type CommentHeaderArgs = {
  createdBy: CreatedBy | null,
  timeAgo: string,
  bounties: Bounty[],
}

const CommentHeader = ({ createdBy, timeAgo, bounties }: CommentHeaderArgs) => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      columnGap: "5px",
    }}>
      <AuthorAvatar author={createdBy?.authorProfile} />
      {`${createdBy?.authorProfile.firstName} ${createdBy?.authorProfile.lastName}`}
      {` commented `}
      <span> • </span>
      {timeAgo}
    </div>
  )
}

export default CommentHeader;