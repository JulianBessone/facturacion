const xlsx = require ('xlsx');
const puppeteer = require ('puppeteer');

/* DECLARAMOS UN ARRAY CON LOS NUMEROS DE ORDENES Y OTRO CON LOS TRACKINGS */

const excelNumberOrder = [];
const excelTrackingNumber = [];

/* DECLARAMOS EL EXCEL A LEER */

const leerExcel = () => {
    const pathTracking = `./excels/trackings1.xlsx`;
    const workbook = xlsx.readFile(pathTracking);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];

    /* TRANSFORMAMOS LAS TABLAS A UN ARCHIVO TIPO .JSON */

    const dataExcel = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);

    /* ITERAMOS LOS ELEMENTOS DEL ATRIBUTO NUMBER ORDER Y LOS ENVIAMOS AL ARREGLO PARA ALMACENARLO */

    for (const orders of dataExcel){

        excelNumberOrder.push(orders['Number Order'])
    }

    /* ITERAMOS LOS ELEMENTOS DEL ATRIBUTO TRACKING Y LOS ENVIAMOS AL ARREGLO PARA ALMACENARLO */

    for (const orders of dataExcel){
        
        excelTrackingNumber.push(orders['TRACKING'])
    }
    
}
leerExcel();

/* INFORMAMOS CUANTOS PEDIDOS HAY */

console.log(`Hay ${excelNumberOrder.length} pedidos por enviar sus datos de seguimiento`);


/* EJECUTAMOS EL BOT DE PUPPETEER */

(async () => {

    /* ABRIMOS EL NAVEGADOR */

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://pandasneakers.es/wp-admin');


    /* LE PASAMOS LAS CREDENCIALES */

    const user = '#user_login';
    const password = '#user_pass';
    const rememberme = '#rememberme'

    await page.waitForSelector(user);
    await page.waitForTimeout(1500);
    await page.type(user, 'Pablo');
    await page.waitForTimeout(1000);
    await page.type(password, 'Panda2022_');
    await page.waitForTimeout(1000);
    await page.click(rememberme);
    await page.waitForTimeout(500);
    await page.click("#wp-submit");
    await page.waitForSelector('#activity-widget')
    console.log('**** SESION INICIADA CORRECTAMENTE *****')
    await page.waitForTimeout(500);

    /* INDICAMOS QUE PARA CADA NUMERO DE ORDEN DEL EXCEL ABRA UNA VENTANA Y EJECUTE EL CODIGO */
    
    for (let index = 0; index < excelNumberOrder.length; index++) {
        const element = excelNumberOrder[index];
        const numberTracking = excelTrackingNumber[index]

        await page.goto(`https://pandasneakers.es/wp-admin/post.php?post=${element}&action=edit`);

        /* DECLARAMOS TODOS LOS SELECTORES QUE USAREMOS */

        const imputTracking = '#ywot_tracking_code';
        const orderCheck = '#yith-order-tracking-information > .inside > .track-information > p > label > input';
        const saveOrder = '.order_actions > .wide > .save_order';
        const orderNote = '#add_order_note';
        const noteType = '#order_note_type';
        const addNote = '.add_note > p > button';

        
        await page.waitForTimeout(500);
        await page.waitForSelector(imputTracking);
        await page.type(imputTracking, numberTracking);
        await page.click(orderCheck);
        await page.click(saveOrder);
        await page.waitForSelector(noteType);
        await page.select(noteType, 'customer');
        await page.type(orderNote, 'Estimado Cliente:\nTu pedido se encuentra en camino, ya esta disponible el Código de seguimiento, puedes rastrearlo en todo momento, haciendo click en el siguiente enlace:');
        await page.click(addNote);
        await page.waitForSelector(orderNote);

        console.log(`${index}) El pedido ${element} ya tiene sus datos de seguimiento, trackin: ${numberTracking}`)

    }
    console.log('**** TAREA FINALIZADA :D  ****')
    await browser.close();

})();

console.log(excelNumberOrder);
console.log(excelTrackingNumber);