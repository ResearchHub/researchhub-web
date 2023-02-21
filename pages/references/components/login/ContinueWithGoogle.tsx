import { ReactElement } from "react";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import GoogleLogin from "./GoogleLogin";
import { useAuthContext } from "../../contexts/AuthContext";
import { useRouter } from "next/router";

interface Props {
  disabled?: boolean;
}

function GoogleButton({ onClick, disabled }) {
  return (
    <Button
      onClick={onClick}
      sx={{
        background: "#fff",
        maxWidth: 440,
        width: "100%",
        height: 50,
        border: "1px solid #241F3A",
      }}
    >
      <Image alt="Google" width={35} height={35} src={"/brands/google.png"} />{" "}
      <Box
        component="span"
        sx={{
          marginLeft: "16px",
          color: "#241F3A",
          textTransform: "none",
          fontSize: 18,
          lineHeight: "22px",
        }}
      >
        Continue with Google
      </Box>
    </Button>
  );
}

export default function ContinueWithGoogle({ disabled }: Props): ReactElement {
  const { loginWithGoogle } = useAuthContext();

  const responseGoogle = async (response) => {
    const resp = await loginWithGoogle(response);
  };

  return (
    <GoogleLogin
      login={responseGoogle}
      onCredentialResponse={() => null}
      render={(renderProps) => {
        return (
          <GoogleButton disabled={disabled} onClick={renderProps.onClick} />
        );
      }}
    />
  );
}
