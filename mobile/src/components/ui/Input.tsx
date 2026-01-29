import React, { useState } from 'react';
import {
    View,
    TextInput as RNTextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInputProps as RNTextInputProps,
    ViewStyle,
} from 'react-native';
import { useTheme, Theme } from '../../theme';

interface InputProps extends RNTextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
    showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    containerStyle,
    inputContainerStyle,
    showPasswordToggle = false,
    secureTextEntry,
    style,
    ...props
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const hasError = !!error;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    hasError && styles.inputContainerError,
                    inputContainerStyle,
                ]}
            >
                {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

                <RNTextInput
                    style={[
                        styles.input,
                        leftIcon && styles.inputWithLeftIcon,
                        (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
                        style,
                    ]}
                    placeholderTextColor={theme.colors.inputPlaceholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
                    {...props}
                />

                {showPasswordToggle && (
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Text style={styles.toggleText}>
                            {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                        </Text>
                    </TouchableOpacity>
                )}

                {rightIcon && !showPasswordToggle && (
                    <View style={styles.iconContainer}>{rightIcon}</View>
                )}
            </View>

            {(error || hint) && (
                <Text style={[styles.hint, hasError && styles.errorText]}>
                    {error || hint}
                </Text>
            )}
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text,
            marginBottom: theme.spacing.xs,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.inputBackground,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1.5,
            borderColor: theme.colors.inputBorder,
            overflow: 'hidden',
        },
        inputContainerFocused: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.background,
        },
        inputContainerError: {
            borderColor: theme.colors.error,
            backgroundColor: theme.colors.errorLight,
        },
        input: {
            flex: 1,
            paddingVertical: 14,
            paddingHorizontal: 16,
            fontSize: 16,
            color: theme.colors.inputText,
        },
        inputWithLeftIcon: {
            paddingLeft: 8,
        },
        inputWithRightIcon: {
            paddingRight: 8,
        },
        iconContainer: {
            paddingHorizontal: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        hint: {
            fontSize: 12,
            color: theme.colors.textTertiary,
            marginTop: theme.spacing.xs,
        },
        errorText: {
            color: theme.colors.error,
        },
        toggleText: {
            fontSize: 18,
        },
    });

export default Input;
