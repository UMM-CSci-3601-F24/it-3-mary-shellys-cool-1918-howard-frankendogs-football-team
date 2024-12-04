import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [],
    standalone: true,
    imports: [
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        RouterLink,
        MatIcon,
        MatSnackBarModule,
    ],
})
export class HomeComponent {
    roomForm: FormGroup;
    createdRoomId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private clipboard: Clipboard,
        public snackBar: MatSnackBar
    ) {
        this.roomForm = this.fb.group({
            name: ['']
        });
    }
z
    createRoom() {
        const roomData = this.roomForm.value;

        if (roomData.name !== '' && roomData.name !== null && roomData.name !== undefined) {
            this.http.post<{ id: string }>('/api/rooms', roomData).subscribe(response => {
                this.createdRoomId = response.id;
            });
        } else {
            this.snackBar.open('Rooms need a non-empty name', 'Ok', { duration: 3000 });
        }
    }

    copyLink() {
        if (this.createdRoomId) {
            const link = `${window.location.origin}/${this.createdRoomId}/grids`;
            this.clipboard.copy(link);
        }
    }
}
