import Image from "next/image";

export function CareersCultureSection() {
  return (
    <section className="border-y border-surface-variant bg-pure-white">
      <div className="mx-auto max-w-container-max">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative min-h-[500px]">
            <Image
              src="/images/careers-culture.jpg"
              alt="Consultants collaborating around a digital dashboard in a modern office"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center p-margin-mobile md:p-margin-desktop lg:p-[120px]">
            <h2 className="mb-6 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
              Built for Impact
            </h2>
            <p className="mb-8 font-sans text-body-lg text-on-surface-variant">
              Our environment is inherently collaborative but fiercely
              high-performance. You will be surrounded by polymaths—engineers
              who understand strategy, and strategists who code. We build teams
              that move with the agility of a startup and the resources of an
              institution.
            </p>
            <div className="w-16 border-t-2 border-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
