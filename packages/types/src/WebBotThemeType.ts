export enum BackgroundColorSchema {
    OneColor = "one-color",
    Schema1 = "schema-1",
    Schema2 = "schema-2",
    Schema3 = "schema-3",
    Image = "image",
  }
  
  export interface WebChatBackgroundDescription {
    schema?: BackgroundColorSchema;
    color1?: string;
    color2?: string;
    imageUrl?: string;
  
    paperColor: string;
  }
  
  export enum AvatarView {
    ColorInitials = "color-initials",
    Image = "image",
  }
  
  export interface AvatarSettings {
    showAvatar?: boolean;
    avatarImageUrl?: string;
    avatarColor?: string;
    avatarText?: string;
    avatarSize?: "small" | "medium" | "large";
    avatarView?: AvatarView;
  }
  
  export interface MessageAppearanceDescription {
    backgroundColor: string;
    textColor: string;
  
    avatarSettings: AvatarSettings;
  }
  
  export interface PrimaryColors {
    main: string;
    contrastText: string;
  }
  
  export interface WebChatTheme {
    background: WebChatBackgroundDescription;
    primaryColors: PrimaryColors;
    userMessageAppearance: MessageAppearanceDescription;
    botMessageAppearance: MessageAppearanceDescription;
  }
  