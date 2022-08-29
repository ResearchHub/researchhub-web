import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import CarouselItem from "./CarouselItem";

type Props = {
  carouselItems: ReactElement<typeof CarouselItem>[];
};

export default function Carousel({ carouselItems }: Props): ReactElement {
  return <div></div>;
}

const styles = StyleSheet.create({
  carousel: {},
});
