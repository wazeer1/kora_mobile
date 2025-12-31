// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Existing
  'house.fill': 'home',
  'house': 'home', // Added for Android fallback
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'chevron.down': 'keyboard-arrow-down',
  'lock.fill': 'lock',
  'clock.arrow.circlepath': 'schedule',
  'flame.fill': 'local-fire-department',
  'magnifyingglass': 'search',
  'qrcode': 'qr-code',
  'arrow.up.right': 'arrow-outward',
  'hand.raised.fill': 'back-hand',
  'pause.fill': 'pause',
  'captions.bubble.fill': 'closed-caption',
  'line.3.horizontal.decrease': 'filter-list',
  'arrow.up': 'arrow-upward',
  'chevron.right.2': 'keyboard-double-arrow-right',
  'person.fill': 'person',
  'person.circle': 'account-circle', // Added for Android fallback
  'person.circle.fill': 'account-circle', // Added for Android fallback
  'person.3.fill': 'groups',
  'plus': 'add',
  'link': 'link',
  'antenna.radiowaves.left.and.right': 'settings-input-antenna',
  'calendar': 'calendar-today',
  'arrow.up.circle': 'arrow-circle-up',
  'pencil.and.outline': 'edit',
  'xmark': 'close',
  'info.circle': 'info',
  'stop.circle': 'stop-circle',
  'trophy.fill': 'emoji-events',
  'sparkles': 'auto-awesome',
  'bell.fill': 'notifications',
  'bell': 'notifications-none', // Added for Android fallback
  'circle.fill': 'circle',
  'checkmark.circle.fill': 'check-circle',
  'circle': 'radio-button-unchecked',
  'gear': 'settings',

  // Added for Launch Experience & War Ground
  'hexagon.fill': 'hexagon',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'door.right.hand.open': 'login',
  'arrow.right': 'arrow-forward',
  'mic.fill': 'mic',
  'crown.fill': 'workspace-premium',
  'xmark.circle.fill': 'cancel',
  'flag.fill': 'flag',
  'power': 'power-settings-new',
  'slider.horizontal.3': 'tune',
  'heart.fill': 'favorite',
  'apple.logo': 'smartphone', // Fallback
  'g.circle.fill': 'public', // Fallback
  'exclamationmark.triangle.fill': 'warning',
  'eye.fill': 'visibility',
  'cross.vial': 'science', // Fallback for sword?
  'shield.fill': 'security',
  'headphones': 'headset',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
