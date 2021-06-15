'use babel';

export default function panel() {
    //Панель
    let panel = create_element(['stnc_main_panel'])

    //region Resize panel functions
    //боковая планка для изменения размера
    let resizer = create_element(
        ['stnc_panel_resize'],
        panel)
    resizer.addEventListener('mousedown', (e) => {
        initDrag(e)
    })

    var startX, startWidth;

    function initDrag(e) {
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    }

    function doDrag(e) {
        panel.style.width = (startWidth - e.clientX + startX) + 'px';
    }

    function stopDrag() {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }
    //endregion

    let container = create_element(['stnc_panel_container'], panel)

    panel.header = create_element(['stnc_panel','stnc_header'],  container,'Sinumerik to ')
    panel.header_select = create_element(['stnc_header-select'], panel.header, '', 'select')
    panel.header_select.nc = create_element(['stnc_header-select'], panel.header_select, 'NC', 'option')
    panel.header_select.fanuc = create_element(['stnc_header-select'], panel.header_select, 'FANUC', 'option')
    panel.body = create_element(['stnc_panel','stnc_body'],  container)
    panel.ul = create_element(['stnc_ul'], panel.body,'','ul')
    panel.footer = create_element(['stnc_panel','stnc_footer'],  container,'footer')

    return panel
}

function create_element(classes, parent, text, tag) {
    if (!tag) {
        tag = 'div'
    }
    let element = document.createElement(tag)
    classes.forEach(single_class => {
        element.classList.add(single_class)
    })
    if (text && text.length > 0) {
        element.innerText = text
    }
    if (parent) {
        parent.appendChild(element)
    }
    return element
}

