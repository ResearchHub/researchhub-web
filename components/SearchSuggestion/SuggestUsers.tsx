import React, { useEffect, useState, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { StyleSheet, css } from 'aphrodite';
import API from '~/config/api';
import AuthorAvatar from '../AuthorAvatar';
import { SuggestedUser } from './lib/types';
import colors, { formColors } from '~/config/themes/colors';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: "inline-block",
  },
  input: {
    width: '100%',
    padding: "8px",
    borderRadius: "4px",
    marginLeft: 2,
    border: `1px solid ${formColors.BORDER}`,
    outline: "none",
    ":focus": {
      border: `1px solid ${colors.NEW_BLUE()}`,
    },
  },
  userDropdown: {
    position: 'absolute',
    width: '100%',
    left: 0,
    zIndex: 1,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    ':nth-child(1n) > div': {
      backgroundColor: 'white',
    },
    
  },
  userRow: {
    display: 'flex',
    columnGap: "8px",
    alignItems: 'center',
    padding: '8px 12px',
    fontSize: 14,
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    ":hover": {
      transition: "0.3s",
      color: colors.BLACK(0.7),
    },
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: 8,
  },
});


const parseUserSuggestion = (raw: any): SuggestedUser => {
  return {
    firstName: raw.first_name,
    lastName: raw.last_name,
    id: raw.id,
    authorProfile: {
      id: raw.author_profile.id,
      profileImage: raw.author_profile.profile_img,
    }
  }
}

const fetchUserSuggestions = (query:string): Promise<SuggestedUser[]> => {

  const url = `${API.BASE_URL}search/user/suggest/?full_name_suggest__completion=${query}`;

  let suggestedUsers:SuggestedUser[] = [];
  return fetch(url, API.GET_CONFIG())
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        // TODO: Unexpected error. log to sentry
        throw new Error('HTTP-Error: ' + response.status);
      }
    })
    .then((data) => {
      const suggestions = data.full_name_suggest__completion;
      suggestions.forEach(suggestion => {
        console.log(suggestion.text);
        suggestion.options.forEach(option => {
          const hasAuthorProfile = option._source.author_profile;
          if (hasAuthorProfile) {
            suggestedUsers.push(parseUserSuggestion(option._source))
          }
        });
      });

      return suggestedUsers;
    })
    .catch(error => {
      console.error('Request Failed:', error);
      return [];
    });
}






const SuggestUsers = ({ onSelect }) => {
  const [isActive, setIsActive] = useState(true);
  const inputRef = useRef(null);
  const [userSuggestions, setUserSuggestions] = useState<SuggestedUser[]>([]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = useCallback(async () => {
    console.log('Input value:', inputRef.current.value);

    const suggestions = await fetchUserSuggestions(inputRef.current.value);
    setUserSuggestions(suggestions);
    // Your custom logic here
  }, [userSuggestions, inputRef?.current?.value]);

  const debouncedHandleInputChange = useCallback(
    debounce(handleInputChange, 250),
    [handleInputChange]
  );

  const handleUserRowClick = (user) => {
    setIsActive(false);
    onSelect(user);
  };

  useEffect(() => {

    const handleClick = (e) => {
      if (e.target === document.body) {
        setIsActive(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className={css(styles.container)}>
      {isActive ? (
        <>
          <input
            ref={inputRef}
            type="text"
            placeholder="Mention a user"
            onChange={debouncedHandleInputChange}
            className={css(styles.input)}
          />
          <div className={css(styles.userDropdown)}>
            <div>
            {userSuggestions.map((user, index) => (
              <div
                key={index}
                className={css(styles.userRow)}
                onClick={() => handleUserRowClick(user)}
              >
                <AuthorAvatar author={user.authorProfile} size={25} trueSize />
                {user.firstName} {user.lastName}
              </div>
            ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SuggestUsers;