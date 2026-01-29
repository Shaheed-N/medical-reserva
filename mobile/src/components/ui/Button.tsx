import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Theme } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    gradient?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    gradient = false,
    style,
    ...props
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const isDisabled = disabled || loading;

    const getButtonStyle = (): ViewStyle[] => {
        const baseStyles: ViewStyle[] = [styles.button, styles[`button_${size}`]];

        switch (variant) {
            case 'primary':
                baseStyles.push(styles.buttonPrimary);
                break;
            case 'secondary':
                baseStyles.push(styles.buttonSecondary);
                break;
            case 'outline':
                baseStyles.push(styles.buttonOutline);
                break;
            case 'ghost':
                baseStyles.push(styles.buttonGhost);
                break;
            case 'danger':
                baseStyles.push(styles.buttonDanger);
                break;
        }

        if (fullWidth) {
            baseStyles.push(styles.fullWidth);
        }

        if (isDisabled) {
            baseStyles.push(styles.buttonDisabled);
        }

        return baseStyles;
    };

    const getTextStyle = (): TextStyle[] => {
        const baseStyles: TextStyle[] = [styles.text, styles[`text_${size}`]];

        switch (variant) {
            case 'primary':
            case 'danger':
                baseStyles.push(styles.textLight);
                break;
            case 'secondary':
                baseStyles.push(styles.textPrimary);
                break;
            case 'outline':
            case 'ghost':
                baseStyles.push(styles.textPrimary);
                break;
        }

        if (isDisabled) {
            baseStyles.push(styles.textDisabled);
        }

        return baseStyles;
    };

    const renderContent = () => (
        <>
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' || variant === 'danger' ? '#fff' : theme.colors.primary}
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && icon}
                    <Text style={getTextStyle()}>{title}</Text>
                    {icon && iconPosition === 'right' && icon}
                </>
            )}
        </>
    );

    if (gradient && variant === 'primary' && !isDisabled) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                disabled={isDisabled}
                style={[styles.gradientWrapper, fullWidth && styles.fullWidth, style]}
                {...props}
            >
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, styles[`button_${size}`], styles.gradient]}
                >
                    {renderContent()}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={isDisabled}
            style={[...getButtonStyle(), style]}
            {...props}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.borderRadius.lg,
            gap: 8,
        },
        button_sm: {
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
        button_md: {
            paddingVertical: 14,
            paddingHorizontal: 24,
        },
        button_lg: {
            paddingVertical: 18,
            paddingHorizontal: 32,
        },
        buttonPrimary: {
            backgroundColor: theme.colors.primary,
        },
        buttonSecondary: {
            backgroundColor: theme.colors.primaryLight,
        },
        buttonOutline: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: theme.colors.primary,
        },
        buttonGhost: {
            backgroundColor: 'transparent',
        },
        buttonDanger: {
            backgroundColor: theme.colors.error,
        },
        buttonDisabled: {
            opacity: 0.5,
        },
        fullWidth: {
            width: '100%',
        },
        gradientWrapper: {
            borderRadius: theme.borderRadius.lg,
            overflow: 'hidden',
        },
        gradient: {
            borderRadius: theme.borderRadius.lg,
        },
        text: {
            fontWeight: '600',
        },
        text_sm: {
            fontSize: 14,
        },
        text_md: {
            fontSize: 16,
        },
        text_lg: {
            fontSize: 18,
        },
        textLight: {
            color: '#ffffff',
        },
        textPrimary: {
            color: theme.colors.primary,
        },
        textDisabled: {
            color: theme.colors.textTertiary,
        },
    });

export default Button;
