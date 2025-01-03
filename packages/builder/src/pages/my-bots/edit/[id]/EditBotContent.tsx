import * as React from 'react';
import { Box, Button, LinearProgress } from '@mui/material';
import { DndContext, MeasuringStrategy, type DragEndEvent, pointerWithin, type DragOverEvent, type DragStartEvent, type UniqueIdentifier, useDroppable, useSensor, useSensors, PointerSensor, KeyboardSensor, type Active, type DataRef } from '@dnd-kit/core';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { findIndex, isNil, remove } from 'lodash';
import { FlowDesigner } from '~/components/bot/bot-builder/FlowDesigner';
import { flowDesignerTransformModifier } from '~/components/bot/bot-builder/FlowDesigner/flowDesignerTransformModifier';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { getNewBlock, getNewUIElementTemplate, getPositionForNewBlock } from '~/components/bot/bot-builder/utils';
import { type DraggableElementData } from '~/components/bot/bot-builder/ToolBox/types';
import { useFlowDesignerStore } from '~/components/bot/bot-builder/store';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import { showError, showSuccessMessage } from '~/utils/ClientStatusMessage';
import { ConfirmProvider } from 'material-ui-confirm';
import AbcIcon from '@mui/icons-material/Abc';
import { BotPlatform, ElementType, FlowDesignerUIBlockDescription, TransformDescription, UIElement } from '@kickoffbot.com/types';
import RouterIcon from '@mui/icons-material/Router';
import { RuntimeEditor } from '~/components/bot/bot-builder/RuntimeEditor';
import { ProjectViewer } from '~/components/bot/bot-builder/ProjectViewer';
import { AppDialogProvider } from '~/components/bot/bot-builder/Dialog/AppDialogProvider';
import { WebBotDemo } from '~/components/bot/bot-builder/WebBotDemo';
import ShareIcon from '@mui/icons-material/Share';
import { PublishWebBotDialog } from '~/components/bot/bot-builder/PublishWebBotDialog';
import SaveIcon from '@mui/icons-material/Save';
import BiotechIcon from '@mui/icons-material/Biotech';
import { ChatLogsDialog } from '~/components/bot/bot-builder/ChatLogsDialog';


export default function EditBotContent() {
    const router = useRouter()
    const flowDesignerTransformDescription = React.useRef<TransformDescription | null>(null);
    const [activeDraggableItem, setActiveDraggableItem] = useState<Active | null>();
    const { togglePublishWebBotDialog, platform, toggleShowWebBotDemo, blocks, updateBlock, addBlock, showProjectItemsViewer, project, initProject,
        projectIsInitialized, setViewPortOffset, updateAllLinks, toggleVariablesViewer, toggleRuntimeEditor, destroyProject,
        showWebBotDemo } = useFlowDesignerStore((state) => ({
            blocks: state.project?.blocks ?? [],
            addBlock: state.addBlock,
            updateBlock: state.updateBlock,
            project: state.project,
            initProject: state.initProject,
            projectIsInitialized: state.projectIsInitialized,
            setViewPortOffset: state.setViewPortOffset,
            updateAllLinks: state.updateAllLinks,
            toggleVariablesViewer: state.toggleProjectItemsViewer,
            toggleRuntimeEditor: state.toggleRuntimeEditor,
            destroyProject: state.destroyProject,
            platform: state.platform,
            toggleShowWebBotDemo: state.toggleShowWebBotDemo,
            togglePublishWebBotDialog: state.togglePublishWebBotDialog,
            showProjectItemsViewer: state.showProjectItemsViewer,
            showWebBotDemo: state.showWebBotDemo,
        }));
    const { mutateAsync, isLoading: isLoadingSaveBotDescription } = api.botManagement.saveBotContent.useMutation();
    const { changeTransformDescription } = useFlowDesignerStore((state) => ({ changeTransformDescription: state.changeTransformDescription }));

    const projectIdFromQuery = router.query.id as string;
    const { data: projectDescription, remove: removeBotResponse, isLoading: isLoadingProjectBotDescription } = api.botManagement.getBotContent.useQuery({ id: projectIdFromQuery }, { enabled: typeof projectIdFromQuery === 'string' && Boolean(router.query.id) && projectIsInitialized === false });
    const viewPortRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        return () => {
            destroyProject();
            removeBotResponse();
        }
    }, [destroyProject, removeBotResponse]);

    useEffect(() => {
        if (!projectDescription) {
            return;
        }

        initProject(projectDescription.botType, projectDescription.content ?? null);
    }, [initProject, projectDescription, projectIsInitialized, router.query.id]);


    const { setNodeRef, node } = useDroppable({
        id: 'droppable-area-for-new-elements',
        data: {
            accepts: [ElementType.CONTENT_TEXT],
        },
    });

    useLayoutEffect(() => {
        const element = viewPortRef.current;
        if (isNil(element)) {
            return;
        }

        const rect = element.getBoundingClientRect();
        setViewPortOffset({ x: rect.left, y: rect.top });
    }, [viewPortRef, setViewPortOffset])

    const activeId = useMemo(() => {
        if (isNil(activeDraggableItem)) {
            return null;
        }

        return activeDraggableItem.id;
    }, [activeDraggableItem]);

    const existsUIElementsInfo = useMemo(() => {
        const elementBlockMap = new Map<UIElement, FlowDesignerUIBlockDescription>();
        const uiElements = [];
        const uiElementIds = [];
        for (const block of blocks) {
            uiElements.push(...block.elements);

            for (const element of block.elements) {
                elementBlockMap.set(element, block);
                uiElementIds.push(element.id);
            }
        }

        return { uiElements, uiElementIds, elementBlockMap };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocks, blocks.map(p => p.elements)]);

    const activeElement = useMemo(() => {
        // const allElements = blocks.map(b => b.elements).flat(1);
        const { uiElements: existsUIElements } = existsUIElementsInfo;
        const draggableElement = existsUIElements.find(e => e.id === activeId);
        const currentData = (activeDraggableItem?.data as DataRef<DraggableElementData>)?.current;

        if (isNil(draggableElement) && !isNil(activeId) && !isNil(currentData) && currentData.isNewElement) {
            const template = getNewUIElementTemplate(activeId.toString(), currentData);

            return template;
        }

        return draggableElement;
    }, [activeDraggableItem?.data, activeId, existsUIElementsInfo]);

    const handleTransformDescriptionChange = useCallback((newValue: TransformDescription) => {
        if (newValue !== flowDesignerTransformDescription.current) {
            changeTransformDescription(newValue);
        }

        flowDesignerTransformDescription.current = newValue;
    }, [changeTransformDescription])

    // const handleBlocksUpdate = (newBlocks: FlowDesignerUIBlockDescription[]) => {
    //     updateBlocks([...newBlocks]);
    // }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
                tolerance: 5,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(args: DragEndEvent) {
        const addNewBlock = () => {
            if (activeElement) {
                const newBlockPosition = getPositionForNewBlock(args, node.current, flowDesignerTransformDescription.current);
                if (!isNil(newBlockPosition)) {
                    const newBlock = getNewBlock(newBlockPosition, activeElement, `Block #${blocks.length}`);
                    addBlock(newBlock);
                }
            }
        }

        const { active, over } = args;
        const activeContainer = findContainer(active.id);

        if (isNil(over) && isNil(activeContainer)) {
            addNewBlock();
            return;
        }


        if (!activeContainer) {
            setActiveDraggableItem(null);
            return;
        }

        const overId = over?.id;

        if (overId == null) {
            setActiveDraggableItem(null);
            return;
        }

        const overContainer = findContainer(overId);
        // let newBlocks: FlowDesignerUIBlockDescription[] | null = null;

        if (overContainer) {
            const activeIndex = findIndex(activeContainer.elements, (elem) => elem.id === active.id);
            const overIndex = findIndex(overContainer.elements, (elem) => elem.id === overId);

            if (activeIndex !== overIndex) {
                overContainer.elements = arrayMove(overContainer.elements, activeIndex, overIndex);
                // newBlocks = [...blocks];
                updateBlock(overContainer);
            }
        }


        updateAllLinks();

        setActiveDraggableItem(null);
    }

    function findContainer(id: UniqueIdentifier) {
        for (const block of blocks) {
            const child = block.elements.find(e => e.id === id);
            if (!isNil(child)) {
                return block;
            }
        }

        return null;
    }


    function handleDragStart(event: DragStartEvent) {
        const { active } = event;

        setActiveDraggableItem(active);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;

        if (isNil(over)) {
            const currentData = (activeDraggableItem?.data as DataRef<DraggableElementData>)?.current;

            if (currentData && currentData.isNewElement && activeElement && activeId && existsUIElementsInfo.uiElements.includes(activeElement)) {
                const block = existsUIElementsInfo.elementBlockMap.get(activeElement);

                if (block) {
                    remove(block.elements, e => e === activeElement);
                    updateBlock(block);
                }
            }
            return;
        }

        const { id } = active;
        const overId = over.id;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        const getIndex = (overIndex: number, elements: UIElement[]) => {
            const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                over.rect.top + over.rect.height;
            const modifier = isBelowOverItem ? 1 : 0;

            const newIndex =
                overIndex >= 0 ? overIndex + modifier : elements.length + 1;

            return newIndex;
        }

        const currentData = (activeDraggableItem?.data as DataRef<DraggableElementData>)?.current;


        if (overContainer && activeElement && currentData && currentData.isNewElement && !overContainer.elements.find(localElement => localElement.id === activeElement.id)) {
            const overIndex = findIndex(overContainer.elements, p => p.id === overId);
            const newIndex = getIndex(overIndex, overContainer.elements);
            overContainer.elements.splice(newIndex, 0, { ...activeElement });
            overContainer.elements = [...overContainer.elements];

            updateBlock(overContainer);
            return;
        }

        if (
            isNil(activeContainer) ||
            isNil(overContainer) ||
            activeContainer === overContainer
        ) {
            return;
        }

        const getUpdatedBlocks = () => {
            const activeItems = activeContainer.elements;
            const overItems = overContainer.elements;
            const overIndex = findIndex(overItems, p => p.id === overId);
            const activeIndex = findIndex(activeItems, p => p.id === active.id);

            const newIndex = getIndex(overIndex, overItems);

            const element = activeContainer.elements[activeIndex]!;
            activeContainer.elements = activeContainer.elements.filter((item) => item.id !== active.id);
            overContainer.elements = [...overContainer.elements.slice(0, newIndex), element, ...overContainer.elements.slice(newIndex, overContainer.elements.length)]

            return { block1: activeContainer, block2: overContainer }
        };

        const { block1, block2 } = getUpdatedBlocks();
        updateBlock(block1);
        updateBlock(block2);
    }

    const handleSaveBot = useCallback(async () => {
        if (isNil(router.query.id) || typeof router.query.id !== 'string') {
            throw new Error('InvalidOperationError');
        }

        try {
            await mutateAsync({ project: JSON.stringify(project), projectId: router.query.id });
            showSuccessMessage('The bot successfully saved');
        }
        catch (e) {
            showError('Failed to save bot content :(');
        }
    }, [mutateAsync, project, router.query]);

    const handleToggleVariables = useCallback(() => {
        toggleVariablesViewer();
    }, [toggleVariablesViewer]);

    const handleTestBot = useCallback(() => {
        toggleShowWebBotDemo();
    }, [toggleShowWebBotDemo]);


    const handleShowShareWebBotWindow = useCallback(() => {
        togglePublishWebBotDialog();
    }, [togglePublishWebBotDialog]);

    return (
        <AppDialogProvider>
            <ConfirmProvider>
                <Box sx={{ padding: (theme) => theme.spacing(2), height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }} onContextMenu={(e) => e.preventDefault()}>
                    <SnackbarProvider />
                    <Box sx={{ display: 'flex', paddingBottom: 1, position: 'relative' }}>
                        <Box>
                            <Button sx={{ textTransform: 'none' }} endIcon={<SaveIcon />} variant="outlined" color="success" onClick={handleSaveBot}>
                                Save
                            </Button>

                            {platform === BotPlatform.Telegram &&
                                <Button variant="outlined" sx={{ ml: 1, textTransform: 'none' }} startIcon={<RouterIcon />} onClick={toggleRuntimeEditor}>
                                    start&stop your bots
                                </Button>
                            }
                            {platform === BotPlatform.WEB &&
                                <>
                                    <Button variant="outlined" sx={{ ml: 1, textTransform: 'none' }} startIcon={<ShareIcon />} onClick={handleShowShareWebBotWindow}>
                                        Share your bot
                                    </Button>
                                </>
                            }
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                            {platform === BotPlatform.WEB &&
                                <Button variant='outlined' sx={{
                                    textTransform: 'none',
                                    ...(showWebBotDemo ? { color: () => 'primary.contrastText', backgroundColor: () => 'primary.main', '&:hover': { backgroundColor: () => 'primary.dark' } } : {})
                                }} startIcon={<BiotechIcon />} color="info" onClick={handleTestBot}>Test current bot</Button>
                            }
                            <Button variant='outlined' sx={{
                                ml: 1, textTransform: 'none',
                                ...(showProjectItemsViewer ? { color: () => 'primary.contrastText', backgroundColor: () => 'primary.main', '&:hover': { backgroundColor: () => 'primary.dark' } } : {})
                            }} color="info" startIcon={<AbcIcon />} onClick={handleToggleVariables}>Variables</Button>
                        </Box>
                        {(isLoadingSaveBotDescription || isLoadingProjectBotDescription) && <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
                            <LinearProgress/>
                        </Box>}
                    </Box>




                    <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                        <DndContext
                            onDragOver={handleDragOver}
                            onDragStart={handleDragStart}
                            sensors={sensors}
                            onDragEnd={handleDragEnd}
                            measuring={{
                                droppable: {
                                    strategy: MeasuringStrategy.Always,
                                },
                            }}
                            collisionDetection={pointerWithin}
                            modifiers={[flowDesignerTransformModifier(flowDesignerTransformDescription.current, node)]}
                        >
                            <Box sx={{ flex: 1 }} ref={viewPortRef}>
                                {projectIsInitialized &&
                                    (
                                        <FlowDesigner
                                            blocks={blocks}
                                            onTransformDescriptionChange={handleTransformDescriptionChange}
                                            activeElement={activeElement}
                                            setNodeRef={setNodeRef} />
                                    )
                                }
                            </Box>
                        </DndContext>
                        <ProjectViewer />
                        <RuntimeEditor projectId={projectIdFromQuery} />
                        {platform === BotPlatform.WEB && <PublishWebBotDialog projectId={projectIdFromQuery} />}
                        {platform === BotPlatform.WEB && <WebBotDemo />}
                        <ChatLogsDialog />
                    </Box>

                </Box>
            </ConfirmProvider>
        </AppDialogProvider >
    )
}
