function MarqueeCard({ product }) {
  return (
    <div className="bg-[#14213D] rounded-2xl shadow-sm overflow-hidden w-64 shrink-0">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-white">
          {product.category}
        </p>
        <h3 className="text-lg font-serif text-white mt-1">
          {product.name}
        </h3>
      </div>
    </div>
  );
}

export default MarqueeCard;