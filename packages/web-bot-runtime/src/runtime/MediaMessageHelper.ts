import {
  MediaMessageDescription,
  WebContentMediaUIElement,
  WebImageMediaDescription,
  WebMediaDescription,
  WebMediaType,
  WebVideoMediaDescription,
} from '@kickoffbot.com/types';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { WebUserContext } from './WebUserContext';

export class MediaMessageHelper {
  private static getMedias(
    medias: WebMediaDescription[],
    utils: WebBotRuntimeUtils,
    userContext: WebUserContext,
  ) {
    const result = [];

    for (const media of medias) {
      if (media.type === WebMediaType.IMAGE) {
        const mediaImg = media as WebImageMediaDescription;

        if (mediaImg.isLink) {
          mediaImg.imageLink = utils.getParsedText(
            mediaImg.imageLink,
            userContext,
          );
        }

        if (typeof mediaImg.image === 'string') {
          mediaImg.image = utils.getParsedText(mediaImg.image, userContext);
        }
      } else if (media.type === WebMediaType.VIDEO) {
        const mediaVideo = media as WebVideoMediaDescription;

        if (mediaVideo.video.url) {
          mediaVideo.video.url = utils.getParsedText(
            mediaVideo.video.url,
            userContext,
          );
        }
      } else {
        throw new Error('Unsupported media type');
      }

      result.push(media);
    }

    return result;
  }

  static getMediaMessageContent(
    element: WebContentMediaUIElement,
    utils: WebBotRuntimeUtils,
    userContext: WebUserContext,
  ): MediaMessageDescription {
    return {
      medias: this.getMedias(element.medias, utils, userContext),
      viewMode: element.viewMode,
    };
  }
}
