import { WebLogicRemoveMessagesUIElement } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import { isNil } from 'lodash';
import React, { useCallback } from 'react';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { getBlockFromMessageElementId } from '../../EditMessage';

interface Props {
  element: WebLogicRemoveMessagesUIElement;
}

export const WebLogicRemoveMessages = ({ element }: Props) => {

  const { blocks } = useFlowDesignerStore((state) => ({
    blocks: state.project.blocks
  }));

  const getEditTitle = useCallback((messageElementId: string) => {
    const block = getBlockFromMessageElementId(messageElementId, blocks);
    if (isNil(block)) {
      return 'Error...';
    }

    return 'Remove ' + (block.elements.findIndex(e => e.id === messageElementId) + 1) + ' message from "' + block.title + '"';
  }, [blocks]);

  return (
    <>
      {(isNil(element.messageIds) || element.messageIds.length === 0) && !element.removeAllMessages && <div>Configure message removing...</div>}
      {element.removeAllMessages && <div>Delete all sent messages</div>}
      {!isNil(element.messageIds) && !element.removeAllMessages && element.messageIds.length > 0 &&
        element.messageIds.map((messageId) => <>
          <Box sx={{ fontWeight: 'bold' }}>{getEditTitle(messageId)}</Box>
        </>
        )}
    </>
  )
}
