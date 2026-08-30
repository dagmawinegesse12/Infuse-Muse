import { createMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/system/page-header';
import { ProseSection, P, List, LegalFooterNote } from '@/components/system/prose';

export const metadata = createMetadata({
  title: 'Privacy Policy | Infuse & Muse',
  description: 'How Infuse & Muse collects, uses, and protects your personal information.',
  path: '/privacy',
});

const UPDATED = '29 August 2026';
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@infuseandmuse.ca';

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lede="What we collect, why we collect it, and what we never do with it."
      />

      <div className="shell pb-[var(--chapter)]">
        <ProseSection index={0} heading="Who we are">
          <P>
            Infuse &amp; Muse is a small-batch tea company based in Mississauga, Ontario,
            Canada. This policy explains how we handle personal information under
            Canada&apos;s Personal Information Protection and Electronic Documents Act
            (PIPEDA).
          </P>
        </ProseSection>

        <ProseSection index={1} heading="What we collect">
          <P>We collect only what an order or an enquiry actually requires:</P>
          <List
            items={[
              'Your name, email address, and shipping details when you place an order.',
              'Your email address alone if you join the waitlist or write to us.',
              'Order history and amounts, so we can support and fulfil your purchase.',
              'Basic, aggregated usage data about how the site is browsed.',
            ]}
          />
          <P>
            We do not see or store your card number. Payments are handled entirely by
            Stripe, and card details never reach our servers.
          </P>
        </ProseSection>

        <ProseSection index={2} heading="How we use it">
          <List
            items={[
              'To fulfil and support your order, including confirmation email.',
              'To answer the question you actually asked us.',
              'To send occasional news, only if you asked for it.',
              'To meet tax and bookkeeping obligations.',
            ]}
          />
          <P>
            We do not sell your personal information, and we do not share it for anyone
            else&apos;s advertising.
          </P>
        </ProseSection>

        <ProseSection index={3} heading="Who processes it for us">
          <P>
            A small number of service providers handle data on our behalf, each bound to
            use it only for that purpose: Stripe for payments, Resend for transactional
            email, Vercel for hosting, and Sanity for content. Each maintains its own
            privacy commitments.
          </P>
        </ProseSection>

        <ProseSection index={4} heading="How long we keep it">
          <P>
            Order records are retained for seven years to satisfy Canadian tax
            requirements. Waitlist and marketing contacts are kept until you unsubscribe,
            which you can do from any email we send. Everything else is deleted once it
            is no longer needed.
          </P>
        </ProseSection>

        <ProseSection index={5} heading="Your rights">
          <P>
            You may ask to see the personal information we hold about you, correct it,
            or have it deleted. Write to {CONTACT} and we will respond within 30 days.
            If you are unsatisfied, you may contact the Office of the Privacy
            Commissioner of Canada.
          </P>
        </ProseSection>

        <ProseSection index={6} heading="Cookies">
          <P>
            The site uses only what it needs to function — your cart, and your choice of
            light or dark theme, both stored in your own browser. We do not run
            advertising trackers or third-party profiling cookies.
          </P>
        </ProseSection>

        <ProseSection index={7} heading="Contact">
          <P>
            Questions about this policy can go to{' '}
            <a href={`mailto:${CONTACT}`} className="wipe-link text-ink">
              {CONTACT}
            </a>
            .
          </P>
        </ProseSection>
        <hr className="rule" />

        <LegalFooterNote updated={UPDATED} />
      </div>
    </>
  );
}
