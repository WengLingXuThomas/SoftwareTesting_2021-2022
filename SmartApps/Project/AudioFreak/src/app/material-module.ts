//Unused  modules
//import { A11yModule } from '@angular/cdk/a11y';
//import { ClipboardModule } from '@angular/cdk/clipboard';
//import { CdkStepperModule } from '@angular/cdk/stepper';
//import { CdkTreeModule } from '@angular/cdk/tree';
import { MatBadgeModule } from '@angular/material/badge';
//import { MatCheckboxModule } from '@angular/material/checkbox';
//import { MatChipsModule } from '@angular/material/chips';
//import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
//import { MatDatepickerModule } from '@angular/material/datepicker';
//import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';

//Possible useable modules
//import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
//import { MatTreeModule } from '@angular/material/tree';
//import { OverlayModule } from '@angular/cdk/overlay';
//import { PortalModule } from '@angular/cdk/portal';
import { MatProgressBarModule } from '@angular/material/progress-bar';



//Alle Materiale modules importeren van de Angular Archive, voor gebruik in de html documenten
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
  exports: [
/*     A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTreeModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule, */

/*    
    MatTreeModule,
    OverlayModule,
    PortalModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatRippleModule,*/
    MatMenuModule,
    MatProgressBarModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    CdkTableModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatDividerModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    DragDropModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ScrollingModule,
    MatExpansionModule,
    MatDialogModule,
    MatStepperModule,
    MatMenuModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatButtonToggleModule,
  ]
})
export class DemoMaterialModule {}
