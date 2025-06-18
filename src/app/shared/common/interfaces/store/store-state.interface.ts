
import { RouterReducerState } from '@ngrx/router-store';
/* import { AppState } from '../../../../store/state/app-state.interface'; */
import { CacheState } from './cache-state.interface';
import { ReportState } from './report-state.interface';
import { WinTabState } from './wintab.state.interface';
import { UserStoreState } from './user.state';
import { CompanyStoreState } from './company.state';

export interface AppState {
  languages: string[];
  currentLanguage: string;
  currentTheme: string;
  news: any[];
  socialNetworks: any[];
  corporations: any[];
  coins: number;
  allCoins: any[];
  updateFlow: any;
  loading: boolean;
  editTable: number;
  codes: any[];
  privileges: any[];
}

export interface AppStore {
  app: AppState;
  router: RouterReducerState;
  winTabs: WinTabState;
  user: UserStoreState;
  company: CompanyStoreState;

  report: ReportState;
  cache: CacheState;
}
