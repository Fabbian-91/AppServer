import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../../models/usuario.model';
import { userRole } from '../../../shared/enums/enums';

@Component({
  selector: 'app-usuario-form',
  imports: [...MATERIAL_IMPORTS, ReactiveFormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss',
})
export class UsuarioForm implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsuarioForm>);

  data = inject(MAT_DIALOG_DATA) as {
    usuario: Usuario | null;
    isModificar: boolean;
  };

  roles: userRole[] = [];

  form = this.fb.group({
    id: [{ value: this.data.usuario?.id || '', disabled: true }],

    userName: [
      this.data.usuario?.userName || '',
      [Validators.required, Validators.email],
    ],

    password: [
      '',
      this.data.isModificar
        ? [Validators.minLength(6)]
        : [Validators.required, Validators.minLength(6)],
    ],

    role: [
      this.data.usuario?.role || '',
      Validators.required,
    ],

    estado: [
      this.data.usuario?.estado ?? true,
      Validators.required,
    ],
  });

  constructor() {
    if (!this.data.isModificar && this.data.usuario) {
      this.form.disable();
    }
  }

  ngOnInit(): void {
    this.roles = Object.values(userRole);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const payload: any = {
      userName: raw.userName,
      password: raw.password,
      role: raw.role,
      estado: raw.estado,
    };

    if (this.data.isModificar && (!raw.password || raw.password.trim() === '')) {
      delete payload.password;
    }
    this.dialogRef.close(payload);
  }
}