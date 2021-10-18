const path = require('path');

describe('Upload Tests', () => {
    it('Simple upload test', async () => {
        
        //Open URL
        await browser.url('https://the-internet.herokuapp.com/upload')

        // store test file path
        const filePath = path.join(__dirname, '../data/logo.png');

        //upload test file
        const remoteFilePath = await browser.uploadFile(filePath);

        // set file path value in the input field
        await $('#file-upload').setValue(remoteFilePath);

        await $('#file-submit').click(); // click the submit button


        // assertion 
        await expect($('h3')).toHaveText('File Uploaded!');

    });

    it.only('Upload on a hidden input field', async () => {
        //Open url
         await browser.url('https://practice.automationbro.com/cart/')

        // store test file path
        const filePath = path.join(__dirname, '../data/logo.png');

        //upload test file
        const remoteFilePath = await browser.uploadFile(filePath);

        //Remove hidden class
        await browser.execute("document.querySelector('#upfile_1').className = ''")

        // set file path value in the input field
        await $('#upfile_1').setValue(remoteFilePath);

        await $('#upload_1').click(); // click the submit button
        
        await browser.pause(1500);
        // assertion 
        await expect($('#wfu_messageblock_header_1_label_1')).toHaveTextContaining('uploaded successfully');
    })
});

