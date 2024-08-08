document.getElementById('chatBtn').addEventListener('click', function() {
    document.getElementById('chatSection').classList.remove('d-none');
    document.getElementById('vozSection').classList.add('d-none');
    this.classList.add('btn-primary');
    this.classList.remove('btn-secondary');
    document.getElementById('vozBtn').classList.remove('btn-primary');
    document.getElementById('vozBtn').classList.add('btn-secondary');
  });
  
  document.getElementById('vozBtn').addEventListener('click', function() {
    document.getElementById('vozSection').classList.remove('d-none');
    document.getElementById('chatSection').classList.add('d-none');
    this.classList.add('btn-primary');
    this.classList.remove('btn-secondary');
    document.getElementById('chatBtn').classList.remove('btn-primary');
    document.getElementById('chatBtn').classList.add('btn-secondary');
  });
  
  document.getElementById('whatsappBtn').addEventListener('click', function() {
    this.classList.add('btn-primary');
    this.classList.remove('btn-secondary');
    document.getElementById('googleBtn').classList.remove('btn-primary');
    document.getElementById('googleBtn').classList.add('btn-secondary');
  });
  
  document.getElementById('googleBtn').addEventListener('click', function() {
    this.classList.add('btn-primary');
    this.classList.remove('btn-secondary');
    document.getElementById('whatsappBtn').classList.remove('btn-primary');
    document.getElementById('whatsappBtn').classList.add('btn-secondary');
  });
  
  function copyToClipboard(textAreaId) {
    const textArea = document.getElementById(textAreaId);
    textArea.select();
    document.execCommand('copy');
  }
  
  const jsonTemplate = `{
    "messages": [], #Mensajes enviados por el emisor en español, ordenados
    "messages_english": "", # Traducción al inglés de los mensajes del emisor
    "my_response": "",  # Mi respuesta en inglés a los mensajes del emisor
    "observations": "",  # Reformulación formal de mi respuesta corregida en Ingles, puedes cambiar algunas palabras según tu criterio para mejorar fluidez y/o vocabulario 
    "explanation": "",  # Explicaciones de los errores principales corregidos haciendo enfasis en gramatica y redacción
    "spanish_response": "" # Transcripción del campo 'observations' al español
  }`;

  function pasteFromClipboard(textAreaId) {
    navigator.clipboard.readText().then(text => {
        // Depuración: Ver el texto original del portapapeles
        console.log('Texto del portapapeles:', text);
        let messages = [];

        if (text.includes('[') && text.includes(']')) {

            messages = text.split('\n').map(line => {
                const bracketEndIndex = line.indexOf(']');
                const colonIndex = line.indexOf(':', bracketEndIndex);
                if (bracketEndIndex !== -1 && colonIndex !== -1) {
                    // Extraer el texto después de los corchetes y dos puntos
                    const message = line.substring(colonIndex + 1).trim();
                    // Extraer el nombre del remitente
                    const sender = line.substring(bracketEndIndex + 1, colonIndex).trim();
                    return `"${sender}: ${message}"`;
                }
                return null;
            }).filter(message => message !== null);
        } else {
            // Si no hay corchetes, tomar todo el texto como un único mensaje
            messages.push(`"${text.trim()}"`);
        }

        // Depuración: Ver los mensajes extraídos
        console.log('Mensajes extraídos:', messages);

        const messagesJsonArray = `[${messages.join(', ')}]`;
        const updatedJson = jsonTemplate.replace('"messages": []', `"messages": ${messagesJsonArray}`);

        document.getElementById(textAreaId).value = updatedJson;
        autoExpand(document.getElementById(textAreaId));
    }).catch(error => {
        // Depuración: Manejar errores
        console.error('Error al leer el portapapeles:', error);
    });
}
document.getElementById('chatCopyBtn1').addEventListener('click', function() {
    const textAreaValue = document.getElementById('chatInput1').value;
    const text = "vamos a tener un ejercicio para mejorar mi nivel de ingles en una conversación. Responderás todo en base a " + 
                 "esta plantilla JSON: " + textAreaValue + " Responde solo con el JSON";
  
    // Crear un textarea temporal para copiar el texto
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
  
    tempTextArea.select();
    document.execCommand('copy');
    
    // Eliminar el textarea temporal después de copiar
    document.body.removeChild(tempTextArea);
  });


  document.getElementById('chatCopyBtn2').addEventListener('click', function() {
    // Obtener el contenido del textarea
    const textareaContent = document.getElementById('chatInput4').value;
  
    // Buscar la línea que comienza con 'Spanish Response:'
    const spanishResponseMatch = textareaContent.match(/^Spanish Response: (.*)$/m);
  
    if (spanishResponseMatch) {
      // Extraer el valor del 'Spanish Response'
      const spanishResponse = spanishResponseMatch[1];
  
      // Copiar al portapapeles
      navigator.clipboard.writeText(spanishResponse).then(() => {
        console.log('Spanish Response copied to clipboard.');
      }).catch(err => {
        console.error('Failed to copy Spanish Response to clipboard:', err);
      });
    } else {
      console.error('Spanish Response not found in textarea content.');
    }
  });
  


  document.getElementById('chatVoiceBtn1').addEventListener('click', function() {
    // Obtener el contenido del textarea
    const textareaContent = document.getElementById('chatInput3').value;
  
    // Buscar la línea que comienza con 'Observations:'
    const observationsMatch = textareaContent.match(/^Observations: (.*)$/m);
  
    if (observationsMatch) {
      // Extraer el valor del 'Observations'
      const observations = observationsMatch[1];
  
      // Crear un objeto SpeechSynthesisUtterance para leer el texto
      const utterance = new SpeechSynthesisUtterance(observations);
  
      // Opcional: configurar propiedades del objeto utterance, como la voz o la velocidad
      utterance.lang = 'en-US'; // Establece el idioma a inglés
      utterance.rate = 1; // Configura la velocidad de la voz (0.1 a 10)
  
      // Reproducir el texto
      window.speechSynthesis.speak(utterance);
  
    } else {
      console.error('Observations not found in textarea content.');
    }
  });
  

  document.getElementById('chatPasteBtn1').addEventListener('click', function() {
    pasteFromClipboard('chatInput1');
  });
  
  document.getElementById('chatPasteBtn2').addEventListener('click', function() {
    navigator.clipboard.readText().then(text => {
      try {
        // Parsear el texto del portapapeles como JSON
        const data = JSON.parse(text);
  
        // Verificar que los campos existen antes de extraerlos
        const messagesEnglish = data.messages_english || '';
        const myResponse = data.my_response || '';
        const observations = data.observations || '';
        const explanation = data.explanation || '';
        const spanishResponse = data.spanish_response || '';
  
        // Construir el contenido a mostrar
        const content1 = `
Messages in English: ${messagesEnglish}
        `;

        const content2 = `
My Response: ${myResponse}

Observations: ${observations}

Explanation: ${explanation}
                `;
  
                
                const content3 = `
Spanish Response: ${spanishResponse}
                        `;
                  
  
        // Mostrar el contenido en el textarea con id "chatInput2"
        document.getElementById('chatInput2').value = content1;
        autoExpand(document.getElementById('chatInput2'));

        document.getElementById('chatInput3').value = content2;
        autoExpand(document.getElementById('chatInput3'));

        document.getElementById('chatInput4').value = content3;
        autoExpand(document.getElementById('chatInput4'));




      } catch (error) {
        console.error('Error parsing JSON from clipboard:', error);
      }
    }).catch(err => {
      console.error('Failed to read clipboard contents:', err);
    });
  });
  
  document.getElementById('vozCopyBtn2').addEventListener('click', function() {
    copyToClipboard('vozInput2');
  });
  

  document.addEventListener('input', function (event) {
        if (event.target.tagName.toLowerCase() !== 'textarea') return;
        autoExpand(event.target);
    });

function autoExpand(textarea) {
    // Resetea la altura para calcular el scrollHeight correctamente
    textarea.style.height = 'auto';
    // Establece la altura según el scrollHeight
    textarea.style.height = textarea.scrollHeight + 'px';
}

if ('webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  const talkButton = document.getElementById('talkButton');
  const stopButton = document.getElementById('stopButton');
  let finalTranscript = '';

  talkButton.addEventListener('click', () => {
      finalTranscript = ''; // Reinicia el transcript final
      talkButton.classList.add('hidden');
      stopButton.classList.remove('hidden');
      recognition.start();
  });

  stopButton.addEventListener('click', () => {
      stopButton.classList.add('hidden');
      talkButton.classList.remove('hidden');
      recognition.stop();
  });

  recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
              finalTranscript += transcript;
          } else {
              interimTranscript += transcript;
          }
      }
  };

  recognition.onend = () => {    
      if (finalTranscript) {
        // GRabar contenido en segundo text area
        const chatInputText1 = document.getElementById('chatInputText1');
        chatInputText1.value = finalTranscript;
        autoExpand(chatInputText1);

          // Obtener el contenido actual del textarea con id="chatInput1"
          const chatInput1 = document.getElementById('chatInput1');
          let jsonString = chatInput1.value;

          // Encontrar el índice del campo "my_response"
          const myResponsePattern = /("my_response":\s*")(.*?)(?=")/;
          const updatedString = jsonString.replace(myResponsePattern, `$1${finalTranscript.replace(/"/g, '\\"')}`);

          // Actualizar el contenido del textarea con id="chatInput1"
          chatInput1.value = updatedString;
          autoExpand(chatInput1);
      }
  };

  recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      stopButton.classList.add('hidden');
      talkButton.classList.remove('hidden');
  };
}
else {
    console.warn('Este navegador no soporta la API de reconocimiento de voz.');
}