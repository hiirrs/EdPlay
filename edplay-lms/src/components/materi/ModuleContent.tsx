'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

interface ModuleContentProps {
  title: string;
}

export default function ModuleContent({ title }: ModuleContentProps) {
  const [openSection, setOpenSection] = useState<string | null>('section-1');

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        value={openSection || undefined}
        onValueChange={setOpenSection}
      >
        <AccordionItem
          value="section-1"
          className="border rounded-lg overflow-hidden mb-4"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            {title}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-6 min-h-[300px]">
            <div className="text-gray-700">
              {/* Content for the module would go here */}
              <p>
                Konten pembelajaran tentang penjumlahan akan ditampilkan di
                sini.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="section-2"
          className="border rounded-lg overflow-hidden mb-4"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            {title}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-6">
            <div className="text-gray-700">
              <p>
                Konten tambahan tentang penjumlahan akan ditampilkan di sini.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="section-3"
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            {title}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-6">
            <div className="text-gray-700">
              <p>Latihan soal penjumlahan akan ditampilkan di sini.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
