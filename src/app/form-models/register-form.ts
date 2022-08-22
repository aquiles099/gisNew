import {NgForm,FormControl,FormGroup,Validators,FormBuilder,FormArray } from '@angular/forms';
import { CustomValidators } from '../providers/CustomValidators';


export class RegisterForm {
 
 public form:FormGroup;



constructor(
		    private fb?: FormBuilder
	)
	{


	}

  get passwordMatchError() {


    data=data.MatchValidator('12345','12345');
    return data;
  }

 get model_form_control() {
    return this.form.controls;
  }



  get is_invalid() {
    return this.form.invalid;
  }
  


}
