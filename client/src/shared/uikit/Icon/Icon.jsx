import * as Icons from '@assets/icons';
import { classNames as cn } from '@utils/classNames';
import React from 'react';

import styles from './Icon.module.scss';

export const REGISTRY = {
  // базовые
  default: Icons.IconDefault,
  info: Icons.IconInfo,
  success: Icons.IconSuccess,
  close: Icons.IconClose,
  check: Icons.IconCheck,
  eye: Icons.IconEye,
  'eye-close-line': Icons.IconEyeCloseLine,

  // навигационные
  'chevron-down': Icons.IconChevronDown,
  'chevron-up': Icons.IconChevronUp,
  'chevron-left': Icons.IconChevronLeft,
  'chevron-right': Icons.IconChevronRight,
  'down-small': Icons.IconDownSmall,

  // прочие
  cart: Icons.IconCart,
  trash: Icons.IconTrash,
  user: Icons.IconUser,
  google: Icons.IconGoogle,
  play: Icons.IconPlay,
  pause: Icons.IconPause,
  plus: Icons.IconPlus,
  minus: Icons.IconMinus,
  truck: Icons.IconTruck,
  color: Icons.IconColor,
  'color-selected': Icons.IconColorSelected,
};

// ДОПОЛНИТЕЛЬНО: поддерживаем “react-имена”, которые пишем в TS-коде
// например: <Icon name="IconChevronLeft" />
REGISTRY.IconChevronLeft = Icons.IconChevronLeft;
REGISTRY.IconChevronRight = Icons.IconChevronRight;
REGISTRY.IconChevronDown = Icons.IconChevronDown;
REGISTRY.IconChevronUp = Icons.IconChevronUp;
REGISTRY.IconClose = Icons.IconClose;
REGISTRY.IconCheck = Icons.IconCheck;
REGISTRY.IconDelete = Icons.IconTrash; // в макете “delete” → это trash
REGISTRY.IconGoogle = Icons.IconGoogle;
REGISTRY.IconUser = Icons.IconUser;
REGISTRY.IconLogout = Icons.IconLogout ? Icons.IconLogout : Icons.IconDefault;
REGISTRY.IconColor = Icons.IconColor;
REGISTRY.IconColorSelected = Icons.IconColorSelected;

export const ICON_KEYS = Object.keys(REGISTRY);

export const Icon = ({ name = 'default', className, title, ...rest }) => {
  const Cmp = REGISTRY[name] || REGISTRY.default;
  return <Cmp className={cn(styles.icon, className)} title={title} {...rest} />;
};
