class ContactPage{
    open(){
        return browser.url('/contact');
    }
    get inputName(){
        return $('.contact-name input');
    }
    get inputEmail(){
        return $('.contact-email input');
    }
    get inputPhone(){
        return $('.contact-phone input');
    }
    get txtAreaMessage(){
        return  $('.contact-message textarea');
    }
    get btnSubmit(){
        return $('button[type=submit]');
    }
    get alertEl(){
        return $('[role="alert"]');
    }
    async submitForm(name, email, phone, message){
        await this.inputName.setValue(name);
        await this.inputEmail.setValue(email);
        await this.inputPhone.setValue(phone);
        await this.txtAreaMessage.setValue(message);
        await this.btnSubmit.click();
    }
}
export default new ContactPage();