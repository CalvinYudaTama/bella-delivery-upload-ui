'use client';

import React from 'react';

export const DeliveryActions: React.FC = () => {
  const actions = [
    {
      title: 'Order More Staging',
      description: 'New project? Get 10% off your next order',
      cta: 'Get New Order',
    },
    {
      title: 'Generate Public Page',
      description: 'Create your listing page in minutes',
      cta: 'Create Now',
    },
    {
      title: 'Get Support',
      description: 'Questions about your delivery?',
      cta: 'Contact Now',
    },
  ];

  return (
    <section className="flex items-center gap-5">
      {actions.map((action) => (
        <div
          key={action.title}
          className="flex flex-1 flex-col gap-5 self-stretch rounded-2xl bg-[#BC9353] p-5 text-white"
        >
          <h3 className="text-lg font-semibold">{action.title}</h3>
          <p className="text-sm">{action.description}</p>
          <button className="mt-auto rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#BC9353]">
            {action.cta}
          </button>
        </div>
      ))}
    </section>
  );
};

