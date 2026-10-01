export type ServiceFaq = { question: string; answer: string }

export const serviceFaqs: Record<string, ServiceFaq[]> = {
  'quick-car-wash': [
    {
      question: 'How long does the Quick Car Wash take?',
      answer:
        'The Quick Car Wash takes approximately 30 minutes from start to finish. It is designed for busy owners who need a fast, professional clean without a long wait.',
    },
    {
      question: 'Does the Quick Car Wash include interior cleaning?',
      answer:
        'No — this service covers the exterior only: foam wash, rinse, wheel clean, and hand dry. If you also want interior cleaning, our Premium Car Wash or Prestige Car Wash are great upgrades.',
    },
    {
      question: 'Is the foam wash safe for all paint types and finishes?',
      answer:
        'Yes. We use pH-neutral, biodegradable foam products that are safe for all modern paint finishes including clear coat, matte, and wrapped vehicles.',
    },
    {
      question: 'Do I need to be present during the wash?',
      answer:
        'No — you just need to ensure the vehicle is accessible. Many customers drop off or simply leave their car parked and we get on with the job.',
    },
    {
      question: 'What if it rains shortly after the wash?',
      answer:
        'We recommend booking on dry days for best results. If rain is forecast, our team will advise rescheduling. Light rain shortly after a wash will not cause damage — the protective rinse helps water bead off.',
    },
    {
      question: 'Can I book the Quick Car Wash on the same day?',
      answer:
        'Yes, subject to availability. We often have same-day slots — just reach out via WhatsApp or the booking form to check.',
    },
  ],

  'premium-car-wash': [
    {
      question: 'What is the difference between the Quick and Premium Car Wash?',
      answer:
        'The Premium Car Wash includes everything in the Quick Wash plus interior vacuuming, dashboard and console wipe-down, window cleaning inside and out, and tire dressing. It is a much more complete refresh.',
    },
    {
      question: 'Will the service damage my leather seats?',
      answer:
        'No — we use a gentle wipe-down on leather surfaces, not steam or chemical cleaners. For deep leather conditioning, consider our Interior Detailing or Prestige Car Wash.',
    },
    {
      question: 'Will the interior be wet or damp after the service?',
      answer:
        'No. The Premium Car Wash uses dry wiping and vacuuming only — no steam or water is applied inside the car, so it is ready to drive immediately.',
    },
    {
      question: 'How long does the Premium Car Wash take?',
      answer:
        'Approximately 45 to 60 minutes depending on the vehicle size and condition.',
    },
    {
      question: 'Can I request additional areas to be cleaned?',
      answer:
        'Yes. Just let us know when you book and we will do our best to accommodate. For very specific needs, our Custom Package might be a better fit.',
    },
  ],

  'prestige-car-wash': [
    {
      question: 'What makes the Prestige Car Wash different from the Premium?',
      answer:
        'The Prestige adds leather surface conditioning, a full tire and rim detail with dressing, and a hand dry and hand buff — giving a noticeably more polished, showroom-level result compared to the Premium.',
    },
    {
      question: 'Is the Prestige Car Wash recommended for luxury and exotic cars?',
      answer:
        'Absolutely. It is our most thorough standard wash and our team is trained to handle all vehicle types including Rolls-Royce, Bentley, Ferrari, and other luxury and exotic vehicles.',
    },
    {
      question: 'What products do you use on the exterior?',
      answer:
        'We use professional-grade, pH-balanced, biodegradable foam products that are gentle on paint and protective coatings. No harsh chemicals or abrasive cloths are used.',
    },
    {
      question: 'How long does the Prestige Car Wash take?',
      answer:
        'It typically takes 1 to 1.5 hours depending on vehicle size and condition.',
    },
    {
      question: 'Will the hand buff leave swirl marks?',
      answer:
        'No. We use high-quality microfibre cloths specifically designed to avoid swirl marks during drying and buffing. For deeper paint correction, our Exterior Car Polishing service is recommended.',
    },
  ],

  'interior-detailing': [
    {
      question: 'Will my seats be wet after steam cleaning?',
      answer:
        'Seats will be slightly damp after steam extraction — typically drying within 30 to 60 minutes. We use dry steam and extraction techniques that minimise moisture while maximising cleaning power.',
    },
    {
      question: 'Can interior detailing remove pet hair?',
      answer:
        'Yes. Our vacuuming, extraction, and steam tools are highly effective at removing pet hair from fabric seats, carpets, and hard-to-reach areas.',
    },
    {
      question: 'What is the difference between a standard car wash and interior detailing?',
      answer:
        'A standard wash cleans surfaces. Interior detailing goes much deeper — using steam sanitation, chemical extraction, leather conditioning, and UV protection to restore and protect every surface inside the cabin.',
    },
    {
      question: 'Is steam safe for my dashboard and electronics?',
      answer:
        'Yes. We use controlled dry steam that is applied carefully around electronics and sensitive surfaces. Our technicians are trained to work safely with all modern vehicle interiors.',
    },
    {
      question: 'How often should I book interior detailing?',
      answer:
        'For daily drivers, every 3 to 6 months is recommended. In Dubai\'s climate — with heat, dust, and AC use — more frequent detailing keeps your interior in top condition and protects against long-term deterioration.',
    },
    {
      question: 'Can you remove cigarette smoke odours?',
      answer:
        'Yes. Steam sanitation combined with our deodorising treatment significantly reduces and often eliminates smoke odours. Severe cases may require a second treatment.',
    },
  ],

  'exterior-car-polishing': [
    {
      question: 'What types of scratches can polishing remove?',
      answer:
        'Machine polishing removes surface-level scratches, swirl marks, water spots, and light oxidation. Deep scratches that have penetrated the base coat or primer cannot be fully corrected by polishing and may require paint touch-up.',
    },
    {
      question: 'Will machine polishing damage my paint?',
      answer:
        'No — we use professional dual-action polishers that are safe for all modern clear coats. Unlike single-action rotary machines, dual-action polishers dramatically reduce the risk of heat damage or buffer trails.',
    },
    {
      question: 'How long does the paint sealant last?',
      answer:
        'The sealant we apply typically lasts 3 to 6 months with regular washing. Avoid harsh pressure washing directly after application and wash with pH-neutral shampoo to extend the protection.',
    },
    {
      question: 'Can I wash my car immediately after polishing?',
      answer:
        'We recommend waiting at least 24 to 48 hours after polishing before washing, to allow the sealant to fully cure and bond to the paint surface.',
    },
    {
      question: 'Is polishing the same as waxing?',
      answer:
        'No. Polishing uses abrasive compounds to correct and refine the paint surface. Waxing or sealing adds a protective layer on top. We always apply sealant after polishing for a complete result.',
    },
    {
      question: 'Can you polish a matte or satin finish car?',
      answer:
        'No — conventional machine polishing is for gloss finishes only. Polishing a matte finish will destroy the texture. We have specialist matte-safe products — contact us to discuss your specific vehicle.',
    },
  ],

  'custom-package': [
    {
      question: 'How do I get a quote for a custom package?',
      answer:
        'Simply contact us via WhatsApp or phone, describe your vehicle and what you need, and we will respond with a personalised quote within minutes. No obligation.',
    },
    {
      question: 'What types of custom services can you combine?',
      answer:
        'Any combination of our services — interior detailing, exterior polishing, engine bay cleaning, headlight restoration, paint protection, or specialist treatments. We will build a package tailored to your exact requirements.',
    },
    {
      question: 'Do you offer fleet services for businesses?',
      answer:
        'Yes. We work with businesses across Dubai to provide regular fleet washing and detailing. Fleet clients receive preferential scheduling, consistent service standards, and competitive pricing.',
    },
    {
      question: 'Is there a minimum booking size for a custom package?',
      answer:
        'No minimum for individual vehicles. Fleet packages typically require a minimum of 3 vehicles to qualify for fleet pricing.',
    },
    {
      question: 'Can I set up a recurring custom service schedule?',
      answer:
        'Absolutely. We can arrange weekly, fortnightly, or monthly visits tailored to your schedule. Many of our business and residential clients have standing recurring bookings.',
    },
  ],

  'full-detailing-polishing': [
    {
      question: 'What exactly is included in the Full Detailing + Polishing bundle?',
      answer:
        'You get our complete Interior Detailing service (steam sanitation, leather conditioning, carpet extraction, AC vent cleaning, UV protection) combined with our full Exterior Car Polishing service (clay bar, multi-stage machine polish, swirl removal, paint sealant) — all in one visit.',
    },
    {
      question: 'How long does the full bundle take?',
      answer:
        'Typically 5 to 6 hours. We recommend booking early in the morning so the service completes by early afternoon. Our team will notify you when they are done.',
    },
    {
      question: 'Why is the bundle price lower than booking the two services separately?',
      answer:
        'When booked together, we save on travel time, setup, and resource allocation — and we pass those savings directly to you. You get both services for AED 700 instead of AED 848 (AED 349 + AED 499).',
    },
    {
      question: 'Is this the best service to book before selling my car?',
      answer:
        'Yes — the Full Detailing + Polishing bundle is our most popular pre-sale service. A fully detailed and polished car presents significantly better and often achieves a higher resale value.',
    },
    {
      question: 'How often should I book the full bundle?',
      answer:
        'Once or twice a year is ideal for well-maintained vehicles. Some enthusiasts book it quarterly. We also recommend it after long road trips, before major events, or after the rainy or dusty season.',
    },
    {
      question: 'Do I need to stay at home the entire time?',
      answer:
        'No. Just be available at the start for a brief vehicle inspection and at the end to review the result. In between, you are free to go about your day — we will message you when we are finishing up.',
    },
  ],
}
