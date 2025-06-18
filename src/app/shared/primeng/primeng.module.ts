import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TreeModule } from 'primeng/tree';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeTableModule } from 'primeng/treetable';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageService, SharedModule } from 'primeng/api';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ListboxModule } from 'primeng/listbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldsetModule } from 'primeng/fieldset';
import { ChipsModule } from 'primeng/chips';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { ContextMenuModule } from 'primeng/contextmenu';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { MeterGroupModule } from 'primeng/metergroup';
import { ProgressBarModule } from 'primeng/progressbar';
import { StepperModule } from 'primeng/stepper';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SelectButtonModule } from 'primeng/selectbutton';
@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    ChipsModule,
    ListboxModule,
    AvatarGroupModule,
    AvatarModule,
    SkeletonModule,
    TreeSelectModule,
    MultiSelectModule,
    TableModule,
    MessageModule,
    MessagesModule,
    SharedModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    TabMenuModule,
    TabViewModule,
    TreeModule,
    TreeTableModule,
    DropdownModule,
    AutoCompleteModule,
    RadioButtonModule,
    ColorPickerModule,
    ToastModule,
    InputMaskModule,
    AccordionModule,
    InputNumberModule,
    FieldsetModule,
    CardModule,
    PaginatorModule,
    ProgressSpinnerModule,
    CalendarModule,
    InputSwitchModule,
    DividerModule,
    ContextMenuModule,
    CascadeSelectModule,
    OverlayPanelModule,
    ImageModule,
    GalleriaModule,
    CarouselModule,
    SidebarModule,
    ConfirmDialogModule,
    BadgeModule,
    ChipModule,
    ToolbarModule,
    TagModule,
    RatingModule,
    MeterGroupModule,
    ProgressBarModule,
    StepperModule,
    PanelModule,
    InputTextModule,
    InputTextareaModule,
    FloatLabelModule,
    InputIconModule,
    IconFieldModule,
    SelectButtonModule,
  ],
  providers: [MessageService, { provide: LOCALE_ID, useValue: 'es' }],
})
export class AppPrimengModule { }
