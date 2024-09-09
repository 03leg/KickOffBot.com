import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  EditorState,
  RichUtils,
  Modifier
} from "draft-js";
import { useCallback } from "react";
import { Link } from "./Link";
import { isNil } from "lodash";

const insertLink = (editorState: EditorState, linkText: string, linkUrl: string): EditorState => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();

  const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { linkUrl });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const contentStateWithText = Modifier.insertText(
    contentStateWithEntity,
    selectionState,
    linkText,
    undefined,
    entityKey
  );

  const newEditorState = EditorState.push(editorState, contentStateWithText, 'insert-characters');
  return EditorState.forceSelection(newEditorState, selectionState.merge({
    anchorOffset: selectionState.getAnchorOffset() + linkText.length,
    focusOffset: selectionState.getAnchorOffset() + linkText.length
  }));
 
};

const findLinkEntities = (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      !isNil(entityKey) &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

export const draftJsEditorDecorator = new CompositeDecorator([
  { strategy: findLinkEntities, component: Link }
]);

export const useNewLink = (
  editorState: EditorState,
  onEditorStateChange: (newState: EditorState) => void
) => {

  const handleAddLink = useCallback(
    (linkUrl: string, linkText?: string) => {

      if (editorState.getSelection().isCollapsed()) {
        linkText = linkText ?? "Link";
        onEditorStateChange(insertLink(editorState, linkText, linkUrl));
      }
      else {
        const contentWithNewLink = editorState
          .getCurrentContent()
          .createEntity("LINK", "MUTABLE", { linkUrl });

        const entityKey = contentWithNewLink.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentWithNewLink
        });

        onEditorStateChange(RichUtils.toggleLink(
          newEditorState,
          newEditorState.getSelection(),
          entityKey
        ));
      }
    },
    [editorState, onEditorStateChange]
  );

  return { handleAddLink };
};
