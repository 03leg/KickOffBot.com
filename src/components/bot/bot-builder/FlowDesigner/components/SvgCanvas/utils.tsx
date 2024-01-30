import { isNil } from "lodash";
import { type ButtonPortDescription, type FlowDesignerLink } from "../../../types";
import { type CoordinateDescription, type PositionDescription, type TransformDescription } from "../../types";
import { Sector, getDistance, getPartLinePath, getSector } from "../OutputPort/utils";

const mapAppIdElement = new Map<string, Element>();
const step = 50 as const;
const inputTopStep = 10 as const;

function getOutputPortElement(id: string) {
    return getElementBySelector(`[data-app-output-port="${id}"]`);
}

function getElement(id: string) {
    return getElementBySelector(`[data-app-id="${id}"]`);
}

function getElementBySelector(selector: string) {

    const cachedElement = mapAppIdElement.get(selector);
    if (!isNil(cachedElement)) {
        return cachedElement;
    }

    const element = document.querySelector(selector);

    if (isNil(element)) {
        throw new Error('InvalidOperationError');
    }

    mapAppIdElement.set(selector, element);

    return element;
}

function getElementPosition(element: Element,
    viewPortOffset: PositionDescription,
    transformDescription: TransformDescription): CoordinateDescription {

    const elementClientRect = element.getBoundingClientRect();

    const top =
        (elementClientRect.top - viewPortOffset.y - transformDescription.y) *
        (1 / transformDescription.scale);
    const left =
        (elementClientRect.left - viewPortOffset.x - transformDescription.x) *
        (1 / transformDescription.scale);

    const height =
        elementClientRect.height * (1 / transformDescription.scale);
    const width = elementClientRect.width * (1 / transformDescription.scale);

    return { top, left, height, width };

}

function get0Path(outputElementPosition: CoordinateDescription, inputElementPosition: CoordinateDescription, incomeIndex: number, outcomeIndex: number) {
    const deltaOutcome = outcomeIndex * inputTopStep;
    const deltaIncome = inputTopStep * incomeIndex;

    const point1 = { x: outputElementPosition.left + 8, y: outputElementPosition.top + 8 };
    const point2 = { x: outputElementPosition.left + 8 + (inputElementPosition.left - outputElementPosition.left) / 2 + deltaOutcome, y: point1.y };
    const point3 = { x: point2.x, y: inputElementPosition.top + inputTopStep + deltaIncome };
    const point4 = { x: inputElementPosition.left, y: point3.y }


    const result = getPartLinePath(point1, point2) + getPartLinePath(point3) + getPartLinePath(point4);

    return result;
}

function get1Path(outputElementPosition: CoordinateDescription, inputElementPosition: CoordinateDescription,
    outputBlockElementPosition: CoordinateDescription,
    incomeIndex: number, outcomeIndex: number) {

    const deltaIncome = incomeIndex * inputTopStep;
    const deltaOutcome = outcomeIndex * inputTopStep;

    const point1 = { x: outputElementPosition.left + 8, y: outputElementPosition.top + 8 };
    const point2 = { x: outputElementPosition.left + 8 + step + deltaOutcome, y: point1.y };

    const point3 = { x: point2.x, y: outputBlockElementPosition.top - step - deltaOutcome };
    const point4 = { x: outputBlockElementPosition.left - step - deltaOutcome, y: point3.y };

    const halfPathX1 = (point4.x - (inputElementPosition.left + inputElementPosition.width)) / 2 + deltaOutcome / 2;
    point4.x -= halfPathX1;

    const point5 = { x: point4.x, y: inputElementPosition.top - step - deltaIncome };
    const point6 = { x: inputElementPosition.left - step - deltaIncome, y: point5.y };
    const point7 = { x: point6.x, y: inputElementPosition.top + deltaIncome };
    const point8 = { x: inputElementPosition.left, y: point7.y }

    const path = getPartLinePath(point1, point2) + getPartLinePath(point3) + getPartLinePath(point4)
        + getPartLinePath(point5) + getPartLinePath(point6) + getPartLinePath(point7) + getPartLinePath(point8);

    const distance = getDistance(point1, point2)
        + getDistance(point2, point3)
        + getDistance(point3, point4)
        + getDistance(point4, point5)
        + getDistance(point5, point6)
        + getDistance(point6, point7)
        + getDistance(point7, point8);

    return { path, distance };
}

function get3Path(outputElementPosition: CoordinateDescription, inputElementPosition: CoordinateDescription,
    outputBlockElementPosition: CoordinateDescription,
    incomeIndex: number, outcomeIndex: number) {

    const deltaIncome = incomeIndex * inputTopStep;
    const deltaOutcome = outcomeIndex * inputTopStep;

    const point1 = { x: outputElementPosition.left + 8, y: outputElementPosition.top + 8 };
    const point2 = { x: outputElementPosition.left + 8 + step + deltaOutcome, y: point1.y };

    const point3 = { x: point2.x, y: outputBlockElementPosition.top - step - deltaOutcome };
    const point4 = { x: outputBlockElementPosition.left - step - deltaOutcome, y: point3.y };

    const halfPathX1 = (point4.x - (inputElementPosition.left + inputElementPosition.width)) / 2 + deltaOutcome / 2;
    point4.x -= halfPathX1;

    const point5 = { x: point4.x, y: inputElementPosition.top + inputElementPosition.height + step + deltaIncome };
    const point6 = { x: inputElementPosition.left - step - deltaIncome, y: point5.y };
    const point7 = { x: point6.x, y: inputElementPosition.top + deltaIncome };
    const point8 = { x: inputElementPosition.left, y: point7.y }

    const path = getPartLinePath(point1, point2) + getPartLinePath(point3) + getPartLinePath(point4)
        + getPartLinePath(point5) + getPartLinePath(point6) + getPartLinePath(point7) + getPartLinePath(point8);

    const distance = getDistance(point1, point2)
        + getDistance(point2, point3)
        + getDistance(point3, point4)
        + getDistance(point4, point5)
        + getDistance(point5, point6)
        + getDistance(point6, point7)
        + getDistance(point7, point8);

    return { path, distance };
}

function get2Path(outputElementPosition: CoordinateDescription, inputElementPosition: CoordinateDescription,
    outputBlockElementPosition: CoordinateDescription,
    incomeIndex: number, outcomeIndex: number) {
    const deltaIncome = incomeIndex * inputTopStep;
    const deltaOutcome = outcomeIndex * inputTopStep;

    const point1 = { x: outputElementPosition.left + 8, y: outputElementPosition.top + 8 };
    const point2 = { x: outputElementPosition.left + 8 + step + deltaOutcome, y: point1.y };
    const point3 = { x: point2.x, y: outputBlockElementPosition.top + outputBlockElementPosition.height + step + deltaOutcome };

    const point4 = { x: outputBlockElementPosition.left - step - deltaOutcome, y: point3.y };

    const halfPathX1 = (point4.x - (inputElementPosition.left + inputElementPosition.width)) / 2 + deltaOutcome / 2;
    point4.x -= halfPathX1;

    const point5 = { x: point4.x, y: inputElementPosition.top - step - deltaIncome };
    const point6 = { x: inputElementPosition.left - step - deltaIncome, y: point5.y };
    const point7 = { x: point6.x, y: inputElementPosition.top + deltaIncome };
    const point8 = { x: inputElementPosition.left, y: point7.y }

    const path = getPartLinePath(point1, point2)
        + getPartLinePath(point3)
        + getPartLinePath(point4)
        + getPartLinePath(point5)
        + getPartLinePath(point6)
        + getPartLinePath(point7)
        + getPartLinePath(point8);

    const distance = getDistance(point1, point2)
        + getDistance(point2, point3)
        + getDistance(point3, point4)
        + getDistance(point4, point5)
        + getDistance(point5, point6)
        + getDistance(point6, point7)
        + getDistance(point7, point8);

    return { path, distance };
}

function get4Path(outputElementPosition: CoordinateDescription, inputElementPosition: CoordinateDescription,
    outputBlockElementPosition: CoordinateDescription,
    incomeIndex: number, outcomeIndex: number) {
    const deltaIncome = incomeIndex * inputTopStep;
    const deltaOutcome = outcomeIndex * inputTopStep;

    const point1 = { x: outputElementPosition.left + 8, y: outputElementPosition.top + 8 };
    const point2 = { x: outputElementPosition.left + 8 + step + deltaOutcome, y: point1.y };
    const point3 = { x: point2.x, y: outputBlockElementPosition.top + outputBlockElementPosition.height + step + deltaOutcome };

    const point4 = { x: outputBlockElementPosition.left - step - deltaOutcome, y: point3.y };

    const halfPathX1 = (point4.x - (inputElementPosition.left + inputElementPosition.width)) / 2 + deltaOutcome / 2;
    point4.x -= halfPathX1;

    const point5 = { x: point4.x, y: inputElementPosition.top + inputElementPosition.height + step + deltaIncome };
    const point6 = { x: inputElementPosition.left - step - deltaIncome, y: point5.y };
    const point7 = { x: point6.x, y: inputElementPosition.top + deltaIncome };
    const point8 = { x: inputElementPosition.left, y: point7.y }

    const path = getPartLinePath(point1, point2)
        + getPartLinePath(point3)
        + getPartLinePath(point4)
        + getPartLinePath(point5)
        + getPartLinePath(point6)
        + getPartLinePath(point7)
        + getPartLinePath(point8);

    const distance = getDistance(point1, point2)
        + getDistance(point2, point3)
        + getDistance(point3, point4)
        + getDistance(point4, point5)
        + getDistance(point5, point6)
        + getDistance(point6, point7)
        + getDistance(point7, point8);

    return { path, distance };
}

function getPath(outputElementPosition: CoordinateDescription, inputElementPosition: CoordinateDescription,
    incomeIndex: number,
    outcomeIndex: number,
    outputBlockElementPosition: CoordinateDescription): string {

    const sector = getSector(outputElementPosition.left, outputElementPosition.top, inputElementPosition.left, inputElementPosition.top);

    let result = '';
    if (sector === Sector.S2 || sector === Sector.S4) {
        result = get0Path(outputElementPosition, inputElementPosition, incomeIndex, outcomeIndex);
    }
    if (sector === Sector.S1 || sector === Sector.S3) {
        const path1 = get1Path(outputElementPosition, inputElementPosition, outputBlockElementPosition, incomeIndex + 1, outcomeIndex);
        const path2 = get2Path(outputElementPosition, inputElementPosition, outputBlockElementPosition, incomeIndex + 1, outcomeIndex);
        const path3 = get3Path(outputElementPosition, inputElementPosition, outputBlockElementPosition, incomeIndex + 1, outcomeIndex);
        const path4 = get4Path(outputElementPosition, inputElementPosition, outputBlockElementPosition, incomeIndex + 1, outcomeIndex);

        const paths = {
            [path1.distance]: path1.path,
            [path2.distance]: path2.path,
            [path3.distance]: path3.path,
            [path4.distance]: path4.path,
        };

        const minValue = Math.min(path1.distance, path2.distance);

        result = paths[minValue]!;

    }

    return result;
}

export function getSvgPathForLink(link: FlowDesignerLink,
    viewPortOffset: PositionDescription,
    transformDescription: TransformDescription,
    incomeIndex: number,
    outcomeIndex: number): string {


    const output = link.output as ButtonPortDescription;
    const input = link.input;

    const outputElement = getOutputPortElement(output.buttonId ?? output.blockId);
    const outputElementPosition = getElementPosition(outputElement, viewPortOffset, transformDescription);

    const outputBlockElement = getElement(output.blockId);
    const outputBlockElementPosition = getElementPosition(outputBlockElement, viewPortOffset, transformDescription);

    const inputElement = getElement(input.blockId);
    const inputElementPosition = getElementPosition(inputElement, viewPortOffset, transformDescription);


    const bestPath = getPath(outputElementPosition, inputElementPosition, incomeIndex, outcomeIndex, outputBlockElementPosition);

    return bestPath;
}
