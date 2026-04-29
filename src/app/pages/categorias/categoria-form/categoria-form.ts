import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { Categoria } from '../../../models/categoria.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-categoria-form',
  imports: [...MATERIAL_IMPORTS, ReactiveFormsModule],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.scss',
})
export class CategoriaForm {
  private fb = inject(FormBuilder);

  private dialogRef = inject(MatDialogRef<CategoriaForm>);
  //Recibir datos del componente
  data = inject(MAT_DIALOG_DATA) as { categoria: Categoria | null, isModificar: boolean }

  form = this.fb.group({
    id: [{ value: this.data.categoria?.id || '', disabled: this.data.isModificar }],
    nombre: [
      this.data.categoria?.nombre || '',
      [Validators.required, Validators.minLength(3)]
    ],
    descripcion: [
      this.data.categoria?.descripcion || '',
      [Validators.maxLength(500)]
    ]
  });

  constructor() {
    if (!this.data.isModificar && this.data.categoria) {
      this.form.disable();
    }
  }

  /*  guardar():void{
     if (this.form.valid) {
       //Optengo la categoria con as y la guardo en una variable
       const categoriaData=this.form.getRawValue() as Categoria;
       this.dialogRef.close(categoriaData);
     }
     
   } */

  guardar(): void {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
        this.dialogRef.close({
          nombre: raw.nombre,
          descripcion: raw.descripcion
        });
    }
  }

}
