import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Roboto } from "@next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Layouts
import BasicPageLayout from "../components/shared/basic_page_layout/BasicPageLayout";
import { useRouter } from "next/router";
import { AuthProvider, useAuthContext } from "../contexts/AuthContext";

// If loading a variable font, you don't need to specify the font weight
const font = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

const theme = createTheme({
  typography: {
    fontFamily: font.style.fontFamily,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": {
          fontFamily: font.style.fontFamily,
        },
        button: {
          background: "#fff",
          maxWidth: 440,
          width: "100%",
          height: 50,
          border: "1px solid #241F3A",

          "&:hover": {
            background: "#fff",
          },
        },
        input: {
          background: "#FBFBFD !important",
          border: "1px solid #E5E5F0 !important",

          "&:hover": {
            border: "1px solid #E5E5F0 !important",
          },
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const getLayout =
    Component.getLayout ??
    ((page) => <BasicPageLayout>{page}</BasicPageLayout>);

  return (
    <Fragment>
      <Head>
        <title>ResearchHub Reference Manager</title>
        <meta name="description" content="ResearchHub Reference Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
        {/* <script
          src="https://kit.fontawesome.com/f57f706c59.js"
          crossOrigin="anonymous"
        ></script> */}
        <link
          rel="stylesheet"
          href="https://kit.fontawesome.com/f57f706c59.css"
          crossOrigin="anonymous"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/favicons/apple-touch-icon.png"
          preload="true"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
          preload="true"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
          preload="true"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" async />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        {/* Google one tap */}
      </Head>
      <main className={font.className} id="app-basic-page-layout-main">
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </AuthProvider>
      </main>
    </Fragment>
  );
}
