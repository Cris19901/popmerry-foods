'use client';

export default function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    window.open(
      `https://wa.me/2347039571698?text=${encodeURIComponent(`Hi! I'd like to join the PopMerry Foods mailing list: ${email}`)}`,
      '_blank'
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        name="email"
        type="email"
        required
        placeholder="your@email.com"
        className="flex-1 px-5 py-3.5 rounded-full text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-white text-sm"
      />
      <button
        type="submit"
        className="bg-[#1A0800] hover:bg-stone-900 text-white font-bold px-6 py-3.5 rounded-full transition-colors text-sm whitespace-nowrap"
      >
        Notify Me
      </button>
    </form>
  );
}
