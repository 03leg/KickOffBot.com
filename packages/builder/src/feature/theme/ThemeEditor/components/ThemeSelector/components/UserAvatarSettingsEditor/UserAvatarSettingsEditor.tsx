import React from 'react'
import AvatarSettingsEditor from '../AvatarSettingsEditor/AvatarSettingsEditor'
import { useThemeDesignerStore } from '../../store/useThemeDesignerStore';
import { AvatarView } from '@kickoffbot.com/types';

export default function UserAvatarSettingsEditor() {
    const { showAvatar, avatarImageUrl, avatarSize, avatarView, setUserMessageAvatarAppearance, avatarColor, avatarText } = useThemeDesignerStore((state) => ({
        showAvatar: state.userMessageAppearance.avatarSettings?.showAvatar ?? false,
        avatarImageUrl: state.userMessageAppearance.avatarSettings?.avatarImageUrl ?? '',
        avatarSize: state.userMessageAppearance.avatarSettings?.avatarSize ?? 'medium',
        setUserMessageAvatarAppearance: state.setUserMessageAvatarAppearance,
        avatarView: state.userMessageAppearance.avatarSettings?.avatarView ?? AvatarView.ColorInitials,
        avatarColor: state.userMessageAppearance.avatarSettings?.avatarColor ?? '#bbb',
        avatarText: state.userMessageAppearance.avatarSettings?.avatarText ?? '',
    }));

    return (
        <AvatarSettingsEditor
            showAvatar={showAvatar} onShowAvatarChange={(newValue) => setUserMessageAvatarAppearance({ showAvatar: newValue })}
            avatarImageUrl={avatarImageUrl} onAvatarImageUrlChange={(newValue) => setUserMessageAvatarAppearance({ avatarImageUrl: newValue })}
            size={avatarSize} onSizeChange={(newValue) => setUserMessageAvatarAppearance({ avatarSize: newValue })}
            avatarView={avatarView} onAvatarViewChange={(newValue) => setUserMessageAvatarAppearance({ avatarView: newValue })}
            avatarColor={avatarColor} onAvatarColorChange={(newValue) => setUserMessageAvatarAppearance({ avatarColor: newValue })}
            avatarText={avatarText} onAvatarTextChange={(newValue) => setUserMessageAvatarAppearance({ avatarText: newValue })}
        />
    )
}
