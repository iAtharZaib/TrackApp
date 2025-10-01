import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MMKV } from 'react-native-mmkv';

import { useI18n } from '@/hooks';
import { useTheme } from '@/theme';

import { IconByVariant } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

// Initialize MMKV storage
const storage = new MMKV();

function LoginScreen() {
  const { t } = useTranslation();
  const { toggleLanguage } = useI18n();

  const {
    backgrounds,
    changeTheme,
    colors,
    components,
    fonts,
    gutters,
    layout,
    variant,
  } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onChangeTheme = () => {
    changeTheme(variant === 'default' ? 'dark' : 'default');
  };

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert(t('common.error'), t('common.fill_all_fields'));
      return;
    }

    // Save credentials in MMKV
    const userData = { username, password };
    storage.set('user', JSON.stringify(userData));

    // Retrieve data from MMKV
    const saved = storage.getString('user');
    if (saved) {
      const parsed = JSON.parse(saved);
      Alert.alert(
        t('common.success'),
        `Saved Data:\nUsername: ${parsed.username}\nPassword: ${parsed.password}`
      );
    }

    setUsername('');
    setPassword('');
  };

  return (
    <SafeScreen>
      <View
        style={[
          layout.fullHeight,
          layout.fullWidth,
          layout.justifyCenter,
          layout.itemsCenter,
          backgrounds[variant === 'dark' ? 'black' : 'white'],
          gutters.paddingHorizontal_32,
        ]}
      >
        {/* Header */}
        <View style={[gutters.marginBottom_40, layout.itemsCenter]}>
          <Text
            style={[
              fonts.size_40,
              fonts.bold,
              { color: colors[variant === 'dark' ? 'white' : 'gray800'] },
            ]}
          >
            {t('screen_login.title', 'Welcome Back')}
          </Text>
          <Text
            style={[
              fonts.size_16,
              { color: colors[variant === 'dark' ? 'gray300' : 'gray500'] },
            ]}
          >
            {t('screen_login.subtitle', 'Login to continue')}
          </Text>
        </View>

        {/* Username Field */}
        <TextInput
          placeholder={t('screen_login.username', 'Username')}
          value={username}
          onChangeText={setUsername}
          style={[
            components.input,
            gutters.marginBottom_16,
            {
              backgroundColor:
                colors[variant === 'dark' ? 'gray800' : 'white'],
              color: colors[variant === 'dark' ? 'white' : 'gray800'],
              borderColor: colors.gray400,
              borderWidth: 1,
              width: '100%',
              padding: 12,
              borderRadius: 8,
            },
          ]}
          placeholderTextColor={colors.gray400}
        />

        {/* Password Field */}
        <TextInput
          placeholder={t('screen_login.password', 'Password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[
            components.input,
            gutters.marginBottom_24,
            {
              backgroundColor:
                colors[variant === 'dark' ? 'gray800' : 'white'],
              color: colors[variant === 'dark' ? 'white' : 'gray800'],
              borderColor: colors.gray400,
              borderWidth: 1,
              width: '100%',
              padding: 12,
              borderRadius: 8,
            },
          ]}
          placeholderTextColor={colors.gray400}
        />

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={[
            components.buttonCircle,
            layout.fullWidth,
            gutters.marginBottom_24,
            {
              backgroundColor: colors.purple500,
              borderRadius: 10,
              padding: 16,
              alignItems: 'center',
            },
          ]}
        >
          <Text style={[fonts.size_16, fonts.bold, { color: colors.white }]}>
            {t('screen_login.login_button', 'Login')}
          </Text>
        </TouchableOpacity>

        {/* Actions Row */}
        <View
          style={[
            layout.row,
            layout.justifyBetween,
            layout.fullWidth,
            gutters.marginTop_16,
          ]}
        >
          <TouchableOpacity
            onPress={onChangeTheme}
            style={[components.buttonCircle, gutters.marginBottom_16]}
            testID="change-theme-button"
          >
            <IconByVariant
              path="theme"
              stroke={colors[variant === 'dark' ? 'white' : 'purple500']}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleLanguage}
            style={[components.buttonCircle, gutters.marginBottom_16]}
            testID="change-language-button"
          >
            <IconByVariant
              path="language"
              stroke={colors[variant === 'dark' ? 'white' : 'purple500']}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
}

export default LoginScreen;
