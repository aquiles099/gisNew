import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

//services
import { CompanyService as CRUDService } from '../../../../services/administration/company.service';
import { Model } from '../../../../interfaces/model';
import { ResourceService } from '../../../../shared/services/resource.service';


@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  public form_model: any;
  public model_form_control: any;

  public model: any;



  constructor(
    private _crudService: CRUDService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private __resourceService: ResourceService


  ) {
    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)

      ]),
      municipality_id: new FormControl('', [
        Validators.required
      ]),
      sector: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl('', [
        Validators.required
      ]),
      telephone: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})')
      ]),
      company_id: new FormControl(''),

    }

    );


    this.model_form_control = this.form_model.controls;


  }




  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.model = data.model.data;

      this.form_model.patchValue({
        _method: 'PUT',
        name: this.model.name,
        municipality_id: this.model.municipality_id,
        telephone: this.model.telephone,
        sector: this.model.sector,
        type: this.model.type,
        company_id: this.model.id

      });


  

    });
  }


}
