/* eslint-disable @next/next/no-img-element */
import { UnsplashPhoto } from "@kickoffbot.com/types";
import { isNil } from "lodash";
import React from "react";
import { useCard1Styles } from "./Card1.style";
import { Box } from "@mui/material";
import { env } from "~/env.mjs";

interface Props {
  image?: string | UnsplashPhoto;
}

export const Card1Image = ({ image }: Props) => {
  const { classes, cx } = useCard1Styles();
  const [showPhotoInfo, setShowPhotoInfo] = React.useState(false);

  if (isNil(image)) {
    return null;
  }

  return <>
    {typeof image === "string" &&
      <img
        className={classes.img}
        src={image}
        srcSet={image}
        loading="lazy"
        alt=""
      />}
    {typeof image === "object" && image.source === "unsplash" && <Box sx={{ position: 'relative' }} onMouseEnter={() => setShowPhotoInfo(true)}
      onMouseLeave={() => setShowPhotoInfo(false)}>
      <img
        className={classes.img}
        src={image.regularSrc}
        srcSet={image.regularSrc}
        loading="lazy"
        alt=""
      />
      {showPhotoInfo && <Box className={classes.unsplashImageContainer}>
        Photo by <a target='_blank' href={`https://unsplash.com/${image.authorNickname}?utm_source=${env.NEXT_PUBLIC_UNSPLASH_APP_NAME}&utm_medium=referral`}>{image.authorName}</a> on <a target='_blank' href={`https://unsplash.com/?utm_source=${env.NEXT_PUBLIC_UNSPLASH_APP_NAME}&utm_medium=referral`}>Unsplash</a>
      </Box>}
    </Box>}
  </>
};
