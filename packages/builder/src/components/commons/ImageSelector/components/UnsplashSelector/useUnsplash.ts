/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNil } from "lodash";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { createApi } from "unsplash-js";
import { Random } from "unsplash-js/dist/methods/photos/types";

const browserApi = createApi({
  apiUrl: "http://localhost:3000/api/unsplash-proxy",
});

export const useUnsplash = (newQuery: string | null) => {
  const [images, setImages] = React.useState<Random[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<boolean>(false);
  const page = React.useRef(1);
  const allPages = React.useRef<null | number>(null);

  const getPhotos = useCallback(
    async (query: string | null, page = 1) => {
      setIsLoading(true);
      try {
        let newData: any;

        if (!query) {
          newData = await browserApi.photos.getRandom({
            count: 30,
            orientation: "landscape",
          });
        } else {
          newData = await browserApi.search.getPhotos({
            query,
            orientation: "landscape",
            perPage: 30,
            page,
          });
        }

        if (newData.type === "success") {
          let photos = [];

          if (
            !isNil(newData.response.response) &&
            isNil(newData.response.response.results)
          ) {
            photos = Array.isArray(newData.response.response)
              ? newData.response.response
              : [newData.response.response];
          } else {
            photos = newData.response.response.results;
            allPages.current = newData.response.response.total_pages;
          }

          if (page === 1) {
            setImages(photos);
          } else {
            setImages([...images, ...photos]);
          }
        } else {
          setError(true);
          console.error(newData.errors);
        }
      } catch (e) {
        setError(true);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [images]
  );

  const fetchNextPage = useCallback(() => {
    page.current = page.current + 1;
    if (newQuery?.trim() === "") {
      void getPhotos(null, page.current);
    } else {
      void getPhotos(newQuery, page.current);
    }
  }, [getPhotos, newQuery, page]);

  useEffect(() => {
    if (isNil(newQuery) || isLoading) {
      return;
    }

    allPages.current = null;
    page.current = 1;
    void getPhotos(newQuery.trim() === "" ? null : newQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newQuery]);

  const noMoreImages = allPages.current && page.current >= allPages.current;

  const trackPhotoDownload = useCallback((photo: Random) => {
    void browserApi.photos.trackDownload(
      {
        downloadLocation: photo.links.download_location,
      },
      {
        headers: {
          photo: photo.links.download_location,
        },
      }
    );
  }, []);

  return {
    images,
    isLoading,
    error,
    fetchNextPage,
    noMoreImages,
    trackPhotoDownload,
  };
};
