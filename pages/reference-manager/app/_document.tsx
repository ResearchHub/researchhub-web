import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// TODO: calvinhlee - figure out aphrodite setup for SSR
// export default class CitationManagerDocument extends Document {
//   static async getInitialProps({ renderPage }) {
//     const { html, css } = StyleSheetServer.renderStatic(() => renderPage());
//     const ids = css.renderedClassNames;
//     return { ...html, css, ids };
//   }

//   constructor(props) {
//     super(props);
//     const { __NEXT_DATA__, ids } = props;
//   }

//   render() {
//     return (
//       <Html lang="en">
//         <Head>
//           <style
//             data-aphrodite
//             dangerouslySetInnerHTML={{ __html: this.props?.css?.content }}
//           />
//         </Head>
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }
