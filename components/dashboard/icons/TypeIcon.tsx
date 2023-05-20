import React from 'react';
import BraceletIcon from './Bracelet';
import EarringIcon from './EarringIcon';
import TagIcon from './TagIcon';
import GroupIcon from './GroupIcon';
import RingIcon from './RingIcon';
import NecklaceIcon from '../NecklaceIcon';

const ICON_CLASS = 'w-3 h-3 fill-zinc-400';

export default function TypeIcon({ id }: { id: number }) {
  function getIcon() {
    switch (id) {
      case 2:
        return <BraceletIcon className={ICON_CLASS} />;
      case 3:
        return <EarringIcon className={ICON_CLASS} />;
      case 4:
        return <TagIcon className={ICON_CLASS} />;
      case 5:
        return <GroupIcon className={ICON_CLASS} />;
      case 6:
        return <RingIcon className={ICON_CLASS} />;
      case 7:
        return <NecklaceIcon className={ICON_CLASS} />;
      default:
        return null;
    }
  }

  return (
    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
      {getIcon()}
    </div>
  );
}
