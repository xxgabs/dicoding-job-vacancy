export default function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-gray-900 text-white px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-gray-300 max-w-sm">{subtitle}</p>
      </div>
    </div>
  );
}
