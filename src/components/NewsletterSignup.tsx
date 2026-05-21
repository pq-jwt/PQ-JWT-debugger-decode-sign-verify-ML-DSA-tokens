import { BUTTONDOWN_SUBSCRIBE_ACTION } from "../lib/ecosystem-links";

export default function NewsletterSignup() {
  return (
    <section className="footer-newsletter" aria-labelledby="newsletter-heading">
      <h3 id="newsletter-heading" className="footer-newsletter-heading">
        PQ-JWT updates
      </h3>
      <p className="footer-newsletter-hint">
        Email only — no JWTs or keys are submitted with this form.
      </p>
      <form
        className="footer-newsletter-form"
        action={BUTTONDOWN_SUBSCRIBE_ACTION}
        method="post"
        target="_blank"
        rel="noopener noreferrer"
      >
        <input type="email" name="email" placeholder="you@company.com" required autoComplete="email" />
        <button type="submit" className="btn-primary footer-newsletter-btn">
          Get PQ-JWT updates
        </button>
      </form>
    </section>
  );
}
