function DetailItem({ title, value, warning, compact }) {
  return (
    <div className={`bg-gray-50 ${compact ? 'p-1.5' : 'p-2 sm:p-3'} rounded-lg`}>
      <h3 className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-gray-500 mb-0.5`}>{title}</h3>
      <p className={`${compact ? 'text-sm' : 'text-base'} text-gray-800`}>
        {value}
        {warning && (
          <span className="ml-1 text-xs px-1 py-0.5 bg-orange-100 text-orange-800 rounded-full">
            {warning}
          </span>
        )}
      </p>
    </div>
  );
}

export default DetailItem;