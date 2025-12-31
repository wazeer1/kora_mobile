import styled from 'styled-components/native';
import { Theme } from '../../../theme';

interface StyledButtonProps {
    theme: Theme;
    variant: 'primary' | 'secondary' | 'outline';
    size: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    fullWidth?: boolean;
}

export const StyledButton = styled.Pressable<StyledButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: ${(props) => {
        switch (props.size) {
            case 'sm': return `${props.theme.spacing.sm}px ${props.theme.spacing.md}px`;
            case 'lg': return `${props.theme.spacing.lg}px ${props.theme.spacing.xl}px`;
            default: return `${props.theme.spacing.md}px ${props.theme.spacing.lg}px`;
        }
    }};
  background-color: ${(props) => {
        if (props.disabled) return props.theme.colors.border;
        switch (props.variant) {
            case 'primary': return props.theme.colors.primary;
            case 'secondary': return props.theme.colors.secondary;
            case 'outline': return 'transparent';
            default: return props.theme.colors.primary;
        }
    }};
  border: ${(props) => props.variant === 'outline' ? `1px solid ${props.theme.colors.border}` : 'none'};
  opacity: ${(props) => props.disabled ? 0.5 : 1};
  ${(props) => props.fullWidth ? 'width: 100%;' : ''}
`;

export const ButtonText = styled.Text<{ theme: Theme; variant: string }>`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: ${(props) => props.theme.typography.body.fontWeight};
  color: ${(props) => {
        switch (props.variant) {
            case 'primary': return props.theme.colors.surface;
            case 'secondary': return props.theme.colors.text;
            case 'outline': return props.theme.colors.text;
            default: return props.theme.colors.surface;
        }
    }};
`;
