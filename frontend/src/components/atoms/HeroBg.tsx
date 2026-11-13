export default function HeroBg() {
  return (
    <div className="inset-0 absolute [&_img]:h-full [&_img]:object-cover [&_img]:[object-position:center_45%] [&_img]:w-full after:bg-ink after:content-[''] after:inset-0 after:opacity-[0.6] after:absolute" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-village-2400.webp"
        width={2400}
        height={1596}
        alt=""
        loading="eager"
        decoding="sync"
        fetchPriority="high"
      />
    </div>
  )
}

