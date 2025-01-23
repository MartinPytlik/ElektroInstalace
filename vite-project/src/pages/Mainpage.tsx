import { useState, useEffect } from 'react';
import '../App.css';
import Logo from '../Logo.png';
import IconTel from '../PhoneIcon.png';
import iconEmail from '../EmailIcon.png';
import ZasuvkaIcon from '../ZasuvkaIcon.png';
import Sipka from '../Sipka.png';
import Gradient from '../Gradient.png';

// Definuj typ pro produkty
interface Product {
  id: string;
  nazev: string;
  popis: string;
  obrazky: string[];
}

function App() {
  const [showAll, setShowAll] = useState(false); // Stav pro zobrazení všech zakázek
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [productsData, setProductsData] = useState<Product[]>([]); // Stav pro produkty
  const [isLoading, setIsLoading] = useState<boolean>(true); // Stav pro načítání dat

  // Načtení dat z db.json
  useEffect(() => {
    fetch('/db.json')
      .then((response) => response.json())
      .then((data) => {
        setProductsData(data.products);
        setIsLoading(false); // Po načtení dat nastavíme isLoading na false
      })
      .catch((error) => {
        console.error('Chyba při načítání dat:', error);
        setIsLoading(false); // I v případě chyby nastavíme isLoading na false
      });
  }, []);

  const toggleMenu = () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    hamburger?.classList.toggle('active');
    nav?.classList.toggle('active');
  };

  // Přidáme funkci pro zavření menu
  const closeMenu = () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    hamburger?.classList.remove('active');
    nav?.classList.remove('active');
  };

  return (
    <>
      <div style={{position: 'relative', overflow: 'hidden'}}>
        <img src={Gradient} alt="" id="GradientImg" />
        <header>
          <div className="header-container">
            <div className="hamburger" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <nav>
              <ul>
                <li><a href="#sluzby" onClick={closeMenu}>Služby</a></li>
                <li><a href="#ukazky-praci" onClick={closeMenu}>Ukázky prací</a></li>
                <li><a href="#kontakt" onClick={closeMenu}>Kontakt</a></li>
              </ul>
            </nav>
          </div>
          <div className="hero">
            <div className="logo">
              <img id="Logo" src={Logo} alt="ALD elektroinstalace" />
              <h1>ALD elektroinstalace</h1>
            </div>
            <div className="contact-wrapper">
              <div className="KonktHeader">
                <div className='contact-links'>
                  <div>
                    <a href="mailto:levy@rokytnice.cz" className="email-link" id="email1">
                      <span className="email-icon">
                        <img src={iconEmail} alt="Email icon" />
                      </span>
                      <span className="email-text">levy@rokytnice.cz</span>
                    </a>
                  </div>
                  <div>
                    <a href="tel:+420774448804" className="phone-link" id="phone1">
                      <span className="phone-icon">
                        <img src={IconTel} alt="Phone icon" />
                      </span>
                      <span className="phone-text">+420 774 448 804</span>
                    </a>
                  </div>
                </div>
                <a href="#kontakt" className="button">Kontaktujte nás!</a>
              </div>
            </div>
          </div>
        </header>

        <main>
          <section id="sluzby">
            <h2 className="Nadpis">POSKYTUJEME</h2>
            <div className="services">
              <div className="service">
                <img src={ZasuvkaIcon} className="ZasuvkaIcon" alt="ZasuvkaIcon" />
                <h3>Úpravy a opravy stávající elektroinstalace</h3>
                <p>Provádíme kompletní revize, opravy a modernizace stávajících elektrických rozvodů. Zajistíme bezpečný provoz a optimální funkčnost vaší elektroinstalace.</p>
              </div>
              <div className="service">
                <img src={ZasuvkaIcon} className="ZasuvkaIcon" alt="ZasuvkaIcon" />
                <h3>Rozvod nové elektroinstalace</h3>
                <p>Realizujeme kompletní elektroinstalace na klíč v novostavbách i při rekonstrukcích. Od návrhu až po finální zapojení, včetně rozvaděčů a zabezpečovacích systémů.</p>
              </div>
              <div className="service">
                <img src={ZasuvkaIcon} className="ZasuvkaIcon" alt="ZasuvkaIcon" />
                <h3>Úpravy ve stávajících interiérech</h3>
                <p>Specializujeme se na citlivé úpravy elektroinstalace v obývaných prostorech. Minimalizujeme zásahy do interiéru při zachování maximální funkčnosti a bezpečnosti.</p>
              </div>
            </div>
          </section>

          <section id="ukazky-praci">
            <div id="OvladaniSluzby">
              <span className="arrow-text" onClick={() => setCurrentProductIndex((prevIndex) => prevIndex === 0 ? productsData.length - 1 : prevIndex - 1)}>
                <img src={Sipka} alt="Šipka" id="SipkaRotate" />
                <span>předchozí zakázka</span>
              </span>

              <h2 className="Nadpis">UKÁZKY PRACÍ</h2>

              <span className="arrow-text" onClick={() => setCurrentProductIndex((prevIndex) => prevIndex === productsData.length - 1 ? 0 : prevIndex + 1)}>
                <span>další zakázka</span>
                <img src={Sipka} alt="Šipka" />
              </span>
            </div>
            <div id="Popis">
  <div className="gallery">
    {isLoading ? (
      <div>Načítání...</div>
    ) : productsData.length === 0 ? (
      <div>Žádné zakázky k dispozici</div>
    ) : (
      (showAll ? productsData : [productsData[currentProductIndex]]).map((product) => (
        <div key={product.id}>
          <div className="gallery">
            {product.obrazky.map((imgSrc, index) => (
              <div key={index} className="gallery-item">
                {/* Opravený způsob zobrazení obrázku */}
                <img src={`/uploads/${imgSrc}`} alt={product.nazev} />
              </div>
            ))}
          </div>
          <h3>{product.nazev}</h3>
          <p>{product.popis}</p>
        </div>
      ))
    )}
  </div>
</div>

            <div className="BtnContainer">
              <button id="ZobrazitVseBtn" className='button' onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Zobrazit méně' : 'Zobrazit vše'}
              </button>
            </div>
          </section>

          <section id="kontakt">
            <h2 className="Nadpis">KONTAKTUJTE NÁS!</h2>
            <div className="contact">
              <div className="contact-left">
                <p><strong>ALD elektroinstalace s.r.o.</strong></p>
                <p>Zahradní 251,<br />517 61 Rokytnice v Orlických horách</p>
              </div>
              <div className="contact-right">
                <a href="mailto:levy@rokytnice.cz" className="email-link odkaz">
                  <span className="email-icon">
                    <img src={iconEmail} alt="Email icon" />
                  </span>
                  <span className="email-text">levy@rokytnice.cz</span>
                </a>
                <p>
                  <div className="phone-link">
                    <span className="phone-icon">
                      <img src={IconTel} alt="Phone icon" />
                    </span>
                    <div className="tel-container">
                    <a href="tel:+420774448804" className="phone-text odkaz">+420 774 448 804</a>
                    <a href="tel:+420777081860" className="phone-text odkaz">+420 777 081 860</a>
                    </div>
                  </div>
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <div className="footer-container">
            <div className="footer-logo">
              <img src={Logo} alt="ALD elektroinstalace" />
            </div>
            <div className="footer-links">
              <a href="#">Služby</a>
              <a href="#">Ukázka prací</a>
              <a href="#">Kontakt</a>
            </div>
            <div className="FooterAdresa">
              <h5>ALD elektroinstalace s.r.o.</h5>
              <p>Zahradní 251 <br />517 61 Rokytnice v Orlických horách</p>
              <p>IČO: 17379105</p>
            </div>
            <div className="footer-social">
              <a href="mailto:levy@rokytnice.cz" className="contact-email">
                <span className="contact-email-icon">
                  <img src={iconEmail} alt="Email icon" />
                </span>
                <span className="contact-email-text">levy@rokytnice.cz</span>
              </a>
              <p>
                <a href="tel:+420774448804" className="contact-phone">
                  <span className="contact-phone-icon">
                    <img src={IconTel} alt="Phone icon" />
                  </span>
                  <span className="contact-phone-text">+420 774 448 804</span>
                </a>
              </p>
            </div>
          </div>
        </footer>
        <div id="CreaterTag">
          <p>© 2025 | <a href="https://ondrejkrejci.com" className="odkaz">Ondřej Krejčí</a> & Martin Pytlík</p>
        </div>
      </div>
    </>
  );
}

export default App;
