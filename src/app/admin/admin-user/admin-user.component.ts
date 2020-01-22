import {Component, OnInit} from '@angular/core';
import {IAdminUser, ICreateUpdateAdminUser} from './admin-user.interface';
import {of, from} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CreateUpdateUserComponent} from './create-update-user/create-update-user.component';
import {catchError} from 'rxjs/operators';
import {ModalService} from '../../shared/services/modal.service';
import {ApiService} from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {
  public userList: Array<IAdminUser> = [];
  public displayedColumns: string[] = ['idColumn', 'userNameColumn', 'emailColumn', 'actionsColumn'];

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private modalService: ModalService) {
  }

  ngOnInit() {
    this.apiService.getEntity('AdminUser')
      .subscribe((data: Array<IAdminUser>) => {
          this.userList = data;
        }
      );
  }

  updateHandler(user: ICreateUpdateAdminUser & { id: number }) {
    const dialogRef = this.dialog.open(CreateUpdateUserComponent, {
      width: '450px',
      disableClose: true,
      data: user,
    });

    let newData: IAdminUser;

    dialogRef.afterClosed()
      .pipe(
        mergeMap((data: ICreateUpdateAdminUser & { id: number }) => {
          if (data) {
            const {id, username, email, password, password_confirm} = data;
            newData = ({id, username, email} as IAdminUser);
            return this.apiService.updEntity('AdminUser', {username, email, password, password_confirm}, id);
          }
          return of(null);
        })
      )
      .subscribe(() => {
        if (newData) {
          this.userList = this.userList.map(user => {
            if (user.id === newData.id) {
              return newData;
            }
            return user;
          });
        }
      });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
    });
  }

  openConfirmDialog(user: IAdminUser) {
    const message = `Підтвердіть видалення користувача "${user.username}"`;
    this.modalService.openConfirmModal(message, () => this.delUser(user));
  }

  delUser(user: IAdminUser) {
    this.apiService.delEntity('AdminUser', user.id).subscribe((data: { response?: string; }) => {
      if (data && data.response === 'ok') {
        this.userList = this.userList.filter(existedUser => existedUser.id !== user.id);
      }
    }, (error: any) => {
      this.openSnackBar('Помилка видалення');
    });
  }

  /*   deleteHandler(user: IAdminUser) {
      this.dialogService.openConfirmDialog(user)
      .pipe(
        mergeMap((result: any) => {
          if (result.isCanceled) {
            return of(result);
          }
          return this.adminUserService.deleteUser(result.id);
        }),
        catchError((e: Error) => {
          this.openSnackBar('Помилка видалення');
          return of(null);
        })
      )
      .subscribe((data: { response?: string; isCanceled?: boolean; } | undefined) => {
        if (data && data.isCanceled) {
          return;
        }
        if (data && data.response === 'ok') {
          this.userList = this.userList.filter(existedUser => existedUser.id !== user.id);
        }
      });
    } */
  addAdminHandler() {
    const dialogRef = this.dialog.open(CreateUpdateUserComponent, {
      width: '450px',
      disableClose: true,
    });

    dialogRef.afterClosed()
      .pipe(
        mergeMap((data: ICreateUpdateAdminUser) => {
          if (data) {
            return this.apiService.createEntity('AdminUser', data);
          }
          return of(null);
        }),
        catchError(e => {
          this.openSnackBar('Сталася помилка');
          return of(null);
        })
      )
      .subscribe((newData: IAdminUser) => {
        this.openSnackBar('Збережено');
        if (newData) {
          this.userList = [newData, ...this.userList];
        }
      });
  }
}
