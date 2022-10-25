import { css, StyleSheet } from "aphrodite";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { captureEvent } from "~/config/utils/events";
import { useEffect, useState } from "react";
import AuthorAvatar from "../AuthorAvatar";

const fetchReferredUsersAPI = ({ onSuccess }) => {
  return fetch(
    API.REFERRED_USERS(),
    API.GET_CONFIG(),
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res: any): void => onSuccess({ res }))
    .catch((error) => {
      captureEvent({
        error,
        msg: "Failed to fetch referred users"
      });
    });
}

const ReferredUserList = () => {
  const [referredUsers, setReferredUsers] = useState([]);

  useEffect(() => {
    fetchReferredUsersAPI({
      onSuccess: ({ res }) => setReferredUsers(res)
    })
  },[]);

  return (
    <div>
      {referredUsers.map((referredUser:any) => (
        <div key={`user-${referredUser.user.id}`}>
          <div>
            <AuthorAvatar author={referredUser.user.author_profile} />
            {referredUser.user.author_profile.first_name}
            {referredUser.user.author_profile.last_name}
          </div>
          <div>
            {referredUser.benefits_expire_on}
          </div>
          <div>
            {referredUser.rsc_earned}
          </div>
        </div>
      ))}
    </div>
  )
}

const styles = StyleSheet.create({

});

export default ReferredUserList