import { createMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/system/page-header';
import { ProseSection, P, List, LegalFooterNote } from '@/components/system/prose';

export const metadata = createMetadata({
  title: 'Terms of Service | Infuse & Muse',
  description: 'The terms that apply when you buy from Infuse & Muse.',
  path: '/terms',
});

const UPDATED = '29 August 2026';
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@infuseandmuse.ca';

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        lede="The agreement between you and Infuse & Muse when you order from this site."
      />

      <div className="shell pb-[var(--chapter)]">
        <ProseSection index={0} heading="Using this site">
          <P>
            By browsing or ordering from infuseandmuse.ca you accept these terms. If you
            do not accept them, please do not use the site. You must be the age of
            majority in your province to place an order.
          </P>
        </ProseSection>

        <ProseSection index={1} heading="Products and description">
          <P>
            We describe each blend as accurately as we can, including its ingredients and
            caffeine level. Because tea is an agricultural product, colour, aroma and
            harvest character vary between batches. Photography is representative rather
            than exact.
          </P>
        </ProseSection>

        <ProseSection index={2} heading="Prices and payment">
          <P>
            All prices are in Canadian dollars and exclude applicable taxes, which are
            calculated at checkout. Payment is processed by Stripe. We may change prices
            at any time, but never after an order is confirmed.
          </P>
          <P>
            If an item is mispriced through obvious error, we may cancel the order and
            refund you in full rather than fulfil it at that price.
          </P>
        </ProseSection>

        <ProseSection index={3} heading="Orders">
          <P>
            Your order is an offer to buy. It is accepted when we send your confirmation
            email. We may decline an order — for example if stock has run out or we
            cannot verify payment — and will refund you in full where that happens.
          </P>
        </ProseSection>

        <ProseSection index={4} heading="Food safety and allergens">
          <P>
            Our blends are prepared in a kitchen that also handles nuts, dairy and
            gluten, so we cannot guarantee the absence of traces. Ingredients are listed
            on every product page. Our teas are food, not medicine: nothing here is a
            health claim, and if you are pregnant, nursing, or taking medication, speak
            to a healthcare professional before use.
          </P>
        </ProseSection>

        <ProseSection index={5} heading="Returns">
          <P>
            Because tea is a consumable, returns are limited. Our full position is set
            out in the Shipping &amp; Returns policy, which forms part of these terms.
          </P>
        </ProseSection>

        <ProseSection index={6} heading="Intellectual property">
          <P>
            The Infuse &amp; Muse name, crest, artwork, photography and written content
            belong to us and may not be reproduced without written permission.
          </P>
        </ProseSection>

        <ProseSection index={7} heading="Limits of liability">
          <P>
            To the extent the law allows, our liability for any order is limited to the
            amount you paid for it. Nothing here limits liability that cannot legally be
            limited.
          </P>
        </ProseSection>

        <ProseSection index={8} heading="Governing law">
          <P>
            These terms are governed by the laws of the Province of Ontario and the
            federal laws of Canada that apply there.
          </P>
          <List items={[`Questions: ${CONTACT}`]} />
        </ProseSection>
        <hr className="rule" />

        <LegalFooterNote updated={UPDATED} />
      </div>
    </>
  );
}
