import { Helpers } from "@quantfive/js-web-config";
import { MessageActions } from "~/redux/message";
import { ReactElement, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { useDispatch, useStore } from "react-redux";
import { useEffectCheckModCredentials } from "~/components/Moderator/useEffectCheckModCredentials";
import api from "~/config/api";
import AsyncSelect from "react-select/async";
import Button from "~/components/Form/Button";
import ContentPage from "~/components/ContentPage/ContentPage";
import FormInput from "~/components/Form/FormInput";
import get from "lodash/get";
import ModeratorDashboardSidebar from "~/components/shared/ModeratorDashboardSidebar";
import SideColumn from "~/components/Home/SideColumn";
import UserCard from "~/components/UserCard";

export default function RSCDashboard(): ReactElement<
  typeof RSCDashboard
> | null {
  const dispatch = useDispatch();
  const [chosenOption, setChosenOption] = useState(null);
  const [inputAmount, setInputAmount] = useState(null);
  const shouldRenderUI = useEffectCheckModCredentials();
  if (!shouldRenderUI) {
    return null;
  }

  const inputStyles = {
    valueContainer: (styles) => ({
      ...styles,
      height: 60,
    }),
  };

  const loadOptions = (inputValue: string, callback: (options) => void) => {
    const filters = {
      search_multi_match: inputValue,
    };

    const config = {
      route: "person",
    };

    setChosenOption(null);

    return fetch(api.SEARCH({ filters, config }), api.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        const options = [];
        const results = res.results.filter((user) => user.user);
        for (let i = 0; i < results.length; i++) {
          const user = results[i];
          options.push({
            label: (
              <div className={css(styles.userRow)}>
                <img
                  src={user.author_profile.profile_image}
                  className={css(styles.img)}
                />
                {user.first_name} {user.last_name}
                {user.headline?.title ? `: ${user.headline.title}` : ""}
              </div>
            ),
            value: user.user,
            userObject: user,
          });
        }

        callback(options);
      });
  };

  const getPersonReputation = (person) => {
    return get(person, "author_profile.reputation", 0);
  };

  const sendRSC = (e) => {
    e.preventDefault();
    const config = {
      amount: inputAmount,
      recipient_id: chosenOption?.userObject?.user?.id,
    };
    dispatch(MessageActions.showMessage({ load: true, show: true }));

    return fetch(api.SEND_RSC(), api.POST_CONFIG(config))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setChosenOption(null);
        setInputAmount(null);
        // document.getElementById('input-amount').
        document.getElementById("rsc-amount").value = null;
        dispatch(MessageActions.showMessage({ show: false }));
        dispatch(MessageActions.setMessage("RSC Sent!"));
        dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch((err) => {
        dispatch(MessageActions.showMessage({ show: false }));
        dispatch(MessageActions.setMessage("Something went wrong"));
        dispatch(MessageActions.showMessage({ show: true, error: true }));
      });
  };

  return (
    <ContentPage
      mainFeed={
        <div className={css(styles.content)}>
          <form className={css(styles.form)} onSubmit={sendRSC}>
            <h2>RSC Amount</h2>
            <div className={css(styles.selector)}>
              <FormInput
                value={inputAmount}
                type="number"
                required
                id={"rsc-amount"}
                onChange={(id, value) => {
                  setInputAmount(value);
                }}
              />
            </div>
            <h2>RSC Recipient</h2>
            <div className={css(styles.selector)}>
              <AsyncSelect
                styles={inputStyles}
                loadOptions={loadOptions}
                placeholder={"Search for a user"}
                value={chosenOption}
                onChange={(option) => setChosenOption(option)}
              />
            </div>

            {chosenOption && (
              <div className={css(styles.user)}>
                <UserCard
                  className={css(styles.person)}
                  authorProfile={chosenOption.userObject.author_profile}
                  reputation={getPersonReputation(chosenOption.userObject)}
                />
              </div>
            )}

            <Button
              label={"Send RSC"}
              rippleClass={styles.ripples}
              type={"submit"}
              customButtonStyle={[styles.button]}
            />
          </form>
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

const styles = StyleSheet.create({
  content: {
    paddingLeft: 60,
  },
  form: {
    maxWidth: 500,
  },
  person: {
    width: "100%",
    marginBottom: 10,
  },
  userRow: {
    display: "flex",
    alignItems: "center",
  },
  img: {
    marginRight: 16,
    borderRadius: "50%",
    height: 40,
  },
  user: {
    marginTop: 32,
  },
  ripples: {
    marginTop: 32,
    width: "100%",
  },
  button: {
    width: "100%",
  },
});
