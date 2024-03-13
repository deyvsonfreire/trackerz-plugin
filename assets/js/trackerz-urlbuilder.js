const urlParams = new URLSearchParams(window.location.search);
const urlParamsReferrer = new URLSearchParams(document.referrer.split('?')[1] || '');
const utms = ['utm_campaign', 'utm_medium', 'utm_source', 'utm_content', 'utm_term'];

function preencherCamposUTM(form) {


    // Preenche os campos UTM
    utms.forEach(utm => {
        let campo = form.querySelector('[id^="form-field-' + utm + '"]');
        if (campo) {
            let valor = urlParams.get(utm) ?? urlParamsReferrer.get(utm) ?? '';
            if (utm === 'utm_source' && valor === '') {
                valor = document.referrer ? new URL(document.referrer).hostname : "direto";
            }
            campo.value = valor;
        }
    });

    // Preenche o campo do slug da página
    let campoSlug = form.querySelector('[id^="form-field-pagina_captura"]');
    if (campoSlug) {
        campoSlug.value = window.location.pathname.split('/')[1];
    }
}

// Preenche os campos UTM nos formulários e adiciona um ouvinte de evento para atualizar os campos ao mudar o email
document.querySelectorAll('form').forEach(form => {
    preencherCamposUTM(form);
    const campoEmail = form.querySelector('[id^="form-field-email"]');
    if (campoEmail) {
        campoEmail.addEventListener('change', () => preencherCamposUTM(form));
    }
});

// Função para verificar se uma string é uma URL válida
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

// Função para pesquisar os parâmetros de UTM na URL atual, na URL de referência e nos cookies
function searchParamsUrlCookie(...params) {
    // Verifique a URL atual
    const urlSearchParams = new URLSearchParams(window.location.search);
    for (const param of params) {
        if (urlSearchParams.has(param)) {
            return urlSearchParams.get(param);
        }
    }

    // Verifique a URL de referência
    const referrerSearchParams = new URLSearchParams(document.referrer.split('?')[1] || '');
    for (const param of params) {
        if (referrerSearchParams.has(param)) {
            return referrerSearchParams.get(param);
        }
    }

    // Verifique os Cookies
    for (const param of params) {
        const cookieName = param;
        const cookieValue = getCookie(cookieName);
        if (cookieValue) {
            return cookieValue;
        }
    }

    // Se não encontrado em nenhum lugar, retorne em branco
    return '';
}

// Função auxiliar para obter o valor de um cookie
function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

// Aplicar a lógica de preenchimento dos parâmetros de UTM nos links da página
let scks = [];
document.querySelectorAll('a').forEach(el => {
    if (isValidURL(el.href)) {
        const elURL = new URL(el.href);
        if (!elURL.hash) {
            const elSearchParams = new URLSearchParams(elURL.search);
            let hasUTMs = false;
            utms.forEach(utm => {
                const utmValue = searchParamsUrlCookie(utm);
                if (utmValue !== '') { // Verificar se o valor do parâmetro UTM não está vazio
                    if (!elSearchParams.has(utm)) {
                        elSearchParams.append(utm, utmValue);
                        hasUTMs = true;
                    }
                }
            });
            if (!elSearchParams.has('sck') && scks.length > 0) {
                elSearchParams.append('sck', scks.join('|'));
                hasUTMs = true;
            }
            if (hasUTMs) {
                el.href = elURL.origin + elURL.pathname + "?" + elSearchParams.toString();
            }
        }
    }
});