import {
  MediaMessageDescription,
  WebContentMediaUIElement,
} from '@kickoffbot.com/types';

export class MediaMessageHelper {
  static getMediaMessageContent(
    element: WebContentMediaUIElement,
  ): MediaMessageDescription {
    return {
      medias: element.medias,
      viewMode: element.viewMode,
    };
  }
}
