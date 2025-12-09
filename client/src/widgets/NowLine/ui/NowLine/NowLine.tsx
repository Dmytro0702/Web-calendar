
import React, { useEffect, useState } from 'react';

import s from './NowLine.module.scss';

type NowLineProps = {
  visible: boolean;
};

/**
 * 60px = 1 час, 1px = 1 минута.
 * Линия позиционируется относительно начала дня (00:00).
 */
function getMinutesFromMidnight(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export const NowLine: React.FC<NowLineProps> = ({ visible }) => {
  const [top, setTop] = useState<number>(() => getMinutesFromMidnight());

  useEffect(() => {
    if (!visible) return undefined;

    const update = () => setTop(getMinutesFromMidnight());

    update();
    const id = setInterval(update, 60_000);

    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return <div className={s.now} style={{ top: `${top}px` }} aria-hidden />;
};
