import cn from '@utils/classNames';
import React, { cloneElement, useEffect, useId, useRef, useState } from 'react';

import styles from './Tooltip.module.scss';

export const Tooltip = ({
  children,
  content,
  position = 'top',
  showDelay = 80,
  hideDelay = 80,
  disabled = false,
  className,
}) => {
  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const tooltipId = useId();
  const hostRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(showTimerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!children || disabled) return children;

  const show = () => {
    clearTimeout(hideTimerRef.current);
    showTimerRef.current = setTimeout(() => setVisible(true), showDelay);
  };

  const hide = () => {
    clearTimeout(showTimerRef.current);
    hideTimerRef.current = setTimeout(() => setVisible(false), hideDelay);
  };

  const child = cloneElement(children, {
    ref: hostRef,
    'aria-describedby': tooltipId,
    onMouseEnter: (e) => {
      children.props.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e) => {
      children.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e) => {
      children.props.onFocus?.(e);
      show();
    },
    onBlur: (e) => {
      children.props.onBlur?.(e);
      hide();
    },
  });

  return (
    <span className={cn(styles.wrapper, className)}>
      {child}
      {visible && (
        <span id={tooltipId} role="tooltip" className={cn(styles.tooltip, styles[position])}>
          {content}
        </span>
      )}
    </span>
  );
};
