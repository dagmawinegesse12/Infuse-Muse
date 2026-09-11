import { createMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/system/page-header';
import { ProseSection, P, List, LegalFooterNote } from '@/components/system/prose';
import { QuietLink } from '@/components/system/quiet-link';

export const metadata = createMetadata({
  title: 'Shipping & Returns',
  description:
    'Delivery times, and how returns and refunds work at Infuse & Muse.',
  path: '/shipping-returns',
});

const UPDATED = '11 September 2026';
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@infuseandmuse.com';

export default function ShippingReturnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Service"
        title="Shipping & Returns"
        lede="How your order reaches you, and what happens if something is not right."
      />

      <div className="shell pb-[var(--chapter)]">
        <ProseSection index={0} heading="Dispatch">
          <P>
            Blends are made in small batches and packed by hand. Orders leave us within
            two business days. You will get a confirmation email as soon as payment
            succeeds.
          </P>
        </ProseSection>

        {/* Rates mirror Settings → Shipping and delivery in the Shopify admin.
            Change them there first; checkout charges what Shopify says. */}
        <ProseSection index={1} heading="Delivery">
          <List
            items={[
              'Standard — $12, 3 to 5 business days. Free on orders of $75 or more.',
              'Express — $20, 1 to 2 business days.',
              'We ship within Canada only for now.',
            ]}
          />
          <P>
            You will see the options and their cost at checkout, before you pay. Once a
            parcel is with the carrier its timing is outside our control, though we will
            always help you chase it.
          </P>
        </ProseSection>

        <ProseSection index={2} heading="Returns">
          <P>
            Tea is a consumable, so we cannot accept returns on opened tins — a matter
            of food safety rather than preference. Unopened tins in original condition
            may be returned within 14 days of delivery. Return postage is yours unless
            the fault is ours.
          </P>
        </ProseSection>

        <ProseSection index={3} heading="If something is wrong">
          <P>
            If your order arrives damaged, incorrect, or below the standard we intend,
            write to {CONTACT} within 14 days with your order reference and a photograph.
            We will replace it or refund it in full, and we will not ask you to post it
            back.
          </P>
        </ProseSection>

        <ProseSection index={4} heading="Refunds">
          <P>
            Approved refunds go back to the original payment method within 5 to 10
            business days of us receiving the return or agreeing the claim. Your bank may
            take a little longer to show it.
          </P>
        </ProseSection>

        <ProseSection index={5} heading="Cancelling">
          <P>
            An order can be cancelled for a full refund any time before it is dispatched.
            Write to us quickly and we will do our best.
          </P>
        </ProseSection>
        <hr className="rule" />

        <div className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
          <QuietLink href="/contact">Contact us</QuietLink>
          <QuietLink href="/faq">Read the FAQ</QuietLink>
        </div>

        <LegalFooterNote updated={UPDATED} />
      </div>
    </>
  );
}
