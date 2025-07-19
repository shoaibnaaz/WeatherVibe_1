import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Thermometer, Droplets, Wind, Eye, Sunrise, Sunset } from 'lucide-react'
import './CurrentWeather.css'

const CurrentWeather = ({ data, location, units, onUnitsChange }) => {
  const getWeatherIcon = (weatherCode) => {
    // Weather icon mapping based on OpenWeatherMap codes
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    }
    return iconMap[weatherCode] || '🌤️'
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getTemperatureUnit = () => units === 'metric' ? '°C' : '°F'
  const getSpeedUnit = () => units === 'metric' ? 'm/s' : 'mph'

  // Voice feedback handler
  const handleSpeakWeather = () => {
    if (!data) return;
    
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const city = location.name;
    const unit = getTemperatureUnit();
    
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a voice for the selected language
    let selectedVoice = voices.find(voice => 
      voice.lang.startsWith(voiceLang.split('-')[0]) || 
      voice.lang === voiceLang
    );
    
    // If no voice found for selected language, try to find any available voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      if (selectedVoice) {
        alert(`Voice for ${languages.find(lang => lang.code === voiceLang)?.label} not available. Using ${selectedVoice.name} instead.`);
      } else {
        alert('No voices available. Please try a different browser or language.');
        return;
      }
    }

    // Get language code without region
    const langCode = voiceLang.split('-')[0];
    
    // Comprehensive weather messages for different languages
    const weatherMessages = {
      'en': `The current weather in ${city} is ${desc} with a temperature of ${temp} ${unit}.`,
      'es': `El clima en ${city} es ${desc} con una temperatura de ${temp} ${unit}.`,
      'fr': `Le temps à ${city} est ${desc} avec une température de ${temp} ${unit}.`,
      'de': `Das Wetter in ${city} ist ${desc} mit einer Temperatur von ${temp} ${unit}.`,
      'it': `Il tempo a ${city} è ${desc} con una temperatura di ${temp} ${unit}.`,
      'pt': `O clima em ${city} é ${desc} com uma temperatura de ${temp} ${unit}.`,
      'ru': `Погода в ${city} ${desc} с температурой ${temp} ${unit}.`,
      'ja': `${city}の天気は${desc}で、気温は${temp}${unit}です。`,
      'ko': `${city}의 날씨는 ${desc}이고 기온은 ${temp}${unit}입니다.`,
      'zh': `${city}的天气是${desc}，温度是${temp}${unit}。`,
      'ar': `الطقس في ${city} ${desc} ودرجة الحرارة ${temp} ${unit}.`,
      'hi': `${city} में मौसम ${desc} है और तापमान ${temp} ${unit} है।`,
      'bn': `${city} এ আবহাওয়া ${desc} এবং তাপমাত্রা ${temp} ${unit}।`,
      'ur': `اس وقت ${city} میں موسم ${desc} ہے اور درجہ حرارت ${temp} ${unit} ہے۔`,
      'ps': `اوس مهال په ${city} کې هوا ${desc} ده او تودوخه ${temp} ${unit} ده.`,
      // Additional Urdu and Pashto variants for better voice support
      'ur-IN': `اس وقت ${city} میں موسم ${desc} ہے اور درجہ حرارت ${temp} ${unit} ہے۔`,
      'ps-AF': `اوس مهال په ${city} کې هوا ${desc} ده او تودوخه ${temp} ${unit} ده.`,
      'tr': `${city} şehrinde hava ${desc} ve sıcaklık ${temp} ${unit}.`,
      'nl': `Het weer in ${city} is ${desc} met een temperatuur van ${temp} ${unit}.`,
      'sv': `Vädret i ${city} är ${desc} med en temperatur på ${temp} ${unit}.`,
      'no': `Været i ${city} er ${desc} med en temperatur på ${temp} ${unit}.`,
      'da': `Vejret i ${city} er ${desc} med en temperatur på ${temp} ${unit}.`,
      'fi': `Sää ${city}:ssa on ${desc} lämpötilalla ${temp} ${unit}.`,
      'pl': `Pogoda w ${city} to ${desc} z temperaturą ${temp} ${unit}.`,
      'cs': `Počasí v ${city} je ${desc} s teplotou ${temp} ${unit}.`,
      'sk': `Počasie v ${city} je ${desc} s teplotou ${temp} ${unit}.`,
      'hu': `Az időjárás ${city}-ban ${desc} ${temp} ${unit} hőmérséklettel.`,
      'ro': `Vremea în ${city} este ${desc} cu o temperatură de ${temp} ${unit}.`,
      'bg': `Времето в ${city} е ${desc} с температура ${temp} ${unit}.`,
      'hr': `Vrijeme u ${city} je ${desc} s temperaturom od ${temp} ${unit}.`,
      'sr': `Време у ${city} је ${desc} са температуром од ${temp} ${unit}.`,
      'sl': `Vreme v ${city} je ${desc} s temperaturo ${temp} ${unit}.`,
      'et': `Ilm ${city}s on ${desc} temperatuuriga ${temp} ${unit}.`,
      'lv': `Laiks ${city} ir ${desc} ar temperatūru ${temp} ${unit}.`,
      'lt': `Orai ${city} yra ${desc} su temperatūra ${temp} ${unit}.`,
      'el': `Ο καιρός στην ${city} είναι ${desc} με θερμοκρασία ${temp} ${unit}.`,
      'he': `המזג אוויר ב${city} הוא ${desc} עם טמפרטורה של ${temp} ${unit}.`,
      'th': `อากาศใน${city}เป็น${desc}อุณหภูมิ${temp}${unit}`,
      'vi': `Thời tiết ở ${city} là ${desc} với nhiệt độ ${temp} ${unit}.`,
      'id': `Cuaca di ${city} adalah ${desc} dengan suhu ${temp} ${unit}.`,
      'ms': `Cuaca di ${city} adalah ${desc} dengan suhu ${temp} ${unit}.`,
      'tl': `Ang panahon sa ${city} ay ${desc} na may temperatura na ${temp} ${unit}.`,
      'ca': `El temps a ${city} és ${desc} amb una temperatura de ${temp} ${unit}.`,
      'eu': `${city}ko eguraldia ${desc} da ${temp} ${unit} tenperaturarekin.`,
      'gl': `O tempo en ${city} é ${desc} cunha temperatura de ${temp} ${unit}.`,
      'is': `Veðrið í ${city} er ${desc} með hitastig ${temp} ${unit}.`,
      'mt': `It-temp f'${city} hija ${desc} b'temperatura ta' ${temp} ${unit}.`,
      'cy': `Mae'r tywydd yn ${city} yn ${desc} gyda thymheredd o ${temp} ${unit}.`,
      'ga': `Is é an aimsir i ${city} ná ${desc} le teocht ${temp} ${unit}.`,
      'sq': `Moti në ${city} është ${desc} me temperaturë ${temp} ${unit}.`,
      'mk': `Времето во ${city} е ${desc} со температура ${temp} ${unit}.`,
      'bs': `Vrijeme u ${city} je ${desc} s temperaturom od ${temp} ${unit}.`,
      'me': `Vrijeme u ${city} je ${desc} s temperaturom od ${temp} ${unit}.`,
      'ka': `ამინდი ${city}-ში არის ${desc} ტემპერატურით ${temp} ${unit}.`,
      'hy': `Եղանակը ${city}-ում ${desc} է ${temp} ${unit} ջերմաստիճանով:`,
      'az': `${city} şəhərində hava ${desc} və temperatur ${temp} ${unit}.`,
      'kk': `${city} қаласында ауа райы ${desc}, температурасы ${temp} ${unit}.`,
      'ky': `${city} шаарында аба ырайы ${desc}, температурасы ${temp} ${unit}.`,
      'uz': `${city} shahrida ob-havo ${desc}, harorati ${temp} ${unit}.`,
      'tk': `${city} şäherinde howa ${desc}, temperatura ${temp} ${unit}.`,
      'tg': `Ҳаво дар ${city} ${desc} аст, ҳарорати ${temp} ${unit}.`,
      'fa': `هوا در ${city} ${desc} است با دمای ${temp} ${unit}.`,
      'ku': `Heva li ${city} ${desc} e bi germahiya ${temp} ${unit}.`,
      'am': `የ${city} አየር ሁኔታ ${desc} ነው ከ${temp} ${unit} ሙቀት ጋር።`,
      'sw': `Hali ya hewa huko ${city} ni ${desc} na joto la ${temp} ${unit}.`,
      'yo': `Oju ojo ni ${city} jẹ ${desc} pẹlu otutu ${temp} ${unit}.`,
      'ig': `Ọnọdụ ihu igwe na ${city} bụ ${desc} na okpomọkụ nke ${temp} ${unit}.`,
      'ha': `Yanayin ${city} shine ${desc} tare da zafin ${temp} ${unit}.`,
      'zu': `Isimo sezulu e-${city} si-${desc} nokushisa kuka-${temp} ${unit}.`,
      'af': `Die weer in ${city} is ${desc} met 'n temperatuur van ${temp} ${unit}.`,
      'xh': `Imozulu e-${city} yi-${desc} nokushisa kuka-${temp} ${unit}.`,
      'st': `Boemo ba leholimo ho ${city} ke ${desc} ka mocheso oa ${temp} ${unit}.`,
      'tn': `Sebakeng sa ${city} ke ${desc} ka mocheso wa ${temp} ${unit}.`,
      'ts': `Xihlovo xa ${city} i ${desc} hi ku hisa ka ${temp} ${unit}.`,
      've': `Vhoimo ha mvula kha ${city} ndi ${desc} na vhudzi ha ${temp} ${unit}.`,
      'nr': `Isimo sezulu e-${city} si-${desc} nokushisa kuka-${temp} ${unit}.`,
      'ss': `Simo sezulu e-${city} si-${desc} nokushisa kuka-${temp} ${unit}.`,
      'sn': `Mamiriro ekunze mu ${city} ndi ${desc} nekupisa kwe ${temp} ${unit}.`,
      'rw': `Ikirere muri ${city} ni ${desc} hamwe n'ubushyuhe bwa ${temp} ${unit}.`,
      'ak': `Wim tebea wɔ ${city} yɛ ${desc} ne ɛyɛ hyew a ɛyɛ ${temp} ${unit}.`,
      'tw': `Wim tebea wɔ ${city} yɛ ${desc} ne ɛyɛ hyew a ɛyɛ ${temp} ${unit}.`,
      'ee': `Yame le ${city} ɖo ${desc} kple ɖame si le ${temp} ${unit}.`,
      'lg': `Embeera y'ebiro mu ${city} kiri ${desc} n'ebiro bya ${temp} ${unit}.`,
      'ny': `Nyengo mu ${city} ndi ${desc} ndi kutentha kwa ${temp} ${unit}.`,
      'mg': `Ny toetr'andro ao ${city} dia ${desc} miaraka amin'ny hafanana ${temp} ${unit}.`,
      'so': `Cimilada ${city} waa ${desc} leh heerkulka ${temp} ${unit}.`,
      'om': `Haala qilleensaa ${city} kan ${desc} yoo ta'u kan qilleensaa ${temp} ${unit}.`,
      'ti': `ኩነታት ኣየር ናብ ${city} ${desc} እዩ ምስ ${temp} ${unit} ሙቐት።`,
      'si': `${city} හි කාලගුණය ${desc} වන අතර උෂ්ණත්වය ${temp} ${unit} වේ.`,
      'my': `${city} မှာ ရာသီဥတုက ${desc} ဖြစ်ပြီး အပူချိန်က ${temp} ${unit} ဖြစ်ပါတယ်။`,
      'km': `អាកាសធាតុនៅ ${city} គឺ ${desc} ជាមួយនឹងសីតុណ្ហភាព ${temp} ${unit}។`,
      'lo': `ສະພາບອາກາດໃນ ${city} ແມ່ນ ${desc} ພ້ອມອຸນຫະພູມ ${temp} ${unit} ເຊິ່ງ.`,
      'mn': `${city} дээрх цаг агаар ${desc} бөгөөд температур ${temp} ${unit} байна.`,
      'bo': `${city} ནས་ནམ་ཆགས་ནི་ ${desc} ཡིན་པ་དང་། ཚ་ཚད་ནི་ ${temp} ${unit} ཡིན།`,
      'ne': `${city} मा मौसम ${desc} छ र तापक्रम ${temp} ${unit} छ।`,
      'dz': `${city} ནས་ནམ་ཆགས་ནི་ ${desc} ཡིན་པ་དང་། ཚ་ཚད་ནི་ ${temp} ${unit} ཡིན།`,
      'ml': `${city} ലെ കാലാവസ്ഥ ${desc} ആണ്, താപനില ${temp} ${unit} ആണ്.`,
      'ta': `${city} இல் வானிலை ${desc} ஆகும், வெப்பநிலை ${temp} ${unit} ஆகும்.`,
      'te': `${city} లో వాతావరణం ${desc} గా ఉంది, ఉష్ణోగ్రత ${temp} ${unit} ఉంది.`,
      'kn': `${city} ನಲ್ಲಿ ಹವಾಮಾನ ${desc} ಆಗಿದೆ, ತಾಪಮಾನ ${temp} ${unit} ಆಗಿದೆ.`,
      'gu': `${city} માં હવામાન ${desc} છે અને તાપમાન ${temp} ${unit} છે.`,
      'pa': `${city} ਵਿੱਚ ਮੌਸਮ ${desc} ਹੈ ਅਤੇ ਤਾਪਮਾਨ ${temp} ${unit} ਹੈ।`,
      'or': `${city} ରେ ପାଣିପାଗ ${desc} ଅଟେ ଏବଂ ତାପମାନ ${temp} ${unit} ଅଟେ।`,
      'as': `${city} ত বতৰ ${desc} আৰু উষ্ণতা ${temp} ${unit}।`,
      'mr': `${city} मध्ये हवामान ${desc} आहे आणि तापमान ${temp} ${unit} आहे.`,
      'sa': `${city} इत्यत्र वातावरणं ${desc} अस्ति तापमानं च ${temp} ${unit} अस्ति।`,
      'sd': `${city} ۾ موسم ${desc} آهي ۽ درجه حرارت ${temp} ${unit} آهي.`,
      'ks': `${city} ۾ موسم ${desc} آهي ۽ درجه حرارت ${temp} ${unit} آهي.`,
      'brx': `${city} आव ${desc} बारिश आरो ${temp} ${unit} तापमान दं।`,
      'mni': `${city} दा আবহাওয়া ${desc} अरसीং तापमাত্রा ${temp} ${unit} अमসুং।`,
      'doi': `${city} च मौसम ${desc} ऐ आरो तापमान ${temp} ${unit} ऐ।`,
      'sat': `${city} ᱨᱮ ᱫᱟᱜ ᱫᱟᱜ ${desc} ᱠᱟᱱᱟ ᱟᱨ ᱛᱟᱯᱢᱟᱨ ${temp} ${unit} ᱠᱟᱱᱟ।`,
      'ksh': `Dat Wedder en ${city} es ${desc} met en Temperatur vun ${temp} ${unit}.`,
      'lb': `D'Wieder zu ${city} ass ${desc} mat enger Temperatur vu ${temp} ${unit}.`,
      'rm': `Il temp a ${city} è ${desc} cun ina temperatura da ${temp} ${unit}.`,
      'fur': `Il timp a ${city} al è ${desc} cun une temperature di ${temp} ${unit}.`,
      'vec': `El tempo a ${city} xe ${desc} co na tenperatura de ${temp} ${unit}.`,
      'sc': `Su tempus in ${city} est ${desc} cun una temperadura de ${temp} ${unit}.`,
      'lmo': `El temp a ${city} l'è ${desc} cun una temperatura de ${temp} ${unit}.`,
      'pms': `Ël temp a ${city} a l'é ${desc} con na temperadura ëd ${temp} ${unit}.`,
      'nap': `'O tiempo a ${city} è ${desc} cu 'na temperatura 'e ${temp} ${unit}.`,
      'scn': `U tempu a ${city} è ${desc} cu na timpiratura di ${temp} ${unit}.`,
      'co': `U tempu in ${city} hè ${desc} cù una timperatura di ${temp} ${unit}.`,
      'oc': `Lo temps a ${city} es ${desc} amb una temperatura de ${temp} ${unit}.`,
      'br': `An amzer e ${city} zo ${desc} gant un donderadur a ${temp} ${unit}.`,
      'gv': `Ta'n emshyr ayns ${city} myr ${desc} lesh çhiassid ${temp} ${unit}.`,
      'kw': `An gewer yn ${city} yw ${desc} gans tomder a ${temp} ${unit}.`,
      'fo': `Veðrið í ${city} er ${desc} við hitastig ${temp} ${unit}.`,
      'kl': `Sila ${city}mi ${desc} ${temp} ${unit} qaanaartoq.`,
      'sm': `O le tau i ${city} o ${desc} ma le vevela o ${temp} ${unit}.`,
      'to': `Ko e 'ea 'i ${city} ko e ${desc} mo e vevela 'o e ${temp} ${unit}.`,
      'fj': `Na draki ena ${city} sa ${desc} kei na katakata ni ${temp} ${unit}.`,
      'haw': `Ke ʻano o ka lā ma ${city} he ${desc} me ka wela o ${temp} ${unit}.`,
      'mi': `Ko te rangi ki ${city} he ${desc} me te pāmahana o ${temp} ${unit}.`,
      'ty': `Te rā i ${city} e ${desc} me te veʻa o ${temp} ${unit}.`,
      'ceb': `Ang panahon sa ${city} kay ${desc} nga may temperatura nga ${temp} ${unit}.`,
      'jv': `Cuaca ing ${city} yaiku ${desc} kanthi suhu ${temp} ${unit}.`,
      'su': `Cuaca di ${city} nyaéta ${desc} kalayan suhu ${temp} ${unit}.`,
      'ban': `Cuaca ring ${city} punika ${desc} antuk suhu ${temp} ${unit}.`,
      'bug': `Cuaca i ${city} iyaro ${desc} kalabui suhu ${temp} ${unit}.`,
      'ace': `Cuaca bak ${city} nakeuh ${desc} ngon suhu ${temp} ${unit}.`,
      'min': `Cuaca di ${city} adolah ${desc} jo suhu ${temp} ${unit}.`,
      'gor': `Cuaca to ${city} yito ${desc} wawu suhu ${temp} ${unit}.`,
      'bjn': `Cuaca di ${city} adalah ${desc} lawan suhu ${temp} ${unit}.`,
      'mad': `Cuaca nang ${city} ya ${desc} kalaban suhu ${temp} ${unit}.`,
      'sas': `Cuaca ring ${city} punika ${desc} antuk suhu ${temp} ${unit}.`,
      'mak': `Cuaca i ${city} iyaro ${desc} kalabui suhu ${temp} ${unit}.`,
      'bem': `Iciluba mu ${city} ni ${desc} na ukushita kwa ${temp} ${unit}.`,
      'byn': `ከበር ${city} ዘሎ ኩነታት ኣየር ${desc} እዩ ምስ ${temp} ${unit} ሙቐት።`,
      'cgg': `Ebiro bya ${city} kiri ${desc} n'ebiro bya ${temp} ${unit}.`,
      'chr': `ᎠᏓᏅᏍᏗ ${city} ᎾᎿ ${desc} ᎠᎴ ᎠᏓᏅᏍᏗ ᎠᏓᏅᏍᏗ ${temp} ${unit}.`,
      'crs': `Meteo dan ${city} i ${desc} ek ${temp} ${unit} degre.`,
      'dav': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'dua': `Mpɔ́sɔ ${city} ɛ́yɛ ${desc} na mbɛlɛ́ ${temp} ${unit}.`,
      'dyo': `Temperatiir ci ${city} mooy ${desc} ak ${temp} ${unit}.`,
      'ebu': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'fil': `Ang panahon sa ${city} ay ${desc} na may temperatura na ${temp} ${unit}.`,
      'guz': `Obworo bwa ${city} ni ${desc} na obunyinyi bwa ${temp} ${unit}.`,
      'jgo': `Tɛŋgɛ́ ${city} ɛ́yɛ ${desc} nɛ ${temp} ${unit} mbɛlɛ́.`,
      'jmc': `Ihu ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'kab': `Aɣawas deg ${city} d ${desc} s waman-is ${temp} ${unit}.`,
      'kam': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'ki': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'kln': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'kok': `${city} हांगा हवामान ${desc} आसा आनी तापमान ${temp} ${unit} आसा.`,
      'lag': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'luo': `Chiemo e ${city} en ${desc} gi chiemo mar ${temp} ${unit}.`,
      'luy': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'mer': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'mfe': `Meteo dan ${city} i ${desc} ek ${temp} ${unit} degre.`,
      'naq': `ǃHui ǁgaeb ${city} ǀui ${desc} ǁga ${temp} ${unit}.`,
      'nyn': `Obworo bwa ${city} ni ${desc} na obunyinyi bwa ${temp} ${unit}.`,
      'om': `Haala qilleensaa ${city} kan ${desc} yoo ta'u kan qilleensaa ${temp} ${unit}.`,
      'saq': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'seh': `Tempo i ${city} ndi ${desc} ndi kutentha kwa ${temp} ${unit}.`,
      'ses': `Xali ${city} ga ${desc} ka xa ${temp} ${unit}.`,
      'sbp': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'teo': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'tzm': `Reẓẓiɣ ɣef ${city} d ${desc} s waman-is ${temp} ${unit}.`,
      'vun': `Mbua ya ${city} ni ${desc} na uthithi wa ${temp} ${unit}.`,
      'wae': `S'Wätter z'${city} isch ${desc} mit ere Temperatur vu ${temp} ${unit}.`,
      'xog': `Obworo bwa ${city} ni ${desc} na obunyinyi bwa ${temp} ${unit}.`,
      'zgh': `Reẓẓiɣ ɣef ${city} d ${desc} s waman-is ${temp} ${unit}.`
    };

    // Get message for the language, fallback to English if not found
    let message = weatherMessages[langCode] || weatherMessages['en'];

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = selectedVoice;
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Stop any currently speaking
    window.speechSynthesis.cancel();
    
    // Speak the message
    window.speechSynthesis.speak(utterance);
  };

  const [voiceLang, setVoiceLang] = useState('en-US'); // default to English
  const [availableVoices, setAvailableVoices] = useState([]);
  const [languages, setLanguages] = useState([]);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      if (voices.length > 0) {
        // Create a comprehensive language list from available voices
        const languageMap = new Map();
        
        // Add popular languages first (with better translations)
        const popularLanguages = [
          { code: 'en-US', label: 'English (US)', priority: 1 },
          { code: 'en-GB', label: 'English (UK)', priority: 1 },
          { code: 'es-ES', label: 'Spanish', priority: 1 },
          { code: 'fr-FR', label: 'French', priority: 1 },
          { code: 'de-DE', label: 'German', priority: 1 },
          { code: 'it-IT', label: 'Italian', priority: 1 },
          { code: 'pt-BR', label: 'Portuguese (Brazil)', priority: 1 },
          { code: 'pt-PT', label: 'Portuguese (Portugal)', priority: 1 },
          { code: 'ru-RU', label: 'Russian', priority: 1 },
          { code: 'ja-JP', label: 'Japanese', priority: 1 },
          { code: 'ko-KR', label: 'Korean', priority: 1 },
          { code: 'zh-CN', label: 'Chinese (Mandarin)', priority: 1 },
          { code: 'zh-TW', label: 'Chinese (Traditional)', priority: 1 },
          { code: 'ar-SA', label: 'Arabic', priority: 1 },
          { code: 'hi-IN', label: 'Hindi', priority: 1 },
          { code: 'bn-BD', label: 'Bengali', priority: 1 },
          { code: 'ur-PK', label: 'Urdu (Pakistan)', priority: 1 },
          { code: 'ur-IN', label: 'Urdu (India)', priority: 1 },
          { code: 'ps-PK', label: 'Pashto (Pakistan)', priority: 1 },
          { code: 'ps-AF', label: 'Pashto (Afghanistan)', priority: 1 },
          { code: 'sd-PK', label: 'Sindhi', priority: 1 },
          { code: 'brx-IN', label: 'Bodo', priority: 1 },
          { code: 'mni-IN', label: 'Manipuri', priority: 1 },
          { code: 'doi-IN', label: 'Dogri', priority: 1 },
          { code: 'sat-IN', label: 'Santali', priority: 1 },
          { code: 'tr-TR', label: 'Turkish', priority: 1 },
          { code: 'nl-NL', label: 'Dutch', priority: 1 },
          { code: 'sv-SE', label: 'Swedish', priority: 1 },
          { code: 'no-NO', label: 'Norwegian', priority: 1 },
          { code: 'da-DK', label: 'Danish', priority: 1 },
          { code: 'fi-FI', label: 'Finnish', priority: 1 },
          { code: 'pl-PL', label: 'Polish', priority: 1 },
          { code: 'cs-CZ', label: 'Czech', priority: 1 },
          { code: 'sk-SK', label: 'Slovak', priority: 1 },
          { code: 'hu-HU', label: 'Hungarian', priority: 1 },
          { code: 'ro-RO', label: 'Romanian', priority: 1 },
          { code: 'bg-BG', label: 'Bulgarian', priority: 1 },
          { code: 'hr-HR', label: 'Croatian', priority: 1 },
          { code: 'sr-RS', label: 'Serbian', priority: 1 },
          { code: 'sl-SI', label: 'Slovenian', priority: 1 },
          { code: 'et-EE', label: 'Estonian', priority: 1 },
          { code: 'lv-LV', label: 'Latvian', priority: 1 },
          { code: 'lt-LT', label: 'Lithuanian', priority: 1 },
          { code: 'el-GR', label: 'Greek', priority: 1 },
          { code: 'he-IL', label: 'Hebrew', priority: 1 },
          { code: 'th-TH', label: 'Thai', priority: 1 },
          { code: 'vi-VN', label: 'Vietnamese', priority: 1 },
          { code: 'id-ID', label: 'Indonesian', priority: 1 },
          { code: 'ms-MY', label: 'Malay', priority: 1 },
          { code: 'tl-PH', label: 'Filipino', priority: 1 },
          { code: 'ca-ES', label: 'Catalan', priority: 1 },
          { code: 'eu-ES', label: 'Basque', priority: 1 },
          { code: 'gl-ES', label: 'Galician', priority: 1 },
          { code: 'is-IS', label: 'Icelandic', priority: 1 },
          { code: 'mt-MT', label: 'Maltese', priority: 1 },
          { code: 'cy-GB', label: 'Welsh', priority: 1 },
          { code: 'ga-IE', label: 'Irish', priority: 1 },
          { code: 'sq-AL', label: 'Albanian', priority: 1 },
          { code: 'mk-MK', label: 'Macedonian', priority: 1 },
          { code: 'bs-BA', label: 'Bosnian', priority: 1 },
          { code: 'me-ME', label: 'Montenegrin', priority: 1 },
          { code: 'ka-GE', label: 'Georgian', priority: 1 },
          { code: 'hy-AM', label: 'Armenian', priority: 1 },
          { code: 'az-AZ', label: 'Azerbaijani', priority: 1 },
          { code: 'kk-KZ', label: 'Kazakh', priority: 1 },
          { code: 'ky-KG', label: 'Kyrgyz', priority: 1 },
          { code: 'uz-UZ', label: 'Uzbek', priority: 1 },
          { code: 'tk-TM', label: 'Turkmen', priority: 1 },
          { code: 'tg-TJ', label: 'Tajik', priority: 1 },
          { code: 'fa-IR', label: 'Persian', priority: 1 },
          { code: 'ku-IQ', label: 'Kurdish', priority: 1 },
          { code: 'am-ET', label: 'Amharic', priority: 1 },
          { code: 'sw-KE', label: 'Swahili', priority: 1 },
          { code: 'yo-NG', label: 'Yoruba', priority: 1 },
          { code: 'ig-NG', label: 'Igbo', priority: 1 },
          { code: 'ha-NG', label: 'Hausa', priority: 1 },
          { code: 'zu-ZA', label: 'Zulu', priority: 1 },
          { code: 'af-ZA', label: 'Afrikaans', priority: 1 },
          { code: 'xh-ZA', label: 'Xhosa', priority: 1 },
          { code: 'st-ZA', label: 'Sotho', priority: 1 },
          { code: 'tn-ZA', label: 'Tswana', priority: 1 },
          { code: 'ts-ZA', label: 'Tsonga', priority: 1 },
          { code: 've-ZA', label: 'Venda', priority: 1 },
          { code: 'nr-ZA', label: 'Ndebele', priority: 1 },
          { code: 'ss-ZA', label: 'Swati', priority: 1 },
          { code: 'sn-ZW', label: 'Shona', priority: 1 },
          { code: 'rw-RW', label: 'Kinyarwanda', priority: 1 },
          { code: 'ak-GH', label: 'Akan', priority: 1 },
          { code: 'tw-GH', label: 'Twi', priority: 1 },
          { code: 'ee-GH', label: 'Ewe', priority: 1 },
          { code: 'lg-UG', label: 'Luganda', priority: 1 },
          { code: 'ny-MW', label: 'Chichewa', priority: 1 },
          { code: 'mg-MG', label: 'Malagasy', priority: 1 },
          { code: 'so-SO', label: 'Somali', priority: 1 },
          { code: 'om-ET', label: 'Oromo', priority: 1 },
          { code: 'ti-ER', label: 'Tigrinya', priority: 1 },
          { code: 'si-LK', label: 'Sinhala', priority: 1 },
          { code: 'my-MM', label: 'Burmese', priority: 1 },
          { code: 'km-KH', label: 'Khmer', priority: 1 },
          { code: 'lo-LA', label: 'Lao', priority: 1 },
          { code: 'mn-MN', label: 'Mongolian', priority: 1 },
          { code: 'bo-CN', label: 'Tibetan', priority: 1 },
          { code: 'ne-NP', label: 'Nepali', priority: 1 },
          { code: 'dz-BT', label: 'Dzongkha', priority: 1 },
          { code: 'ml-IN', label: 'Malayalam', priority: 1 },
          { code: 'ta-IN', label: 'Tamil', priority: 1 },
          { code: 'te-IN', label: 'Telugu', priority: 1 },
          { code: 'kn-IN', label: 'Kannada', priority: 1 },
          { code: 'gu-IN', label: 'Gujarati', priority: 1 },
          { code: 'pa-IN', label: 'Punjabi', priority: 1 },
          { code: 'or-IN', label: 'Odia', priority: 1 },
          { code: 'as-IN', label: 'Assamese', priority: 1 },
          { code: 'mr-IN', label: 'Marathi', priority: 1 },
          { code: 'sa-IN', label: 'Sanskrit', priority: 1 },
          { code: 'sd-IN', label: 'Sindhi', priority: 1 },
          { code: 'ks-IN', label: 'Kashmiri', priority: 1 },
          { code: 'brx-IN', label: 'Bodo', priority: 1 },
          { code: 'mni-IN', label: 'Manipuri', priority: 1 },
          { code: 'doi-IN', label: 'Dogri', priority: 1 },
          { code: 'sat-IN', label: 'Santali', priority: 1 },
          { code: 'ksh-DE', label: 'Colognian', priority: 1 },
          { code: 'lb-LU', label: 'Luxembourgish', priority: 1 },
          { code: 'rm-CH', label: 'Romansh', priority: 1 },
          { code: 'fur-IT', label: 'Friulian', priority: 1 },
          { code: 'vec-IT', label: 'Venetian', priority: 1 },
          { code: 'sc-IT', label: 'Sardinian', priority: 1 },
          { code: 'lmo-IT', label: 'Lombard', priority: 1 },
          { code: 'pms-IT', label: 'Piedmontese', priority: 1 },
          { code: 'nap-IT', label: 'Neapolitan', priority: 1 },
          { code: 'scn-IT', label: 'Sicilian', priority: 1 },
          { code: 'co-FR', label: 'Corsican', priority: 1 },
          { code: 'oc-FR', label: 'Occitan', priority: 1 },
          { code: 'br-FR', label: 'Breton', priority: 1 },
          { code: 'gv-IM', label: 'Manx', priority: 1 },
          { code: 'kw-GB', label: 'Cornish', priority: 1 },
          { code: 'fo-FO', label: 'Faroese', priority: 1 },
          { code: 'kl-GL', label: 'Greenlandic', priority: 1 },
          { code: 'sm-WS', label: 'Samoan', priority: 1 },
          { code: 'to-TO', label: 'Tongan', priority: 1 },
          { code: 'fj-FJ', label: 'Fijian', priority: 1 },
          { code: 'haw-US', label: 'Hawaiian', priority: 1 },
          { code: 'mi-NZ', label: 'Maori', priority: 1 },
          { code: 'ty-PF', label: 'Tahitian', priority: 1 },
          { code: 'ceb-PH', label: 'Cebuano', priority: 1 },
          { code: 'jv-ID', label: 'Javanese', priority: 1 },
          { code: 'su-ID', label: 'Sundanese', priority: 1 },
          { code: 'ban-ID', label: 'Balinese', priority: 1 },
          { code: 'bug-ID', label: 'Buginese', priority: 1 },
          { code: 'ace-ID', label: 'Acehnese', priority: 1 },
          { code: 'min-ID', label: 'Minangkabau', priority: 1 },
          { code: 'gor-ID', label: 'Gorontalo', priority: 1 },
          { code: 'bjn-ID', label: 'Banjar', priority: 1 },
          { code: 'mad-ID', label: 'Madurese', priority: 1 },
          { code: 'sas-ID', label: 'Sasak', priority: 1 },
          { code: 'mak-ID', label: 'Makassarese', priority: 1 },
          { code: 'bem-ZM', label: 'Bemba', priority: 1 },
          { code: 'byn-ER', label: 'Blin', priority: 1 },
          { code: 'cgg-UG', label: 'Chiga', priority: 1 },
          { code: 'chr-US', label: 'Cherokee', priority: 1 },
          { code: 'crs-SC', label: 'Seselwa Creole French', priority: 1 },
          { code: 'dav-KE', label: 'Taita', priority: 1 },
          { code: 'dua-CM', label: 'Duala', priority: 1 },
          { code: 'dyo-SN', label: 'Jola-Fonyi', priority: 1 },
          { code: 'ebu-KE', label: 'Embu', priority: 1 },
          { code: 'fil-PH', label: 'Filipino', priority: 1 },
          { code: 'fur-IT', label: 'Friulian', priority: 1 },
          { code: 'guz-KE', label: 'Gusii', priority: 1 },
          { code: 'haw-US', label: 'Hawaiian', priority: 1 },
          { code: 'jgo-CM', label: 'Ngomba', priority: 1 },
          { code: 'jmc-TZ', label: 'Machame', priority: 1 },
          { code: 'kab-DZ', label: 'Kabyle', priority: 1 },
          { code: 'kam-KE', label: 'Kamba', priority: 1 },
          { code: 'ki-KE', label: 'Kikuyu', priority: 1 },
          { code: 'kln-KE', label: 'Kalenjin', priority: 1 },
          { code: 'kok-IN', label: 'Konkani', priority: 1 },
          { code: 'lag-TZ', label: 'Langi', priority: 1 },
          { code: 'luo-KE', label: 'Luo', priority: 1 },
          { code: 'luy-KE', label: 'Luyia', priority: 1 },
          { code: 'mer-KE', label: 'Meru', priority: 1 },
          { code: 'mfe-MU', label: 'Morisyen', priority: 1 },
          { code: 'naq-NA', label: 'Nama', priority: 1 },
          { code: 'nyn-UG', label: 'Nyankole', priority: 1 },
          { code: 'om-KE', label: 'Oromo', priority: 1 },
          { code: 'saq-KE', label: 'Samburu', priority: 1 },
          { code: 'seh-MZ', label: 'Sena', priority: 1 },
          { code: 'ses-ML', label: 'Koyraboro Senni', priority: 1 },
          { code: 'sbp-TZ', label: 'Sangu', priority: 1 },
          { code: 'teo-KE', label: 'Teso', priority: 1 },
          { code: 'teo-UG', label: 'Teso', priority: 1 },
          { code: 'tzm-MA', label: 'Central Atlas Tamazight', priority: 1 },
          { code: 'vun-TZ', label: 'Vunjo', priority: 1 },
          { code: 'wae-CH', label: 'Walser', priority: 1 },
          { code: 'xog-UG', label: 'Soga', priority: 1 },
          { code: 'zgh-MA', label: 'Standard Moroccan Tamazight', priority: 1 }
        ];

        // Add popular languages first
        popularLanguages.forEach(lang => {
          if (voices.some(voice => 
            voice.lang.startsWith(lang.code.split('-')[0]) || 
            voice.lang === lang.code
          )) {
            languageMap.set(lang.code, lang);
          }
        });

        // Add all other available voices
        voices.forEach(voice => {
          const langCode = voice.lang;
          if (!languageMap.has(langCode)) {
            // Try to get a nice label for the language
            const langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode.split('-')[0]);
            languageMap.set(langCode, {
              code: langCode,
              label: langName || langCode,
              priority: 2
            });
          }
        });

        // Convert to array and sort by priority and label
        const sortedLanguages = Array.from(languageMap.values())
          .sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return a.label.localeCompare(b.label);
          });

        setLanguages(sortedLanguages);

        // Set default language to first available English or first available
        const defaultLang = sortedLanguages.find(lang => 
          lang.code.startsWith('en-') || lang.code === 'en-US'
        ) || sortedLanguages[0];
        
        if (defaultLang) {
          setVoiceLang(defaultLang.code);
        }
      }
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also load when voices change
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Check if voice is available for selected language
  const isVoiceAvailable = (langCode) => {
    return availableVoices.some(voice => 
      voice.lang.startsWith(langCode.split('-')[0]) || 
      voice.lang === langCode
    );
  };

  const getWeatherTextColor = () => {
    if (!data) return 'var(--text-default)';
    const desc = data.weather[0].description.toLowerCase();
    if (desc.includes('rain')) return 'var(--text-rainy)';
    if (desc.includes('cloud')) return 'var(--text-cloudy)';
    if (desc.includes('snow')) return 'var(--text-snowy)';
    if (desc.includes('storm')) return 'var(--text-stormy)';
    if (desc.includes('fog') || desc.includes('mist')) return 'var(--text-foggy)';
    if (desc.includes('clear') || desc.includes('sun')) return 'var(--text-sunny)';
    return 'var(--text-default)';
  };

  return (
    <motion.div 
      className="current-weather"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="weather-header">
        <div className="location-info">
          <MapPin className="location-icon" />
          <h2 className="location-name">{location.name}</h2>
        </div>
        
        <div className="units-toggle">
          <button 
            className={`unit-btn ${units === 'metric' ? 'active' : ''}`}
            onClick={() => onUnitsChange('metric')}
            aria-label="Switch to Celsius"
          >
            °C
          </button>
          <button 
            className={`unit-btn ${units === 'imperial' ? 'active' : ''}`}
            onClick={() => onUnitsChange('imperial')}
            aria-label="Switch to Fahrenheit"
          >
            °F
          </button>
        </div>
        {/* Voice controls group */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '0.5rem' }}>
          <label htmlFor="voice-lang" style={{ marginRight: '0.25rem', color: 'var(--sunny-primary)', fontWeight: 600 }}>
            Voice:
          </label>
          <select
            id="voice-lang"
            value={voiceLang}
            onChange={e => setVoiceLang(e.target.value)}
            aria-label="Select voice language"
            style={{ padding: '0.25rem', borderRadius: '0.5rem', fontSize: '1rem' }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.label} {isVoiceAvailable(lang.code) ? '✅' : '❌'}
              </option>
            ))}
          </select>
          <button
            onClick={handleSpeakWeather}
            aria-label="Speak current weather"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--sunny-primary)',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '0.25rem'
            }}
          >
            <span role="img" aria-label="Speaker">🔊</span>
            <span style={{ marginLeft: '0.3rem', fontWeight: 600 }}>Speak</span>
          </button>
        </div>
      </div>

      <div className="weather-main">
        <div className="weather-icon-section">
          <div className="weather-icon">
            {getWeatherIcon(data.weather[0].icon)}
          </div>
          <p className="weather-description">
            {data.weather[0].description.charAt(0).toUpperCase() + 
             data.weather[0].description.slice(1)}
          </p>
        </div>

        <div className="temperature-section">
          <div className="current-temp">
            <span className="temp-value">
              {Math.round(data.main.temp)}
            </span>
            <span className="temp-unit">{getTemperatureUnit()}</span>
          </div>
          
          <div className="temp-range">
            <span className="temp-min">
              {Math.round(data.main.temp_min)}°
            </span>
            <span className="temp-separator">/</span>
            <span className="temp-max">
              {Math.round(data.main.temp_max)}°
            </span>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <Thermometer className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Feels like</span>
            <span className="detail-value">
              {Math.round(data.main.feels_like)}{getTemperatureUnit()}
            </span>
          </div>
        </div>

        <div className="detail-item">
          <Droplets className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{data.main.humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <Wind className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Wind</span>
            <span className="detail-value">
              {Math.round(data.wind.speed)} {getSpeedUnit()}
            </span>
          </div>
        </div>

        <div className="detail-item">
          <Eye className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">
              {(data.visibility / 1000).toFixed(1)} km
            </span>
          </div>
        </div>
      </div>

      <div className="sun-times">
        <div className="sun-item">
          <Sunrise className="sun-icon sunrise" />
          <div className="sun-content">
            <span className="sun-label">Sunrise</span>
            <span className="sun-time">
              {formatTime(data.sys.sunrise)}
            </span>
          </div>
        </div>

        <div className="sun-item">
          <Sunset className="sun-icon sunset" />
          <div className="sun-content">
            <span className="sun-label">Sunset</span>
            <span className="sun-time">
              {formatTime(data.sys.sunset)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CurrentWeather 