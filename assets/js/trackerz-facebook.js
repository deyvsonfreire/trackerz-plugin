// trackerz-facebook.js

// Carrega o script do Facebook Pixel e inicializa o fbq
function facebookLoadPixel() {
  if (typeof fbq === 'undefined') {
    // Carrega o script do Facebook Pixel se ele não estiver carregado
    !function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    // Inicializa o fbq com o ID do Pixel
    let pixels = window.Trackerz.data.fbPixel;
    if (pixels.includes(',')) {
      pixels = pixels.split(',');
      for (let pixel of pixels) {
        fbq('init', pixel);
      }
    } else {
      fbq('init', pixels);
    }
  }
}

// Envia eventos para o Facebook Pixel e Google Tag Manager
function facebookSendEvent(eventName, eventData) {
  // Adaptação para o Facebook Pixel e Google Tag Manager
  // Envia eventos para o Facebook Pixel
  fbq('track', eventName, eventData);

  // Envia eventos para o Google Tag Manager (se configurado)
  if (window.Trackerz.data.gtmEnabled) {
    window.Trackerz.sendEventToGTM(eventData);
  }
}

// Envia eventos para o Facebook Pixel utilizando o método fbq('track')
function facebookWeb(eventName, eventData) {
  fbq('track', eventName, eventData);
}

// Envia eventos para a API do Facebook
async function facebookAPI(eventName, eventData) {
  try {
    const response = await fetch(window.Trackerz.data.facebookAPIEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Adapte os dados para a API do Facebook
        eventName: eventName,
        eventData: eventData,
        // ... outros dados necessários pela API
      })
    });

    if (response.ok) {
      // Tratar a resposta da API se necessário
      console.log("Evento enviado para a API do Facebook com sucesso!");
    } else {
      // Tratar erro se a API não retornar 200
      console.error("Erro ao enviar evento para a API do Facebook:", response.status);
    }
  } catch (error) {
    // Tratar erros de rede
    console.error("Erro na requisição para a API do Facebook:", error);
  }
}

// Exporta as funções para uso em outros arquivos
export {
  facebookLoadPixel,
  facebookSendEvent,
  facebookWeb,
  facebookAPI
};