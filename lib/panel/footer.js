'use babel'

import {create_element} from "./main_panel";
import {exportText} from "./export";

function footer(container){
    const footer = create_element(['stnc_panel','stnc_footer'],  container)
    footer.btn = create_element(['stnc_export_btn'], footer, 'Выгрузить', 'button')
    footer.btn.addEventListener('click', exportText);
    return footer
}

export {footer}

