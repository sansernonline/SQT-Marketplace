import { FormControl, FormGroup, Validators } from "@angular/forms";

// ฟอร์มสมัครสมาชิก
export class SignupForm {
  form: any = new FormGroup({
    name: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });

  get valid(): boolean {
    return this.form.valid;
  }

  // ข้อมูลที่ส่งไป API ตอนกดสมัคร
  toPayload(): any {
    const v = this.form.getRawValue();
    return { name: v.name.trim(), email: v.email.trim(), password: v.password };
  }
}
