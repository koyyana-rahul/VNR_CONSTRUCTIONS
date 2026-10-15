import { Seo } from '../components/common/Seo.jsx';
import { PageHero } from '../components/common/PageHero.jsx';
import { Container } from '../components/common/Container.jsx';
import { Section } from '../components/common/Section.jsx';
import { DataNotice } from '../components/common/DataNotice.jsx';
import { ROUTES } from '../config/site.js';
import { company, hasEmail } from '../config/company.js';

/**
 * PRIVACY POLICY
 *
 * Written to describe only what this build actually does — which is why the
 * "analytics and cookies" section states plainly that no analytics or
 * advertising cookies are set. Overstating a privacy posture is as
 * misleading as inventing a phone number.
 *
 * !! The contact details inside the policy are placeholders until VNR supplies
 * !! verified information. Review this text with them before launch — see the
 * !! outstanding-items list in the README.
 */
export function PrivacyPolicy() {
  const effectiveDate = '1 January 2025';

  return (
    <>
      <Seo path={ROUTES.privacy} />

      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        lead="What happens to the information you send us, in plain language."
        breadcrumbs={[{ label: 'Home', to: ROUTES.home }, { label: 'Privacy Policy' }]}
      />

      <Section tone="white">
        <Container size="prose">
          <DataNotice tone="warning" title="Review before launch" className="mb-10">
            This policy describes how the website built here behaves. It must be
            reviewed and completed with VNR&apos;s actual legal entity,
            registered address, data-handling practices and retention periods
            before the site goes live. Contact details below are placeholders.
          </DataNotice>

          <p className="text-fine text-text-muted">Last updated: {effectiveDate}</p>

          <div className="mt-10 flex flex-col gap-8 text-lead text-text [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-h3 [&_h2]:font-bold [&_h2]:text-brand-black [&_h2]:scroll-mt-28 [&_li]:leading-relaxed">
            <section>
              <h2>1. What we collect</h2>
              <p>
                If you use the consultation form, we collect the details you
                choose to enter: your name, phone number, and optionally your
                email address, project location, project type, plot area,
                built-up area, number of floors, budget range, expected start
                date and any message you write.
              </p>
              <p>
                The cost estimator runs entirely in your browser. The figures you
                enter there are not transmitted to us and are not stored by this
                website.
              </p>
            </section>

            <section>
              <h2>2. Why we collect it</h2>
              <p>
                Solely to respond to your enquiry — to understand your project
                and arrange the next conversation. We do not sell your
                information, and we do not use it for unrelated marketing.
              </p>
            </section>

            <section>
              <h2>3. How long we keep it</h2>
              <p>
                Enquiry information is retained only for as long as needed to
                respond and to maintain a record of our discussion. Records tied
                to an executed construction contract are retained for the period
                required by applicable law and by that contract.
              </p>
            </section>

            <section>
              <h2>4. Cookies and analytics</h2>
              <p>
                This website does not set advertising cookies, does not embed
                third-party advertising trackers, and does not run behavioural
                analytics. If that changes, this section and any consent
                mechanism must be updated before the change takes effect.
              </p>
            </section>

            <section>
              <h2>5. Sharing your information</h2>
              <p>
                We share your details only with the parties necessary to respond
                to your enquiry and to deliver the work you commission — for
                example, consultants or contractors engaged on your project,
                where you have told us to proceed.
              </p>
              <p>
                We do not disclose enquiry information to third parties for
                their own marketing.
              </p>
            </section>

            <section>
              <h2>6. Where it is processed</h2>
              <p>
                Information you submit may be processed on infrastructure located
                outside your own country. Where that happens, the enquiry is
                handled under the applicable data-protection arrangements.
              </p>
            </section>

            <section>
              <h2>7. Your rights</h2>
              <p>
                You may ask to see the information we hold about you, ask for it
                to be corrected, or ask for it to be deleted. To make such a
                request, contact us using the details below and we will respond
                as promptly as we can.
              </p>
            </section>

            <section>
              <h2>8. Security</h2>
              <p>
                Information is transmitted over HTTPS and stored only on systems
                we control. No method of transmission or storage is completely
                secure, but we apply the safeguards a construction business of
                this kind reasonably can.
              </p>
            </section>

            <section>
              <h2>9. Third-party services</h2>
              <p>
                Our website may link to or hand you off to third-party services
                such as WhatsApp. Once you use those services, their own privacy
                terms apply, and we have no control over how they handle your
                information.
              </p>
            </section>

            <section>
              <h2>10. Changes to this policy</h2>
              <p>
                If this policy changes, the updated version will be published on
                this page with a revised date.
              </p>
            </section>

            <section>
              <h2>11. Contact</h2>
              <p>
                {company.name}
                {company.legalName ? ` (${company.legalName})` : ''}
                {' — '}
                {hasEmail ? (
                  <a
                    href={`mailto:${company.email.display}`}
                    className="font-semibold text-brand-gold-muted underline underline-offset-2"
                  >
                    {company.email.display}
                  </a>
                ) : (
                  <span className="text-text-muted">
                    [contact email to be added to src/config/company.js]
                  </span>
                )}
              </p>
              <p className="text-fine text-text-muted">
                [Registered address to be added to src/config/company.js]
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default PrivacyPolicy;