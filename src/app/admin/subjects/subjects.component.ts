import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatSnackBar, MatPaginator } from '@angular/material';
import { SubjectsCreateModalComponent } from './subjects-create-modal/subjects-create-modal.component';
import { Subject } from 'src/app/admin/entity.interface';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { SubjectConfirmComponent } from './subject-confirm/subject-confirm.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {

  public displayedColumns: string[] = ['subject_number', /*'subject_id',*/ 'subject_name', 'subject_description', 'subject_menu'];
  public dataSource = new MatTableDataSource<Subject>();
  public loading = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private route: Router,
  ) {  }

  ngOnInit(): void  {
    this.showSubjects();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showSubjects() {
    this.loading = true;
    this.apiService.getEntity('Subject')
    .subscribe(response => {
      this.dataSource.data = response;
      this.loading = false;
    });
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  createNewSubject() {
    const newDialogSubject = this.dialog.open(SubjectsCreateModalComponent, {
      width: '500px',
    });
    newDialogSubject.afterClosed()
      .pipe(
        mergeMap((data) => {
          if (data) {
            return this.apiService.createEntity('Subject', data);
          }
          return of(null);
        })
      )
      .subscribe((newData: Subject[] | null) => {
        if (newData) {
          this.dataSource.data = [...this.dataSource.data, newData[0]];
          this.openSnackBar('Предмет було створено.', 'Закрити');
      }},
        err => {
          this.openSnackBar('Такий предмет уже існує', 'Закрити');
        }
      );
  }

  edit(row: Subject): void {
    const newDialogSubject = this.dialog.open(SubjectsCreateModalComponent, {
      width: '500px',
      data: row,
    });
    newDialogSubject.afterClosed()
      .pipe(
        mergeMap((data) => {
          if (data) {
            return this.apiService.updEntity('subject', data, row.subject_id);
          }
          return of(null);
        })
      )
      .subscribe((newData: Subject[] | null) => {
        if (newData) {
          this.showSubjects();
          this.openSnackBar('Предмет відредаговано.', 'Закрити');
        }},
        err => {
          this.openSnackBar('Такий предмет уже існує', 'Закрити');
        }
      );
  }

  delete(row: Subject): void {
    const dialogData = `Ви видаляєте ${row.subject_name}, ви впевнені?`;
    const dialogRef = this.dialog.open(SubjectConfirmComponent, {
      maxWidth: '400px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      const result = dialogResult;
      if (result) {
        this.delSubject(row.subject_id);
      }
    });
  }

  delSubject(id: number) {
    this.apiService.delEntity('Subject', id)
      .subscribe((response) => {
        this.dataSource.data = this.dataSource.data.filter(item => item.subject_id !== id);
        this.openSnackBar('Предмет видалено.', 'Закрити');
      },
        err => {
          this.openSnackBar('На сервері присутні дані цього предмету.', 'Закрити');
        }
      );
  }

  navigateToTimeTable(subject_id) {
    this.route.navigate(['admin/timeTable'], { queryParams: {id: subject_id}});
  }

  navigateToTests(subject_id) {
    this.route.navigate(['admin/tests'], { queryParams: {id: subject_id}});
  }
}
