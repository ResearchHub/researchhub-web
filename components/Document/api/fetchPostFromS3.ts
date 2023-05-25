import { captureEvent } from "~/config/utils/events";

interface Props {
  s3Url: string;
}

const fetchPostFromS3 = async ({ s3Url }: Props): Promise<any> => {
  try {
    const response = await fetch(s3Url);
    if (!response.ok) {
      captureEvent({
        data: { s3Url, status: response.status },
        msg: `Error fetching post from S3`,
      });
    }
    const html = await response.text();
    // CK Editor saves H1 tags on S3.
    // We want to remove this because we are already outputting an H1 tag in DocumentHeader
    const htmlWithoutH1 = html.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "");
    // Because we remove the <h1/> we will face a bunch of empty space at the top of the post. Let's remove that too
    const htmlWithoutIntroWhitespace = htmlWithoutH1.replace(
      /<p>((<br\/?>)*|\s*|(&nbsp;)*)*(.*?<\/p>)/,
      "<p>$4"
    );

    return htmlWithoutIntroWhitespace;
  } catch (error) {
    captureEvent({
      data: { s3Url, error },
      msg: `Error fetching post from S3`,
    });
  }
};

export default fetchPostFromS3;
