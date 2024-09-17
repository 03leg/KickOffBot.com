import {
  BotProject,
  ButtonPortDescription,
  CardsRequestElement,
  CardsUserResponse,
  DynamicSourceDescription,
  ElementType,
  FlowDesignerLink,
  StaticSourceDescription,
  VariableType,
  WebCardChatItem,
  WebCardsSourceStrategy,
  WebInputCardsUIElement,
} from '@kickoffbot.com/types';
import { WebBotRuntimeUtils } from './WebBotRuntimeUtils';
import { WebUserContext } from './WebUserContext';
import { isNil, isEmpty } from 'lodash';

export class CardsElementHelper {
  constructor(
    private _element: WebInputCardsUIElement,
    private _utils: WebBotRuntimeUtils,
    private _userContext: WebUserContext,
    private _botProject: BotProject,
  ) {}

  private getParsedText(text?: string): string | undefined {
    return this._utils.getParsedText(text, this._userContext);
  }

  private parseText(
    contextObject: unknown,
    text: string | undefined,
    index: number,
  ): string | undefined {
    if (isEmpty(text)) {
      return '';
    }

    const parsedText = this.getParsedText(text);

    const temp1 = this._utils.getTextForContextObject(
      contextObject,
      parsedText,
      index,
    );

    return temp1;
  }

  public getRequestElement(): CardsRequestElement {
    const result: CardsRequestElement = {
      cardItems: [],
      elementType: ElementType.WEB_INPUT_CARDS,
      selectableCards: this._element.selectableCards,
      multipleChoice: this._element.multipleChoice,
      sendResponseOnSelect: this._element.sendResponseOnSelect,
      sendButtonText: this.getParsedText(this._element.sendButtonText),
      useCardButtons: this._element.useCardButtons,
      cardButtons: this._element.buttons,
      showSendButton: this._element.showSendButton,
    };

    if (this._element.strategy === WebCardsSourceStrategy.Static) {
      const cards = this.getStaticCards();
      result.cardItems = cards;
    } else if (this._element.strategy === WebCardsSourceStrategy.Dynamic) {
      const cards = this.getDynamicCards();
      result.cardItems = cards;
    } else {
      throw new Error('NotImplementedError: Unknown cards strategy');
    }

    return result;
  }

  private getDynamicCards(): WebCardChatItem[] {
    const result = [];
    const dataSourceDescription = this._element
      .sourceDescription as DynamicSourceDescription;

    const dataSourceVariable = this._utils.getVariableById(
      dataSourceDescription.cardsVariableId,
    );

    const currentValue: Array<unknown> =
      this._userContext.getVariableValueByName(
        dataSourceVariable.name,
      ) as Array<unknown>;

    if (currentValue instanceof Array === false) {
      return result;
    }

    let index = 0;

    for (const card of currentValue) {
      const newItem: WebCardChatItem = {
        id: index.toString(),
        value: this.parseText(
          card,
          dataSourceDescription.cardDescription.value,
          index,
        ),
        imgUrl: this.parseText(
          card,
          dataSourceDescription.cardDescription.imgUrl,
          index,
        ),
        htmlDescription: this.parseText(
          card,
          dataSourceDescription.cardDescription.htmlDescription,
          index,
        ),
      };

      index++;
      result.push(newItem);
    }

    return result;
  }

  private getStaticCards(): WebCardChatItem[] {
    const result = [];
    const dataSourceDescription = this._element
      .sourceDescription as StaticSourceDescription;

    for (const cardDescription of dataSourceDescription.cards) {
      const newItem: WebCardChatItem = {
        id: cardDescription.id,
        value: this.getParsedText(cardDescription.title),
        imgUrl: this.getParsedText(cardDescription.imgUrl),
        htmlDescription: this.getParsedText(cardDescription.htmlDescription),
      };

      result.push(newItem);
    }

    return result;
  }

  public handleUserResponse(
    userResponse: CardsUserResponse,
  ): FlowDesignerLink | undefined {
    console.log('userResponse', userResponse);

    if (this._element.strategy === WebCardsSourceStrategy.Static) {
      this.handleStaticCardsStrategy(userResponse);
    } else if (this._element.strategy === WebCardsSourceStrategy.Dynamic) {
      this.handleDynamicCardsStrategy(userResponse);
    } else throw new Error('NotImplementedError: Unknown cards strategy');

    if (this._element.useCardButtons && userResponse.clickedButton?.id) {
      const link = this.getButtonLink(userResponse.clickedButton.id);
      return link;
    }
  }

  private getButtonLink(buttonId: string) {
    let link = this._botProject.links.find(
      (l) => (l.output as ButtonPortDescription).buttonId === buttonId,
    );

    if (isNil(link)) {
      link = this._botProject.links.find(
        (l) =>
          (l.output as ButtonPortDescription).buttonId ===
          `default-button-${this._element.id}`,
      );

      if (isNil(link)) {
        return null;
      }
    }

    return link;
  }

  private handleDynamicCardsStrategy(userResponse: CardsUserResponse) {
    const sourceDescription = this._element
      .sourceDescription as DynamicSourceDescription;

    const dataSourceVariable = this._utils.getVariableById(
      sourceDescription.cardsVariableId,
    );

    const dataSourceVariableValue: Array<unknown> =
      this._userContext.getVariableValueByName(
        dataSourceVariable.name,
      ) as Array<unknown>;
    const storeUserResponseVariable = this._utils.getVariableById(
      this._element.variableId,
    );

    if (this._element.selectableCards || this._element.useCardButtons) {
      if (!this._element.multipleChoice || this._element.useCardButtons) {
        if (userResponse.selectedCards.length === 0) {
          return;
        }

        const cardIndex = Number(userResponse.selectedCards[0].id);

        const selectedCardObject = dataSourceVariableValue[cardIndex];

        if (storeUserResponseVariable.type === VariableType.ARRAY) {
          this._userContext.updateVariable(storeUserResponseVariable.name, [
            selectedCardObject,
          ]);
        } else if (storeUserResponseVariable.type === VariableType.OBJECT) {
          this._userContext.updateVariable(
            storeUserResponseVariable.name,
            selectedCardObject,
          );
        } else {
          this._userContext.updateVariable(
            storeUserResponseVariable.name,
            userResponse.selectedCards[0].value,
          );
        }
      } else {
        const selectedIndexCards = userResponse.selectedCards.map((c) => c.id);
        const newVariableValue = dataSourceVariableValue.filter((c, index) =>
          selectedIndexCards.includes(index.toString()),
        );

        if (storeUserResponseVariable.type === VariableType.ARRAY) {
          if (storeUserResponseVariable.arrayItemType === VariableType.OBJECT) {
            this._userContext.updateVariable(
              storeUserResponseVariable.name,
              newVariableValue,
            );
          } else {
            this._userContext.updateVariable(
              storeUserResponseVariable.name,
              userResponse.selectedCards.map((c) => c.value),
            );
          }
        } else {
          this._userContext.updateVariable(
            storeUserResponseVariable.name,
            userResponse.selectedCards.map((c) => c.value).join(', '),
          );
        }
      }
    }
  }

  private handleStaticCardsStrategy(userResponse: CardsUserResponse) {
    const sourceDescription = this._element
      .sourceDescription as StaticSourceDescription;

    if (this._element.selectableCards || this._element.useCardButtons) {
      const variable = this._utils.getVariableById(this._element.variableId);

      if (!this._element.multipleChoice || this._element.useCardButtons) {
        if (userResponse.selectedCards.length === 0) {
          return;
        }

        const currentValue = sourceDescription.cards.find(
          (c) => c.id === userResponse.selectedCards[0].id,
        ).title;

        if (variable.type === VariableType.ARRAY) {
          this._userContext.updateVariable(variable.name, [currentValue]);
        } else {
          this._userContext.updateVariable(variable.name, currentValue);
        }
      } else {
        const currentValue = sourceDescription.cards
          .filter((c) => userResponse.selectedCards.find((s) => s.id === c.id))
          .map((c) => c.title);

        if (variable.type === VariableType.ARRAY) {
          this._userContext.updateVariable(variable.name, currentValue);
        } else {
          this._userContext.updateVariable(
            variable.name,
            currentValue.join(', '),
          );
        }
      }
    }
  }
}