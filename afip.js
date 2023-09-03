const puppeteer = require ('puppeteer');


(async () => {

    /* ABRIMOS EL NAVEGADOR */

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://auth.afip.gob.ar/contribuyente_/login.xhtml');


    /* LE PASAMOS LAS CREDENCIALES */
    
    const newPagePromise = new Promise(async (resolve) => {
        const target = await browser.waitForTarget((t) => t.opener() === page.target());
        const newPage = await target.page();
        resolve(newPage);
      });
    const user = 'input[name="F1:username"]';
    const btnNext = 'input[name="F1:btnSiguiente"]'
    const password = 'input[name="F1:password"]';
    const btnIngresar = 'input[name="F1:btnIngresar"]'
    const rememberme = '#rememberme'

    /**LE PASAMOS LAS CREDENCIALEs */
    await page.waitForSelector(user);
    await page.waitForTimeout(1500);
    await page.type(user, '20383403104');
    await page.click(btnNext)
    
    await page.waitForSelector(password)
    await page.type(password, 'Davidga1212')
    await page.click(btnIngresar)

    /*** BUSCAR COMPROBANTES EN EL HOME */
    const buscador = '#buscadorInput'
    const resultadoBusqueda = '#rbt-menu-item-0'

    await page.waitForSelector(buscador)
    await page.type(buscador, 'comprobantes en línea')
    await page.waitForSelector(resultadoBusqueda)


    // Haz clic en un enlace o realiza alguna acción que abra una nueva pestaña
    await page.click(resultadoBusqueda);

      // Espera a que se abra la nueva pestaña y cambia a ella
    const newPage = await newPagePromise;
    
    const empresaBtn = 'input[onclick="document.getElementById(\'idcontribuyente\').value=\'0\';document.seleccionaEmpresaForm.submit();"]'
    
    await newPage.waitForSelector(empresaBtn)
    await newPage.click(empresaBtn)
    const comprobantesBtn = 'a#btn_gen_cmp.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-icons'
    await newPage.waitForSelector(comprobantesBtn)
    await newPage.click(comprobantesBtn)


    console.log('**** TAREA FINALIZADA :D  ****')
    //await browser.close();

})();