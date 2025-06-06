import { h, type VNode } from 'snabbdom';
import type { RunCtrl } from './run/runCtrl';
import { Coords } from 'lib/prefs';
import { Chessground as makeChessground } from '@lichess-org/chessground';

export interface Shape {
  orig: Key;
  dest?: Key;
  color?: string;
}

export type CgMove = {
  orig: Key;
  dest: Key;
};

export default function (ctrl: RunCtrl): VNode {
  return h('div.cg-wrap', {
    hook: {
      insert: vnode => {
        const el = vnode.elm as HTMLElement;
        el.addEventListener('contextmenu', e => e.preventDefault());
        ctrl.setChessground(makeChessground(el, makeConfig(ctrl)));
      },
      destroy: () => ctrl.chessground?.destroy(),
    },
  });
}

const makeConfig = (ctrl: RunCtrl): CgConfig => ({
  fen: '8/8/8/8/8/8/8/8',
  blockTouchScroll: true,
  coordinates: true,
  coordinatesOnSquares: ctrl.pref.coords === Coords.All,
  movable: { free: false, color: undefined, showDests: ctrl.pref.destination },
  drawable: { enabled: false },
  draggable: { enabled: true },
  selectable: { enabled: true },
  addPieceZIndex: ctrl.pref.is3d,
});
