import { CONTACT_EMAILS } from "../lib/ecosystem-links";

export default function ContactEmails() {
  return (
    <section className="footer-contacts" aria-labelledby="contacts-heading">
      <h3 id="contacts-heading" className="footer-contacts-heading">
        Contact
      </h3>
      <ul className="footer-contact-list">
        {CONTACT_EMAILS.map(({ address, href, label }) => (
          <li key={address} className="footer-contact-item">
            <a className="footer-contact-email" href={href}>
              {address}
            </a>
            <span className="footer-contact-label">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
