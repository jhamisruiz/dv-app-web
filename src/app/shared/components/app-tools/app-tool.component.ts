import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { loadCompAction } from '../../../store/app/actions/app.actions';
import { Store } from '@ngrx/store';
import { AppStateStore } from '../../../store/app.state';
import { AppTableService } from '../app-table/app-table.service';
import { Modetype } from '@app/shared/common/interfaces';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { Observable } from 'rxjs';
import { selectLoadingFormSave } from '@store/app/selectors/app.selectors';

@Component({
  selector: 'app-tools',
  templateUrl: './app-tool.component.html',
  styleUrls: ['./app-tool.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class AppToolComponent implements OnInit {

  @Input() isBtnNew = true;

  @Input() isBtnSave = true;
  @Input() saveDisabled = false;

  @Input() isBtnBack = true;
  @Input() ViewMode!: Modetype;

  @Input() set Message(sms: Message[]) {
    if (sms?.length) {
      this.messages = sms;
    }
  }
  messages!: Message[];
  confSms: any;

  @Input() set setMessage(sms: any) {
    if (sms) {
      this.toast(sms);
    }
  }

  @Input() set setConfirm(sms: any) {
    if (sms?.sms) {
      this.confSms = sms;

      this.confirm(sms?.sms);
    }
  }

  @Output() OnClickNew = new EventEmitter<any>();
  @Output() OnClickSave = new EventEmitter<any>();
  @Output() OnClickBack = new EventEmitter<any>();

  btnSave = false;

  items: MenuItem[] = [
    {
      label: 'Update',
      icon: 'pi pi-refresh',
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
    },
  ];

  loading$: Observable<any> = new Observable();
  constructor(private store: Store<AppStateStore>,
    private confirmationService: ConfirmationService,
    private messageService: MessageService, private ts: AppTableService) {

    this.ts.changeState$.subscribe((r: boolean) => {
      this.btnSave = r ? false : true;
    });

    this.loading$ = this.store.select(selectLoadingFormSave);
  }

  ngOnInit(): void {
    if (1) { }
  }

  onClickNew(): void {
    this.store.dispatch(loadCompAction({ formMode: 'CREATE', id: null }));
    this.OnClickNew.emit('CREATE');
  }

  onClickSave(): void {
    this.OnClickSave.emit();
  }

  onClickBack(): void {
    this.store.dispatch(loadCompAction({ formMode: 'VIEW', id: null }));
    this.OnClickBack.emit('VIEW');
  }

  toast(s: string): void {
    this.messageService.add({ severity: 'warning', summary: 'Warning', detail: s });
  }

  confirm(sms: string): void {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `${sms}`,
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-danger p-button-sm ',
      acceptButtonStyleClass: 'p-button-sm p-button-success',
      accept: () => {
      },
      reject: () => {
      },
    });
  }

  iconClass(severity: string): string {
    switch (severity) {
      case 'info':
        return 'pi pi-info-circle';
      case 'warn':
        return 'pi pi-exclamation-triangle';
      case 'error':
        return 'pi pi-times';
      default:
        return '';
    }
  }
}
