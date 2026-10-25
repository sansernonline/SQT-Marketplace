import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

// ตัด - และช่องว่างออก แล้วเปลี่ยน +66 นำหน้าเป็น 0
export function normalizeThaiMobile(raw: string): string {
  const compact = raw.replace(/[\s-]/g, "");
  return compact.startsWith("+66") ? "0" + compact.slice(3) : compact;
}

// เบอร์มือถือไทย 10 หลัก ขึ้นต้น 06 08 09 · ช่องว่างปล่อยให้ required จัดการ
export function thaiMobileValidator(control: AbstractControl<string>): ValidationErrors | null {
  if (!control.value) return null;
  return /^0[689]\d{8}$/.test(normalizeThaiMobile(control.value)) ? null : { thaiMobile: true };
}

// ฟอร์มสมัครสมาชิก
export class SignupForm {
  form = new FormGroup({
    name: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    phone: new FormControl("", { nonNullable: true, validators: [Validators.required, thaiMobileValidator] }),
  });

  get valid(): boolean {
    return this.form.valid;
  }

  // ข้อมูลที่ส่งไป API ตอนกดสมัคร
  toPayload(): SignupPayload {
    const v = this.form.getRawValue();
    return { name: v.name.trim(), email: v.email.trim(), password: v.password, phone: normalizeThaiMobile(v.phone) };
  }
}
