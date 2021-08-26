import Router from "next/router";
import killswitch from "../../config/killswitch/killswitch";
import { ELNEditor } from "../../components/CKEditor/ELNEditor";
import { ReactElement } from "react";

const isServer = () => typeof window === "undefined";

export default function Index(): ReactElement<"div"> {
  if (!killswitch("ELN") && !isServer()) {
    Router.push("/");
  }
  return <ELNEditor />;
}
