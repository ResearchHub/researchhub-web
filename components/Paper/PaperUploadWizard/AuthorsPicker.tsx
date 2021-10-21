import { FC } from "react";
import { useSelector } from "react-redux";
import CheckBox from "~/components/Form/CheckBox";
import { AuthStore, User } from "~/config/types/root_types";

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
};

export const AuthorsPicker: FC<AuthorsPickerProps> = ({
  id,
  value,
  onChange,
  label = "Authors",
  placeholder = "Search for author",
  required,
}) => {
  const auth = useSelector<{ auth: AuthStore }, AuthStore>((state) => {
    return state.auth;
  });

  const isCurrentUserAuthor =
    value.filter((author) => author.id === auth.user.id).length === 1;

  const handleSelfAuthorChange = (id: string, active: boolean) => {
    if (isCurrentUserAuthor) {
      onChange(
        id,
        value.filter((author) => author.id !== auth.user.id)
      );
    } else {
      onChange(id, [
        ...value,
        {
          id: auth.user.id,
          email: auth.user.email,
          first_name: auth.user.first_name,
          last_name: auth.user.last_name,
          profile_image: auth.user.author_profile.profile_image,
        },
      ]);
    }
  };

  // TODO filtering
  // TODO add authors modal
  return (
    <div>
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
