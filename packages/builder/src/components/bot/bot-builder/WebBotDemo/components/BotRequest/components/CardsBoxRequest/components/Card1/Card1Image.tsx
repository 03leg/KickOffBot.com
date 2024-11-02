import { UnsplashPhoto } from "@kickoffbot.com/types";
import { isNil } from "lodash";
import React from "react";
import { useCard1Styles } from "./Card1.style";
import { Box } from "@mui/material";
import { UnsplashAuthorBox } from "../../../../../BotMessage/components/MediaMessage/components/UnsplashAuthorBox";

interface Props {
  image?: string | UnsplashPhoto;
  onImageLoaded: () => void; 
}

export const Card1Image = ({ image, onImageLoaded }: Props) => {
  const { classes } = useCard1Styles();
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
        onLoad={() => onImageLoaded()}
      />}
    {typeof image === "object" && image.source === "unsplash" && <Box sx={{ position: 'relative' }} onMouseEnter={() => setShowPhotoInfo(true)}
      onMouseLeave={() => setShowPhotoInfo(false)}>
      <img
        className={classes.img}
        src={image.regularSrc}
        srcSet={image.regularSrc}
        loading="lazy"
        alt=""
        onLoad={() => onImageLoaded()}
      />
      {showPhotoInfo && <UnsplashAuthorBox image={image} />}
    </Box>}
  </>
};
