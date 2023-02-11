import { ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import { Container, Box, TextField, InputLabel, Button } from "@mui/material";
import ContinueWithGoogle from "./ContinueWithGoogle";
import PrimaryButton from "../form/PrimaryButton";
import Image from "next/image";
import Link from "next/link";

interface Props {}

export default function LoginContainer({}: Props): ReactElement {
  return (
    <Container
      maxWidth={"lg"}
      sx={{
        textAlign: "center",
        minHeight: "100vh",
        padding: "32px",
      }}
    >
      <Box sx={{ textAlign: "left" }}>
        <Image
          src={"/logos/citation-manager-logo.png"}
          height={32}
          width={158}
          alt="ResearchHub Citation Manager"
        />
      </Box>
      <Box sx={{ width: "100%", marginTop: "150px" }}>
        <Box
          component={"h1"}
          sx={{ fontWeight: 700, fontSize: 50, lineHeight: "42px" }}
        >
          Log in
        </Box>
        <ContinueWithGoogle />
        <Box sx={{ marginTop: "24px", marginBottom: "24px", color: "#7C7989" }}>
          or
        </Box>
        <Box
          component="form"
          sx={{ maxWidth: 440, width: "100%", margin: "0 auto" }}
        >
          <InputLabel
            shrink
            htmlFor="email-input"
            sx={{
              textAlign: "left",
              fontWeight: 700,
              color: "#000000",
              fontSize: 18,
              lineHeight: "22px",
              letterSpacing: 0.4,
            }}
          >
            Email
          </InputLabel>
          <TextField
            id="email-input"
            placeholder="Enter your email address..."
            sx={{ width: "100%" }}
          ></TextField>
          <Box sx={{ marginTop: "32px" }}>
            <PrimaryButton>Continue with Email</PrimaryButton>
          </Box>
          <Box sx={{ color: "#7C7989", marginTop: "32px" }}>
            By continuing, you agree with our{" "}
            <Link href="/terms">Terms and conditions</Link> and{" "}
            <Link href="/privacy">Privacy policy</Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

const styles = StyleSheet.create({});
