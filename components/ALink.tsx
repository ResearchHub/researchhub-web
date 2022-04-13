import { FunctionComponent,  ReactElement } from "react"
import Link from "next/link";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

const themes = {
    default: "linkThemeDefault",
}

interface Props {
    theme?: string,
    href: any,
    as?: any,
    children?: React.ReactNode,
}

const ALink: FunctionComponent<Props> = ({ href, as, children, theme = themes.default }): ReactElement => {
    return (
        <Link href={href} as={as}>
            <a className={css(styles.ALink, styles[theme])}>
                {children}
            </a>
        </Link>
    )
}

const styles = StyleSheet.create({
    "ALink": {
        color: colors.BLACK(0.8),
        fontSize: 14,
        fontWeight: 500,
        textDecoration: "none",
        ":hover": {
            color: colors.NEW_BLUE()
        }
    },
    "linkThemeDefault": {
    }
})

export default ALink;