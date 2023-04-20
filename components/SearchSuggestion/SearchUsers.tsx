import React, { useEffect, useState, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { StyleSheet, css } from 'aphrodite';

const users = [
  {
    id: 15,
    firstName: 'John',
    lastName: 'Doe',
    profileImg: 'https://example.com/john-doe.jpg',
  },
  {
    id: 17,
    firstName: 'Jane',
    lastName: 'Smith',
    profileImg: 'https://example.com/jane-smith.jpg',
  },
  // Add more users here
];

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

const SearchUsers = ({ onSelect }) => {
  const [isActive, setIsActive] = useState(true);
  const inputRef = useRef(null);

  const handleInputChange = useCallback(() => {
    console.log('Input value:', inputRef.current.value);
    // Your custom logic here
  }, []);

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
            {users.map((user, index) => (
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