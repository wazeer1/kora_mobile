import React, { useMemo } from 'react';
import { ActivityIndicator, PressableProps } from 'react-native';
import { useTheme } from '../../../hooks';
import { ButtonText, StyledButton } from './Button.styles';

export interface ButtonProps extends PressableProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    loading?: boolean;
    fullWidth?: boolean;
    labelStyle?: any;
}

export const Button: React.FC<ButtonProps> = ({
    label,
    variant = 'primary',
    size = 'md',
    icon,
    loading = false,
    fullWidth = false,
    disabled = false,
    accessibilityLabel,
    labelStyle,
    ...props
}) => {
    const theme = useTheme();

    const isDisabled = useMemo(() => disabled || loading, [disabled, loading]);

    return (
        <StyledButton
            theme={theme}
            variant={variant}
            size={size}
            disabled={isDisabled}
            fullWidth={fullWidth}
            accessibilityLabel={accessibilityLabel || label}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            {...props}
        >
            {icon && !loading && icon}
            {loading && <ActivityIndicator size="small" color={theme.colors.surface} />}
            <ButtonText theme={theme} variant={variant} style={labelStyle}>
                {label}
            </ButtonText>

        </StyledButton>
    );
};
