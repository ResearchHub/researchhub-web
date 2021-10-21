import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import CheckBox from "~/components/Form/CheckBox";
import { AuthStore, User } from "~/config/types/root_types";
import TagsInput from "react-tagsinput";
import colors from "~/config/themes/colors";
import AuthorCardList from "../../SearchSuggestion/AuthorCardList";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { debounce } from "~/config/utils/debounce";

export type Author = {
  id: User["id"];
  email: User["email"];
  first_name: User["first_name"];
  last_name: User["last_name"];
  profile_image: User["author_profile"]["profile_image"];
};

type AuthorsPickerProps = {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  value: Author[];
  onChange: (id: string, value: Author[]) => void;
  disabled?: boolean;
  renderEmail?: boolean;
};

export const AuthorsPicker: FC<AuthorsPickerProps> = ({
  id,
  value,
  onChange,
  label = "Authors",
  placeholder = "Search for author",
  required,
  disabled,
  renderEmail,
}) => {
  const auth = useSelector<{ auth: AuthStore }, AuthStore>((state) => {
    return state.auth;
  });

  const inputRef = useRef<any>();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Author[]>([]);

  const isCurrentUserAuthor =
    value.filter((author) => author.id === auth.user.id).length === 1;

  const handleFocus = (e: FocusEvent) => {
    e && e.stopPropagation();
    inputRef.current?.focus();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleAddAuthor = (author: Author) => {
    onChange(id, [...value, author]);
  };

  const handleRemoveAuthor = (authorId: Author["id"]) => {
    onChange(
      id,
      value.filter((author) => author.id !== authorId)
    );
  };

  const handleSelfAuthorChange = (id: string, active: boolean) => {
    if (isCurrentUserAuthor) {
      handleRemoveAuthor(auth.user.id);
    } else {
      handleAddAuthor({
        id: auth.user.id,
        email: auth.user.email,
        first_name: auth.user.first_name,
        last_name: auth.user.last_name,
        profile_image: auth.user.author_profile.profile_image,
      });
    }
  };

  useEffect(() => {
    const searchAuthors = async () => {
      fetch(
        API.AUTHOR({
          search: query,
          excludeIds: value.map((author) => author.id),
        }),
        API.GET_CONFIG()
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          if (inputRef.current?.input?.value !== query) {
            return;
          }
          setSuggestions((resp as unknown as { results: Author[] }).results);
          setShowSuggestions(true);
          setIsLoading(false);
        });
    };
    const debouncedSearch = debounce(searchAuthors, 500);

    if (query) {
      setIsLoading(true);
      debouncedSearch();
    }
    setShowSuggestions(false);
  }, [query]);

  // TODO add authors modal
  return (
    <div>
      <div className={css(styles.container)}>
        <div className={css(styles.inputLabel, styles.text)}>
          {label && label}
          {required && <div className={css(styles.asterick)}>*</div>}
        </div>
        <TagsInput
          onlyUnique={true}
          style={styles.input}
          value={value}
          // onChange={onChange}
          inputValue={query}
          onChangeInput={(value) => setQuery(value)}
          // className={error ? css(styles.error) : "react-tagsinput"}
          onClick={handleFocus}
          ref={inputRef}
          renderTag={({ tag }: { tag: Author }) =>
            (() => {
              return renderEmail;
            })() ? (
              <span key={tag.id}>
                {tag.email}
                {!disabled && <a onClick={() => handleRemoveAuthor(tag.id)} />}
              </span>
            ) : (
              <span key={tag.id}>
                {`${tag.first_name} ${tag.last_name}`}
                {!disabled && <a onClick={() => handleRemoveAuthor(tag.id)} />}
              </span>
            )
          }
          inputProps={{
            placeholder: placeholder ? placeholder : "Search for author",
            onKeyPress: handleInputChange,
          }}
        />
      </div>
      <span className={css(styles.container)}>
        <AuthorCardList
          show={showSuggestions}
          authors={suggestions}
          loading={isLoading}
          addAuthor={() => {
            /* TODO */
          }}
          onAuthorClick={handleAddAuthor}
        />
      </span>

      <CheckBox
        id="self_author"
        label="I am an author of this paper"
        active={isCurrentUserAuthor}
        onChange={handleSelfAuthorChange}
        isSquare={true}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    miHeight: 79,
    marginTop: 20,
    width: "100%",
  },
  inputLabel: {
    height: 19,
    fontWeight: 500,
    width: "100%",
    color: "#232038",
    display: "flex",
    justifyContent: "flex-start",
    textAlign: "left",
    marginBottom: 10,
  },
  input: {
    minHeight: 50,
  },
  text: {
    fontFamily: "Roboto",
  },
  asterick: {
    color: colors.BLUE(1),
  },
  error: {
    backgroundColor: colors.ICY_GREY,
    border: "1px solid rgb(232, 232, 242)",
    overflow: "hidden",
    paddingLeft: 15,
    paddingTop: 0,
    width: "calc(100% - 15px)",
    height: 49,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: colors.RED(1),
  },
  searchIcon: {
    height: 18,
    width: 18,
    position: "absolute",
    left: 15,
    bottom: 10,
  },
});
