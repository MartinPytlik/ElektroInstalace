import React, { useState, useEffect } from 'react';
import '../App.css';
import Logo from '../Logo.png';
import IconTel from '../PhoneIcon.png';
import iconEmail from '../EmailIcon.png';
import ZasuvkaIcon from '../ZasuvkaIcon.png';
import Sipka from '../Sipka.png';
import Gradient from '../Gradient.png';
import PraceImg1 from '../PraceImg1.png';
import PraceImg2 from '../PraceImg2.png';
import PraceImg3 from '../PraceImg3.png';

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

  return (
    <>
      <div id="">
        <img src={Gradient} alt="" id="GradientImg" />
        <header>
          <div className="header-container">
            <nav>
              <ul>
                <li><a href="#sluzby">Služby</a></li>
                <li><a href="#ukazky-praci">Ukázky prací</a></li>
                <li><a href="#kontakt">Kontakt</a></li>
              </ul>
            </nav>
          </div>
          <div className="hero">
            <div className="logo">
              <img id="Logo" src={Logo} alt="ALD elektroinstalace" />
              <h1>ALD elektroinstalace</h1>
            </div>
            <div className="KonktHeader">
              <p>
                <a href="mailto:levy@rokytnice.cz" className="email-link" id="email1">
                  <span className="email-icon">
                    <img src={iconEmail} alt="Email icon" />
                  </span>
                  <span className="email-text">levy@rokytnice.cz</span>
                </a>
              </p>
              <p>
                <a href="tel:+420774448804" className="phone-link" id="phone1">
                  <span className="phone-icon">
                    <img src={IconTel} alt="Phone icon" />
                  </span>
                  <span className="phone-text">+420 774 448 804</span>
                </a>
              </p>
              <a href="#kontakt" className="button">Kontaktujte nás!</a>
            </div>
          </div>
        </header>

        <main>
          <section id="sluzby">
            <h2 className="Nadpis">POSKYTUJEME</h2>
            <div className="services">
              <div className="service">
                <img src={ZasuvkaIcon} className="ZasuvkaIcon" alt="ZasuvkaIcon" />
                <h3>Úpravy o opravy stávající elektroinstalace</h3>
                <p>Po inspekci stavu stávající elektroinstalace vyhodnotíme nejlepší možné řešení v daném případě.</p>
              </div>
              <div className="service">
                <img src={ZasuvkaIcon} className="ZasuvkaIcon" alt="ZasuvkaIcon" />
                <h3>Rozvod nové elektroinstalace</h3>
                <p>Po inspekci stavu stávající elektroinstalace vyhodnotíme nejlepší možné řešení v daném případě.</p>
              </div>
              <div className="service">
                <img src={ZasuvkaIcon} className="ZasuvkaIcon" alt="ZasuvkaIcon" />
                <h3>Úpravy ve stávajících interiérech</h3>
                <p>Po inspekci stavu stávající elektroinstalace vyhodnotíme nejlepší možné řešení v daném případě.</p>
              </div>
            </div>
          </section>

          <section id="ukazky-praci">
            <h2 className="Nadpis">UKÁZKY PRACÍ</h2>
            <div id="Popis">
  <div className="gallery">
    {productsData.length === 0 ? (
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


            <div id="OvladaniSluzby">
              <span className="arrow-text" onClick={() => setCurrentProductIndex((prevIndex) => prevIndex === 0 ? productsData.length - 1 : prevIndex - 1)}>
                <img src={Sipka} alt="Šipka" id="SipkaRotate" />
                <span>předchozí zakázka</span>
              </span>

              <span className="arrow-text" onClick={() => setCurrentProductIndex((prevIndex) => prevIndex === productsData.length - 1 ? 0 : prevIndex + 1)}>
                další zakázka
                <img src={Sipka} alt="Šipka" />
              </span>
            </div>

            <div className="BtnContainer">
              <button id="ZobrazitVseBtn" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Zobrazit méně' : 'Zobrazit více'}
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
                <a href="mailto:levy@rokytnice.cz" className="email-link">
                  <span className="email-icon">
                    <img src={iconEmail} alt="Email icon" />
                  </span>
                  <span className="email-text">levy@rokytnice.cz</span>
                </a>
                <p>
                  <a href="tel:+420774448804" className="phone-link">
                    <span className="phone-icon">
                      <img src={IconTel} alt="Phone icon" />
                    </span>
                    <span className="phone-text">+420 774 448 804</span>
                  </a>
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
          <p>@ 2024 | Ondřej Krejčí │ Martin Pytlík</p>
        </div>
      </div>
    </>
  );
}

export default App;
