/** Foguetinho que sobe na tela quando a pessoa acerta ou conclui a lição. */
export function Rocket({ count = 3 }: { count?: number }) {
  const items = Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: 12 + Math.random() * 76,
    delay: Math.random() * 0.4,
  }));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[61] overflow-hidden">
      {items.map((r) => (
        <span
          key={r.id}
          className="absolute bottom-0 block animate-rocket text-4xl"
          style={{ left: `${r.left}%`, animationDelay: `${r.delay}s` }}
        >
          🚀
        </span>
      ))}
    </div>
  );
}
