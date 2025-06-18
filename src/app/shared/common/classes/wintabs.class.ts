import { WindowsTab, tabId, WTab, ComponentModeType, ComponentMode } from '../interfaces';
import { WinTabDir } from '../enums';
import { DocumentLayout } from '../decorators/document.decorator';
//import { SweetAlertService } from '@app/shared/services/util-services/sweet-alert.service';

export interface WintabOptions {
  /** Titulo personalizado del tab */
  title?: string;
  /** Icono personalizado del tab */
  icon?: string;
  /** Estado del tab */
  enabled?: boolean;
  /** Permite solo una instancia por componente */
  unique?: boolean;
  /** Data incial del row */
  data?: any;
  /** Identitifcador unico del tab */
  id?: tabId;
  /** Modo que se muestra el tab */
  mode?: ComponentModeType;
  /** Slot donde se muestra el tab */
  dir?: WinTabDir;
  /** Id del la ventana padre original. */
  windowId?: string;
  /** Id del componente que se va a pintar. */
  componentId?: string;
  /** Componente que se va a pintar. */
  component?: unknown;
}

export const initialOptions: WintabOptions = {
  enabled: true,
  mode: ComponentMode.CREATE,
  dir: WinTabDir.LEFT,
};

/**
 * Gestion de ventanas internas.
 */
export class WinTab {
  /** Mapa de ventanas */
  private windowsTabs: { [key: string]: WindowsTab };
  /** Número de actualizaciones de ventana o tabs. */
  private updateWinTab = 0;
  private al: any = '';
  constructor(state: any) {
    // Set data from state
    this.updateWinTab = state.updateWinTab;
    this.windowsTabs = state.winTab ?? {};
    //this.al = new SweetAlertService();
  }

  /**
   * Verificar si la ventana actual tiene tabs
   *
   * @param wid Id de la ventana
   */
  hasTabs(wid: string): boolean {
    return !!this.windowTabs(wid).length;
  }

  /**
   * Obtiene los tabs de una ventana.
   *
   * @param wid Id de la ventana
   */
  windowTabs(wid: string, dir?: WinTabDir): WTab[] {
    const tabs = this.windowsTabs[wid]?.tabs ?? [];
    return tabs.filter(tab => undefined === dir || dir === tab.dir);
  }

  /**
   * Obtiene la ventana actual
   *
   * @param wid Id de la ventana
   */
  getWindow(wid: string): WindowsTab {
    return this.windowsTabs[wid];
  }

  /**
   * Obtiene un tab de una ventana
   *
   * @param wid Id de la ventana
   * @param tid Id del tab
   */
  getTab(wid: string, tid: tabId): WTab | undefined {
    return this.windowTabs(wid).find(tab => tab.id === tid);
  }

  /** Obtiene la ventana activa. */
  get activeWindow(): WindowsTab | undefined {
    for (const id in this.windowsTabs) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.windowsTabs.hasOwnProperty(id) && this.windowsTabs[id].active) {
        return this.windowsTabs[id];
      }
    }

    return;
  }
  /**
   * Verificar si una ventana existe.
   *
   * @param wid Id de la ventana
   */
  windowExists(wid: string): boolean {
    return wid in this.windowsTabs;
  }

  /**
   * Verifica si un tab existe en una vetana
   *
   * @param wid Id de la ventana
   * @param tid Id del tab
   */
  tabExists(wid: string, tid: tabId): boolean {
    return this.windowTabs(wid).some(tab => tab.id === tid);
  }

  /**
   * Registrar una nueva ventana
   *
   * @param wid Id de la ventana
   * @param title Titutlo de la ventana
   * @param icon Icono de la ventana
   */
  registerWindow(wid: string, url: string, type: DocumentLayout | undefined, title: string, icon: string): void {
    const reg = /\?.+/;
    const cleanUrl = url.replace(reg, '');
    this.windowsTabs[wid] = {
      id: wid,
      active: true,
      title,
      icon,
      tabs: [],
      url: cleanUrl,
      type: type ?? DocumentLayout.BASIC,
    };
  }

  unregisterWindow(wid: string): void {
    this.removeAllTabs(wid);
    delete this.windowsTabs[wid];
  }

  updateWindow(wid: string, title: string, icon: string): void {
    if (this.windowExists(wid)) {
      const w = this.getWindow(wid);
      this.windowsTabs[wid] = {
        ...w,
        title: title || w.title,
        icon: icon || w.icon,
      };
    }
  }

  resetWindowStatus(status = false): void {
    for (const k of Object.keys(this.windowsTabs)) {
      const w = this.windowsTabs[k];
      this.updateWindowStatus(w.id, status);
    }
  }

  updateWindowStatus(wid: string, status: boolean): void {
    if (this.windowExists(wid)) {
      this.windowsTabs[wid] = {
        ...this.windowsTabs[wid],
        active: status,
      };
    }
  }

  addTab(wid: string, cid: string, options: WintabOptions = initialOptions): void {
    if (this.windowExists(wid)) {
      if (null === options.id || undefined === options.id) {
        options.id = Math.random().toString(16).slice(5, -4);
      }

      const tabExists = this.tabExists(wid, options.id);

      if (tabExists) {
        const tab = this.getTab(wid, options.id);
        if (ComponentMode.PREVIEW === tab?.mode && (ComponentMode.VIEW === options.mode || ComponentMode.EDIT === options.mode)) {
          this.updateTabMode(wid, options.id, options.mode);
        }
      }

      if (!tabExists) {
        if ('function' === typeof options.data) {
          options.data = options.data();
        }

        options.enabled ??= true;

        if (options.unique) {
          options.id = options.id + wid;
        }

        const wTab = this.getWindow(wid);

        wTab.tabs ||= [];

        // FIXME: Remover por uso doble en el reducer
        this.resetActiveTabs(wid, wTab.type === DocumentLayout.TREE ? WinTabDir.RIGHT : WinTabDir.LEFT);

        if (ComponentMode.PREVIEW === options.mode) {
          wTab.tabs = wTab.tabs.filter(tb => ComponentMode.PREVIEW !== tb.mode);
        }

        // Reset tabs...
        // TODO: Añadir soporte para identificar el modulo del tab.
        const tab: WTab = {
          active: true,
          icon: options.icon || this.getIconFromMode(options?.mode ?? 'PREVIEW'),
          title: options.title || wTab.title,
          id: options.id,
          data: options.data,
          dir: wTab.type === DocumentLayout.TREE ? WinTabDir.RIGHT : options.dir || WinTabDir.LEFT,
          componentId: cid || wid,
          order: this.getTabOrder(wid, wTab.type === DocumentLayout.TREE ? WinTabDir.RIGHT : WinTabDir.LEFT),
          enabled: options.enabled,
          mode: options?.mode ?? ComponentMode.PREVIEW,
          windowId: '', // TODO: Identificar al modulo que pertenece.
        };

        wTab.tabs.push(tab);
      }

      this.setTabStatus(wid, options.id, true);
    }
  }

  getTabOrder(wid: string, dir: WinTabDir): number {
    return this.windowTabs(wid, dir).length;
  }

  sortTabs(wid: string, dir: WinTabDir | undefined): void {
    if (this.hasTabs(wid)) {
      this.windowsTabs[wid].tabs = [].concat(
        this.windowTabs(wid).filter(tb => tb.dir !== dir) as any,
        this.windowTabs(wid, dir).sort((a, b) => a.order - b.order) as any,
      );
    }
  }

  /**
   * Restablece el valor del estado activo a todos los tabs de una ventana
   *
   * @param wid Id de la ventana
   * @param status Estado
   */
  resetActiveTabs(wid: string, dir?: WinTabDir): void {
    this.windowTabs(wid).forEach(tab => {
      tab.active = dir !== undefined ? ((undefined === tab.dir ? dir === WinTabDir.LEFT : dir === tab.dir) ? !1 : tab.active) : !1;
    });
  }

  /**
   * Eliminar un tab de una ventana
   *
   * @param wid Id de la ventana
   * @param tid Id del Tab
   */
  deleteTab(wid: string, tid: tabId): void {
    if (this.windowExists(wid) && this.tabExists(wid, tid)) {
      const tab = this.getTab(wid, tid);
      const fromDir = tab?.dir;
      const tabs: WTab[] = this.windowTabs(wid);

      this.setNextTabActive(wid, tid);
      this.windowsTabs[wid].tabs = tabs.filter(e => e.id !== tid);
      this.sortTabs(wid, fromDir);
    }
  }
  /**
   * Cierra los tabs de alguna posición y deja los tabs en modo creación
   *
   * @param wid Id de la ventana
   * @param dir Dirección de los tabs
   */
  removeAllTabs(wid: string, dir?: WinTabDir): void {
    this.windowTabs(wid, dir).forEach(tab => {
      if (tab.mode !== ComponentMode.CREATE) {
        this.deleteTab(wid, tab.id);
      }
    });
  }

  setTabStatus(wid: string, tid: tabId, status: boolean): void {
    if (this.hasTabs(wid)) {
      const ctab = this.getTab(wid, tid);
      this.windowTabs(wid).forEach(tab => {
        tab.active = tid === tab.id ? status : (undefined === tab.dir || ctab?.dir === tab.dir ? false : tab.active);
      });
    }
  }

  moveTab(wid: string, tid: tabId, dir: WinTabDir, index: number): void {
    if (this.tabExists(wid, tid)) {
      const tab = this.getTab(wid, tid);

      const currentIsActive = tab?.active;
      const currentOrder = tab?.order ?? 0;
      const currentDir = tab?.dir ?? WinTabDir.LEFT;

      const order = Math.max(0, index);
      const moveToLeft = order < currentOrder;
      const moveToRight = order > currentOrder;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.windowTabs(wid).forEach((tb, i) => {
        tb.dir = tid === tb.id ? dir : tb.dir;
        tb.order = tid === tb.id ? order : tb.order;

        if (dir === tb.dir && currentDir !== dir) {
          tb.active = tid === tb.id;
        }

        if (currentDir !== dir && dir === tb.dir && tid !== tb.id) {
          tb.order = tb.order >= order ? tb.order + 1 : tb.order;
        }

        if (currentDir === dir && dir === tb.dir && tid !== tb.id) {
          tb.order = moveToLeft && tb.order >= order && tb.order < currentOrder ? tb.order + 1 : (
            moveToRight && tb.order <= order && tb.order > currentOrder ? tb.order - 1 : tb.order
          );
        }
      });

      this.sortTabs(wid, currentDir);

      if (currentDir !== dir) {
        this.sortTabs(wid, dir);
      }

      // Set next active from order.
      if (currentIsActive && currentDir !== dir) {
        const tabs = this.windowTabs(wid, currentDir);
        const lastTab = tabs[tabs.length - 1];
        !!lastTab && this.setTabStatus(wid, lastTab?.id, true);
      }


    }
  }

  setNextTabActive(wid: string, tid: tabId): void {
    const tabs = this.windowTabs(wid);
    if (!tabs.some(tab => tab.active)) {
      const lastTab = tabs[tabs.length - 1];
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!lastTab) {
        return this.setTabStatus(wid, lastTab.id, true);
      }
    }

    if (this.hasActiveTab(wid, tid)) {
      const index = tabs.findIndex(tab => tab.id === tid);
      // eslint-disable-next-line no-extra-boolean-cast
      const nextIndex = !!tabs[index + 1] ? index + 1 : !!tabs[index - 1] ? index - 1 : 0;
      if (-1 !== nextIndex && tabs[nextIndex]) {
        this.setTabStatus(wid, tabs[nextIndex].id, true);
      }
    }
  }

  hasActiveTab(wid: string, tid: tabId): boolean {
    return this.tabExists(wid, tid) && !!this.getTab(wid, tid)?.active;
  }

  saveTabState(wid: string, tid: tabId, state: any): void {
    if (this.tabExists(wid, tid)) {
      this.windowTabs(wid).forEach(tab => {
        if (tid === tab.id) {
          tab.state = Object.assign({}, tab.state, state);
        }
      });
    }
  }

  updateTabMode(wid: string, tid: tabId, mode: ComponentModeType): void {
    if (this.tabExists(wid, tid)) {
      const tab = this.getTab(wid, tid);
      if (undefined !== tab) {
        tab.mode = mode;
        tab.icon = this.getIconFromMode(mode);
      }
    }
  }

  updateTab(wid: string, tid: tabId, data: Partial<WTab>): void {
    this.windowTabs(wid).forEach(tab => {
      if (tab.id === tid) {
        // Merge properties..
        Object.assign(tab, data);
        // Set aditional properties
        tab.icon = this.getIconFromMode(tab.mode);
      }
    });
  }

  update(): { winTab: { [key: string]: WindowsTab }; updateWinTab: number } {
    return {
      winTab: this.windowsTabs,
      updateWinTab: this.updateWinTab + 1,
    };
  }

  private getIconFromMode(mode: ComponentModeType): string {
    return mode === ComponentMode.CREATE ? 'fas fa-file' :
      ComponentMode.VIEW === mode ? 'fas fa-hashtag' : 'fas fa-hashtag';
  }

}
