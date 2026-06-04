import { ArrowRight } from 'lucide-react'

interface HowItWorksData {
  isVisible: boolean;
  title: string;
  titleHighlight: string;
  description: string;
  steps: readonly { number: string; title: string; description: string }[];
}

export function HowItWorks({ data }: { data: HowItWorksData }) {
  if (!data.isVisible) return null;

  return (
    <section className="bg-primary py-24 text-white overflow-hidden">
      <div className="container-premium relative">
        <div className="absolute -right-20 top-0 select-none opacity-5">
          <span className="text-[20rem] font-black leading-none">WASH</span>
        </div>

        <div className="mb-20 max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            {data.title} <br />
            <span className="text-secondary">{data.titleHighlight}</span>
          </h2>
          <p className="text-xl text-white/70">
            {data.description}
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 relative">
          {data.steps.map((step, index) => (
            <div key={step.number} className="relative group">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-5xl font-black text-white/20 group-hover:text-secondary transition-colors duration-300">
                  {step.number}
                </span>
                <div className="h-[2px] flex-1 bg-white/10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-white/60 leading-relaxed">{step.description}</p>
              
              {index < data.steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 -right-6 text-white/20">
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
