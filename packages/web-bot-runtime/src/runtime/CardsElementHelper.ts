import {
  BotProject,
  ButtonPortDescription,
  CardsRequestElement,
  CardsUserResponse,
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
import { isNil } from 'lodash';

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
      throw new Error('NotImplementedError: Dynamic cards not implemented yet');
    } else {
      throw new Error('NotImplementedError: Unknown cards strategy');
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
