import {NgForm,FormControl,FormGroup,Validators,FormBuilder,FormArray } from '@angular/forms';


export class UserForm {
 
 public form:FormGroup;



constructor(
		    private fb?: FormBuilder
	)
	{

     this.form = this.fb.group({
      _method:new FormControl('POST'),
      first_name:new FormControl('',Validators.required),
      last_name:new FormControl('',Validators.required),
      company_name: new FormControl('',Validators.required),
      email: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
      password_confirmation: new FormControl('',Validators.required),
      telephone: new FormControl('',Validators.required),
      sector: new FormControl('',Validators.required),
      type: new FormControl('',Validators.required),
      user_id:null

    });

	}



 get model_form_control() {
    return this.form.controls;
  }



  get is_invalid() {
    return this.form.invalid;
  }
  


}
