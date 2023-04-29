import React, { useEffect, useState, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { StyleSheet, css } from 'aphrodite';
import AuthorAvatar from '../AuthorAvatar';
import { SuggestedUser } from './lib/types';
import colors from '~/config/themes/colors';
import { fetchUserSuggestions } from './lib/api';

type Args = {
  onSelect: Function;
  onChange: Function;
}

const MIN_LENGTH_TO_FETCH_RESULTS = 2;

const SuggestUsers = ({ onSelect, onChange }: Args) => {
  const [isActive, setIsActive] = useState(true);
  const inputRef = useRef<HTMLDivElement| null>(null);
  const [userSuggestions, setUserSuggestions] = useState<SuggestedUser[]>([]);
  const [focusedChoice, setFocusedChoice] = useState<SuggestedUser | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = useCallback(async () => {
    if (!inputRef.current) return;
    
    const textContent = inputRef.current?.textContent || ""

    console.log('inputRef', inputRef)

    if (textContent.length >= MIN_LENGTH_TO_FETCH_RESULTS) {
      const suggestions = await fetchUserSuggestions(textContent);
      setUserSuggestions(suggestions);
      setFocusedChoice(suggestions[0]);
    }
    else {
      setUserSuggestions([]);
      setFocusedChoice(null);
    }
    
    onChange(inputRef.current.textContent);
  }, [userSuggestions, inputRef?.current?.textContent]);

  const debouncedHandleInputChange = useCallback(
    debounce(handleInputChange, 250),
    [handleInputChange]
  );

  const handleUserRowClick = (user) => {
    setIsActive(false);
    onSelect(user);
  };

  const handleKeyDown = (e) => {
    const downKey = e.keyCode === 40;
    const upKey = e.keyCode === 38;
    const enterKey = e.keyCode === 13;

    if (downKey) {
      e.preventDefault();
      const currentIdx = userSuggestions.findIndex(u => u.id === focusedChoice?.id);
      const nextIdx = currentIdx + 1 > userSuggestions.length - 1 ? 0 : currentIdx + 1;
      setFocusedChoice(userSuggestions[nextIdx]);
    }
    else if (upKey) {
      e.preventDefault();
      const currentIdx = userSuggestions.findIndex(u => u.id === focusedChoice?.id);
      const nextIdx = currentIdx - 1 < 0 ? userSuggestions.length - 1 : currentIdx - 1;
      setFocusedChoice(userSuggestions[nextIdx]);
    }
    else if (enterKey) {
      e.preventDefault();
      onSelect(focusedChoice);
    }
  }

  return (
    <div className={css(styles.container)}>
      {isActive ? (
        <>
          <div
            onKeyDown={handleKeyDown}
            ref={inputRef}
            contentEditable
            onInput={debouncedHandleInputChange}
            className={css(styles.input)}
          />
          {userSuggestions.length === 0 &&
            <div className={css(styles.userDropdown, styles.userDropdownEmpty)}>Search for user to mention...</div>
          }
          {userSuggestions.length > 0 &&
            <div className={css(styles.userDropdown)}>
              <div>
                {userSuggestions.map((user, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setFocusedChoice(user)}
                    className={css(styles.userRow, focusedChoice?.id === user.id && styles.userRowFocused)}
                    onClick={() => handleUserRowClick(user)}
                  >
                    <div className={css(styles.userRowContent)}>
                      <AuthorAvatar author={user.authorProfile} size={25} trueSize />
                      <div className={css(styles.userRowDetatils)}>
                        <span className={css(styles.fullName)}>{user.firstName} {user.lastName}</span>
                        <span className={css(styles.dot)}>•</span>
                        <span className={css(styles.rep)}>{user.reputation} Rep</span>
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
          }
        </>
      ) : null}
    </div>
  );
};


const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: "inline-block",
  },
  input: {
    minWidth: 20,
    padding: "0",
    borderRadius: "4px",
    marginLeft: 2,
    border: `none`,
    outline: "none",
  },
  userDropdown: {
    position: 'absolute',
    width: "auto",
    left: -15,
    zIndex: 1,
    boxShadow: "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
    ':nth-child(1n) > div': {
      backgroundColor: 'white',
    },
  },
  userDropdownEmpty: {
    padding: '6px 10px',
    backgroundColor: 'white',
    whiteSpace: "pre",
  },
  userRow: {
    padding: '6px 10px',
    fontSize: 14,
    cursor: 'pointer',
  },
  fullName: {
    fontWeight: 500,
  },
  dot: {
    color: colors.MEDIUM_GREY2(),
  },
  rep: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 13
  },
  userRowContent: {
    display: "flex",
    columnGap: "8px",
    alignItems: 'center',
  },
  userRowDetatils: {
    display: "flex",
    columnGap: "8px",
    alignItems: 'center',
    whiteSpace: "pre",
  },
  userRowFocused: {
    background: colors.NEW_BLUE(0.1),
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: 8,
  },
});

export default SuggestUsers;