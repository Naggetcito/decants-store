"use client";

import { useRef } from "react";
import {
  m,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface Step {
  title: string;
  text: string;
}

function StepItem({
  step,
  index,
  total,
  progress,
}: {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const opacity = useTransform(progress, [start, start + 0.18], [0.25, 1]);

  return (
    <li className="flex gap-6 py-8 pl-8 md:gap-10 md:pl-10">
      <m.span
        aria-hidden="true"
        style={{ opacity }}
        className="w-10 shrink-0 font-display text-5xl leading-none text-gold motion-reduce:!opacity-100 md:w-14 md:text-6xl"
      >
        {index + 1}
      </m.span>
      <div className="space-y-2">
        <h3 className="text-2xl">{step.title}</h3>
        <p className="max-w-md leading-relaxed text-muted-foreground">
          {step.text}
        </p>
      </div>
    </li>
  );
}

/** La línea dorada avanza con el scroll: la secuencia se lee en orden. */
export function StepsProgress({ steps }: { steps: readonly Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });

  return (
    <ol
      ref={ref}
      className="relative divide-y divide-border border-y border-border"
    >
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 top-0 w-px bg-border"
      />
      <m.span
        aria-hidden="true"
        style={{ scaleY: scrollYProgress }}
        className="absolute bottom-0 left-0 top-0 w-px origin-top bg-gold motion-reduce:!transform-none"
      />
      {steps.map((step, index) => (
        <StepItem
          key={step.title}
          step={step}
          index={index}
          total={steps.length}
          progress={scrollYProgress}
        />
      ))}
    </ol>
  );
}
