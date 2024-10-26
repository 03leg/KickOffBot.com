import { AvatarView } from '@kickoffbot.com/types';
import React from 'react'
import { useThemeDesignerStore } from '../../store/useThemeDesignerStore';
import AvatarSettingsEditor from '../AvatarSettingsEditor/AvatarSettingsEditor';

export default function BotAvatarSettingsEditor() {
    const { showAvatar, avatarImageUrl, avatarSize, avatarView, setBotMessageAvatarAppearance, avatarColor, avatarText } = useThemeDesignerStore((state) => ({
        showAvatar: state.botMessageAppearance.avatarSettings?.showAvatar ?? false,
        avatarImageUrl: state.botMessageAppearance.avatarSettings?.avatarImageUrl ?? '',
        avatarSize: state.botMessageAppearance.avatarSettings?.avatarSize ?? 'medium',
        setBotMessageAvatarAppearance: state.setBotMessageAvatarAppearance,
        avatarView: state.botMessageAppearance.avatarSettings?.avatarView ?? AvatarView.ColorInitials,
        avatarColor: state.botMessageAppearance.avatarSettings?.avatarColor ?? '#bbb',
        avatarText: state.botMessageAppearance.avatarSettings?.avatarText ?? '',
    }));

    return (
        <AvatarSettingsEditor
            showAvatar={showAvatar} onShowAvatarChange={(newValue) => setBotMessageAvatarAppearance({ showAvatar: newValue })}
            avatarImageUrl={avatarImageUrl} onAvatarImageUrlChange={(newValue) => setBotMessageAvatarAppearance({ avatarImageUrl: newValue })}
            size={avatarSize} onSizeChange={(newValue) => setBotMessageAvatarAppearance({ avatarSize: newValue })}
            avatarView={avatarView} onAvatarViewChange={(newValue) => setBotMessageAvatarAppearance({ avatarView: newValue })}
            avatarColor={avatarColor} onAvatarColorChange={(newValue) => setBotMessageAvatarAppearance({ avatarColor: newValue })}
            avatarText={avatarText} onAvatarTextChange={(newValue) => setBotMessageAvatarAppearance({ avatarText: newValue })}
        />
    )
}
