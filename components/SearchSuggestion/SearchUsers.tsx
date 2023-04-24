import React, { useEffect, useState, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { StyleSheet, css } from 'aphrodite';
import API, { generateApiUrl } from '~/config/api';
import { ID } from '~/config/types/root_types';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    width: '100%',
  },
  userDropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: 8,
  },
});


type SuggestedUser = {
  firstName: string;
  lastName: string;
  id: ID;
  profileImg: string;
}

const parseUserSuggestion = (raw: any): SuggestedUser => {
  return {
    firstName: raw.first_name,
    lastName: raw.last_name,
    id: raw.id,
    profileImg: raw.profile_img,
  }
}

const fetchUserSuggestions = (query): Promise<SuggestedUser[]> => {

  const url = generateApiUrl(
    `${API.BASE_URL}/search/user/suggest/?full_name_suggest__completion=${query}`
  );



  let suggestedUsers:SuggestedUser[] = []
  return fetch(url, API.GET_CONFIG({}))
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        // TODO: Unexpected error. log to sentry
        throw new Error('HTTP-Error: ' + response.status);
      }
    })
    .then(data => {
      // Extract the suggestions from the response JSON
      const suggestions = data.full_name_suggest__completion;
  
      // Process the suggestions as needed, e.g., display them in the UI
      suggestions.forEach(suggestion => {
        console.log(suggestion.text);
        suggestion.options.forEach(option => {
          suggestedUsers.push(parseUserSuggestion(option._source))
        });
      });

      return suggestedUsers;
    })
    .catch(error => {
      console.error('Request Failed:', error);
      return [];
    });
}






const SearchUsers = ({ onSelect }) => {
  const [isActive, setIsActive] = useState(true);
  const inputRef = useRef(null);
  const [userSuggestions, setUserSuggestions] = useState<SuggestedUser[]>([]);

  const handleInputChange = useCallback(async () => {
    console.log('Input value:', inputRef.current.value);

    const _userSuggestions = await fetchUserSuggestions(inputRef.current.value);
    setUserSuggestions(_userSuggestions);
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
      My React Component
      {isActive ? (
        <>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type here..."
            onChange={debouncedHandleInputChange}
            className={css(styles.input)}
          />
          <div className={css(styles.userDropdown)}>
            {userSuggestions.map((user, index) => (
              <div
                key={index}
                className={css(styles.userRow)}
                onClick={() => handleUserRowClick(user)}
              >
                <img
                  src={user.profileImg}
                  alt={`\${user.firstName} \${user.lastName}`}
                  className={css(styles.profileImg)}
                />
                {user.firstName} {user.lastName}
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SearchUsers;