import { h, type VNode } from 'snabbdom';
import { type Toggle, myUserId, onClickAway } from '@/common';
import { bindMobileMousedown } from '@/device';
import * as licon from '@/licon';
import { type MaybeVNode, type MaybeVNodes, dataIcon, onInsert } from '@/snabbdom';
import { type ToggleSettings, toggle } from '@/view/controls';
import { pubsub } from '@/pubsub';

export const toggleButton = (toggle: Toggle, title: string): VNode =>
  h('button.fbt.board-menu-toggle', {
    class: { active: toggle() },
    attrs: { title, 'data-icon': licon.Hamburger },
    hook: onInsert(bindMobileMousedown(toggle.toggle)),
  });

export const boardMenu = (
  redraw: Redraw,
  toggle: Toggle,
  content: (menu: BoardMenu) => MaybeVNodes,
): MaybeVNode =>
  toggle()
    ? h(
        'div.board-menu',
        { hook: onInsert(onClickAway(() => toggle(false))) },
        content(new BoardMenu(redraw)),
      )
    : undefined;

export class BoardMenu {
  anonymous: boolean = !myUserId();

  constructor(readonly redraw: Redraw) {}

  flip = (name: string, active: boolean, onChange: () => void): VNode =>
    h(
      'button.button.text',
      {
        class: { active },
        attrs: { title: 'Hotkey: f', ...dataIcon(licon.ChasingArrows) },
        hook: onInsert(bindMobileMousedown(onChange)),
      },
      name,
    );

  zenMode = (enabled = true): VNode =>
    this.cmnToggle({
      name: i18n.preferences.zenMode,
      id: 'zen',
      checked: $('body').hasClass('zen'),
      change: () => pubsub.emit('zen'),
      disabled: !enabled,
    });

  voiceInput = (toggle: Toggle, enabled = true): VNode =>
    this.cmnToggle({
      name: i18n.preferences.inputMovesWithVoice,
      id: 'voice',
      checked: toggle(),
      change: toggle,
      title: this.anonymous ? 'Must be logged in' : '',
      disabled: this.anonymous || !enabled,
    });

  keyboardInput = (toggle: Toggle, enabled = true): VNode =>
    this.cmnToggle({
      name: i18n.preferences.inputMovesWithTheKeyboard,
      id: 'keyboard',
      checked: toggle(),
      change: toggle,
      title: this.anonymous ? 'Must be logged in' : '',
      disabled: this.anonymous || !enabled,
    });

  blindfold = (toggle: Toggle, enabled = true): VNode =>
    this.cmnToggle({
      name: i18n.preferences.blindfold,
      id: 'blindfold',
      checked: toggle(),
      change: toggle,
      disabled: !enabled,
    });

  confirmMove = (toggle: Toggle, enabled = true): VNode =>
    this.cmnToggle({
      name: i18n.preferences.moveConfirmation,
      id: 'confirmmove',
      checked: toggle(),
      change: toggle,
      disabled: !enabled,
    });

  private cmnToggle = (t: ToggleSettings) => toggle(t, this.redraw);
}
