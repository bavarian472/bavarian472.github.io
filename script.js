/* ==========================================
   Portfolio Website - Custom JavaScript
   Clientseitige Programmierung
   Hochschule München
   
   Dieses Skript enthält:
   1. Dynamische Tageszeit-Begrüßung
   2. Formularvalidierung mit 3+ Prüfungen
   3. Zeichenzähler für Textarea
   4. Erfolgsmeldung nach Formularabsenden
   5. Smooth Scroll Verbesserungen
   ========================================== */

/**
 * Event Listener für DOM Content Loaded
 * Stellt sicher, dass das DOM vollständig geladen ist
 * bevor JavaScript-Code ausgeführt wird
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio Website geladen');
    
    // Initialisiere alle Funktionen
    initGreeting();
    initFormValidation();
    initCharacterCounter();
    initSmoothScroll();
    initProgressBars();
});

/* ==========================================
   1. DYNAMISCHE TAGESZEIT-BEGRÜSSUNG
   Zeigt eine personalisierte Begrüßung basierend
   auf der aktuellen Tageszeit an
   ========================================== */

/**
 * Initialisiert die dynamische Begrüßung
 * Wird auf der Startseite angezeigt
 */
function initGreeting() {
    // Prüfe ob die Greeting-Elemente existieren (nur auf Startseite)
    const greetingElement = document.getElementById('greeting');
    const timeElement = document.getElementById('current-time');
    
    if (!greetingElement || !timeElement) {
        return; // Elemente existieren nicht, Funktion beenden
    }
    
    // Setze initiale Werte
    updateGreeting();
    updateTime();
    
    // Aktualisiere die Zeit jede Sekunde
    setInterval(updateTime, 1000);
}

/**
 * Aktualisiert die Begrüßung basierend auf der Tageszeit
 */
function updateGreeting() {
    const greetingElement = document.getElementById('greeting');
    const now = new Date();
    const hour = now.getHours();
    
    let greeting = '';
    let icon = '';
    
    // Bestimme Begrüßung basierend auf Uhrzeit
    if (hour >= 5 && hour < 12) {
        greeting = 'Guten Morgen!';
        icon = '🌅';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Guten Tag!';
        icon = '☀️';
    } else if (hour >= 18 && hour < 22) {
        greeting = 'Guten Abend!';
        icon = '🌆';
    } else {
        greeting = 'Gute Nacht!';
        icon = '🌙';
    }
    
    // Setze den Text mit Animation
    greetingElement.style.opacity = '0';
    
    setTimeout(() => {
        greetingElement.textContent = `${icon} ${greeting}`;
        greetingElement.style.opacity = '1';
    }, 300);
}

/**
 * Aktualisiert die aktuelle Uhrzeit
 */
function updateTime() {
    const timeElement = document.getElementById('current-time');
    
    if (!timeElement) return;
    
    const now = new Date();
    
    // Formatiere die Zeit im deutschen Format (HH:MM:SS)
    const timeString = now.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    timeElement.textContent = timeString;
}

/* ==========================================
   2. FORMULARVALIDIERUNG
   Clientseitige Validierung des Kontaktformulars
   mit mindestens 3 Prüfungen:
   - Pflichtfelder (Name, E-Mail, Nachricht, Betreff)
   - E-Mail-Format
   - Mindestlänge der Nachricht
   - Telefonnummer-Format (optional)
   - Datenschutz-Checkbox
   ========================================== */

/**
 * Initialisiert die Formularvalidierung
 */
function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    // Prüfe ob das Formular existiert (nur auf Kontaktseite)
    if (!form) {
        return;
    }
    
    // Füge Event Listener für Form Submit hinzu
    form.addEventListener('submit', handleFormSubmit);
    
    // Füge Event Listener für Echtzeit-Validierung hinzu
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Entferne Fehlermeldung beim Tippen
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
}

/**
 * Behandelt das Absenden des Formulars
 * @param {Event} event - Das Submit-Event
 */
function handleFormSubmit(event) {
    // Verhindere Standard-Formular-Submit
    event.preventDefault();
    event.stopPropagation();
    
    const form = event.target;
    
    // Validiere alle Felder
    const isValid = validateForm(form);
    
    if (isValid) {
        // Formular ist valide - zeige Erfolgsmeldung
        showSuccessMessage();
        
        // Setze Formular zurück nach 2 Sekunden
        setTimeout(() => {
            form.reset();
            form.classList.remove('was-validated');
        }, 2000);
    } else {
        // Formular ist nicht valide
        form.classList.add('was-validated');
        
        // Scrolle zum ersten Fehler
        const firstError = form.querySelector('.is-invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
}

/**
 * Validiert das gesamte Formular
 * @param {HTMLFormElement} form - Das zu validierende Formular
 * @returns {boolean} - True wenn valide, false sonst
 */
function validateForm(form) {
    let isValid = true;
    
    // Validierung 1: Name (Pflichtfeld)
    const nameInput = form.querySelector('#name');
    if (!validateRequired(nameInput)) {
        isValid = false;
    }
    
    // Validierung 2: E-Mail (Pflichtfeld + Format)
    const emailInput = form.querySelector('#email');
    if (!validateEmail(emailInput)) {
        isValid = false;
    }
    
    // Validierung 3: Betreff (Pflichtfeld)
    const subjectInput = form.querySelector('#subject');
    if (!validateRequired(subjectInput)) {
        isValid = false;
    }
    
    // Validierung 4: Nachricht (Pflichtfeld + Mindestlänge)
    const messageInput = form.querySelector('#message');
    if (!validateMessage(messageInput)) {
        isValid = false;
    }
    
    // Validierung 5: Telefon (Optional, aber Format prüfen wenn ausgefüllt)
    const phoneInput = form.querySelector('#phone');
    if (phoneInput.value && !validatePhone(phoneInput)) {
        isValid = false;
    }
    
    // Validierung 6: Datenschutz-Checkbox (Pflichtfeld)
    const privacyCheckbox = form.querySelector('#privacy');
    if (!validateRequired(privacyCheckbox)) {
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validiert ein einzelnes Feld
 * @param {HTMLElement} field - Das zu validierende Feld
 * @returns {boolean} - True wenn valide, false sonst
 */
function validateField(field) {
    const fieldType = field.type;
    const fieldId = field.id;
    
    switch(fieldId) {
        case 'email':
            return validateEmail(field);
        case 'phone':
            return field.value === '' || validatePhone(field);
        case 'message':
            return validateMessage(field);
        default:
            return validateRequired(field);
    }
}

/**
 * Prüft ob ein Pflichtfeld ausgefüllt ist
 * @param {HTMLElement} field - Das zu prüfende Feld
 * @returns {boolean} - True wenn ausgefüllt, false sonst
 */
function validateRequired(field) {
    const value = field.value.trim();
    const isValid = value !== '';
    
    if (field.type === 'checkbox') {
        const isChecked = field.checked;
        setFieldValidity(field, isChecked);
        return isChecked;
    }
    
    setFieldValidity(field, isValid);
    return isValid;
}

/**
 * Prüft ob eine E-Mail-Adresse ein gültiges Format hat
 * @param {HTMLInputElement} field - Das E-Mail-Feld
 * @returns {boolean} - True wenn gültig, false sonst
 */
function validateEmail(field) {
    const value = field.value.trim();
    
    // Prüfe zuerst ob Feld ausgefüllt ist
    if (value === '') {
        setFieldValidity(field, false);
        return false;
    }
    
    // Regulärer Ausdruck für E-Mail-Validierung
    // Erlaubt: name@domain.tld
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    
    setFieldValidity(field, isValid);
    return isValid;
}

/**
 * Prüft ob eine Telefonnummer ein gültiges Format hat
 * @param {HTMLInputElement} field - Das Telefon-Feld
 * @returns {boolean} - True wenn gültig, false sonst
 */
function validatePhone(field) {
    const value = field.value.trim();
    
    // Wenn leer, ist es valide (optionales Feld)
    if (value === '') {
        setFieldValidity(field, true);
        return true;
    }
    
    // Regulärer Ausdruck für Telefonnummer
    // Erlaubt: Zahlen, Leerzeichen, +, -, (, )
    const phoneRegex = /^[0-9\s\+\-\(\)]+$/;
    const isValid = phoneRegex.test(value) && value.length >= 5;
    
    setFieldValidity(field, isValid);
    return isValid;
}

/**
 * Prüft ob die Nachricht die Mindestlänge erfüllt
 * @param {HTMLTextAreaElement} field - Das Nachricht-Feld
 * @returns {boolean} - True wenn gültig, false sonst
 */
function validateMessage(field) {
    const value = field.value.trim();
    const minLength = 10;
    
    // Prüfe ob ausgefüllt und Mindestlänge erreicht
    const isValid = value.length >= minLength;
    
    setFieldValidity(field, isValid);
    return isValid;
}

/**
 * Setzt die Validitäts-Klassen eines Feldes
 * @param {HTMLElement} field - Das Feld
 * @param {boolean} isValid - Ob das Feld valide ist
 */
function setFieldValidity(field, isValid) {
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
}

/**
 * Zeigt die Erfolgsmeldung an
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    
    if (!successMessage) return;
    
    // Zeige Nachricht
    successMessage.classList.remove('d-none');
    
    // Scrolle zur Nachricht
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Verstecke Nachricht nach 5 Sekunden
    setTimeout(() => {
        successMessage.classList.add('d-none');
    }, 5000);
}

/* ==========================================
   3. ZEICHENZÄHLER FÜR TEXTAREA
   Zeigt die Anzahl der eingegebenen Zeichen an
   ========================================== */

/**
 * Initialisiert den Zeichenzähler für die Nachricht
 */
function initCharacterCounter() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    // Prüfe ob Elemente existieren
    if (!messageField || !charCount) {
        return;
    }
    
    // Setze maximale Zeichenanzahl
    const maxChars = 500;
    messageField.setAttribute('maxlength', maxChars);
    
    // Aktualisiere Zähler bei Eingabe
    messageField.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;
        
        // Ändere Farbe bei Annäherung an Maximum
        if (currentLength > maxChars * 0.9) {
            charCount.style.color = 'var(--warning)';
        } else if (currentLength === maxChars) {
            charCount.style.color = 'var(--error)';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    });
}

/* ==========================================
   4. SMOOTH SCROLL VERBESSERUNGEN
   Verbessert das Scroll-Verhalten für Links
   ========================================== */

/**
 * Initialisiert smooth scrolling für interne Links
 */
function initSmoothScroll() {
    // Finde alle Links die mit # beginnen
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Ignoriere leere Hashes
            if (targetId === '#' || targetId === '#!') {
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Scrolle zum Element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Setze Focus für Barrierefreiheit
                targetElement.focus();
            }
        });
    });
}

/* ==========================================
   5. PROGRESS BAR ANIMATION
   Animiert die Skill-Balken beim Laden
   ========================================== */

/**
 * Initialisiert die Animation der Progress Bars
 */
function initProgressBars() {
    // Intersection Observer für lazy loading der Animationen
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressBars.length === 0) {
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.style.width;
                
                // Setze initiale Breite auf 0
                progressBar.style.width = '0';
                
                // Animiere zur Zielbreite
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 100);
                
                // Beobachte Element nicht mehr
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Beobachte alle Progress Bars
    progressBars.forEach(bar => observer.observe(bar));
}

/* ==========================================
   6. ZUSÄTZLICHE UTILITY FUNKTIONEN
   ========================================== */

/**
 * Zeigt eine Toast-Benachrichtigung (Bootstrap Toast)
 * @param {string} message - Die Nachricht
 * @param {string} type - Der Typ (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    // Diese Funktion könnte für zukünftige Erweiterungen verwendet werden
    console.log(`Toast (${type}): ${message}`);
}

/**
 * Debounce Funktion - verzögert die Ausführung
 * Nützlich für Performance bei Events wie Scroll oder Resize
 * @param {Function} func - Die zu verzögernde Funktion
 * @param {number} wait - Wartezeit in Millisekunden
 * @returns {Function} - Die debounced Funktion
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Prüft ob der Nutzer ein mobiles Gerät verwendet
 * @returns {boolean} - True wenn mobil, false sonst
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}

/* ==========================================
   7. CONSOLE BRANDING
   Zeigt eine Nachricht in der Browser-Konsole
   ========================================== */
console.log('%c👋 Portfolio Website', 'color: #4F46E5; font-size: 24px; font-weight: bold;');
console.log('%cClientseitige Programmierung - Hochschule München', 'color: #6B7280; font-size: 14px;');
console.log('%cWintersemester 2025', 'color: #6B7280; font-size: 12px;');

/* ==========================================
   ENDE DER DATEI
   ========================================== */