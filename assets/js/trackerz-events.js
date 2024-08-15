// trackerz-events.js

// Cria ouvintes para eventos específicos na página
function listenForEvents() {
    // Exemplo: Ouvir evento de clique em um botão
    document.querySelectorAll('.my-button').forEach(button => {
      button.addEventListener('click', () => {
        sendEvent('Button Click', {
          buttonId: button.id,
          buttonText: button.textContent
        });
      });
    });
  
    // Exemplo: Ouvir evento de scroll em um elemento
    document.addEventListener('scroll', () => {
      // Verifique se um elemento específico está visível na tela
      const targetElement = document.getElementById('my-target-element');
      if (checkIsVisible(targetElement)) {
        sendEvent('Element In View', {
          elementId: targetElement.id,
          elementClass: targetElement.classList
        });
      }
    });
  
    // Exemplo: Ouvir evento de tempo na página
    let startTime = Date.now();
    setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      if (elapsedTime % 30 === 0) { // Envia evento a cada 30 segundos
        sendEvent('Time On Page', {
          time: elapsedTime
        });
      }
    }, 1000);
  }
  
  // Dispara o evento para as APIs escolhidas
  function sendEvent(eventName, eventData) {
    // Adicionar o timestamp ao eventData
    eventData.timestamp = getUtcTimestamp();
  
    // Enviar para o Facebook Pixel (se configurado)
    if (window.Trackerz.data.fbPixel) {
      window.Trackerz.facebookSendEvent(eventName, eventData);
    }
  
    // Enviar para o Google Tag Manager (se configurado)
    if (window.Trackerz.data.gtmEnabled) {
      window.Trackerz.sendEventToGTM(eventData);
    }
  
    // Enviar para o Mautic (se configurado)
    if (window.Trackerz.data.mauticEnabled) {
      window.Trackerz.sendEventToMautic(eventData);
    }
  
    // Enviar para a API do Trackerz (se configurado)
    if (window.Trackerz.data.apiEnabled) {
      window.Trackerz.sendEventDataAPI(eventData);
    }
  }
  
  // Exporta as funções para uso em outros arquivos
  export {
    listenForEvents,
    sendEvent
  };