import React from 'react'

const Table = ({ 
  columns, 
  data, 
  onRowClick, 
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
  responsive = true,
  ...props 
}) => {
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {/* Mobile Loading */}
        <div className="block sm:hidden p-4">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        </div>
        
        {/* Desktop Loading */}
        <div className="hidden sm:block">
          <table className={`table ${className}`} {...props}>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className={column.className || ''}>
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {/* Mobile Empty State */}
        <div className="block sm:hidden p-8 text-center">
          <div className="text-neutral-500">{emptyMessage}</div>
        </div>
        
        {/* Desktop Empty State */}
        <div className="hidden sm:block">
          <table className={`table ${className}`} {...props}>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className={column.className || ''}>
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-neutral-500">
                  {emptyMessage}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (responsive) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {/* Mobile Card View */}
        <div className="block sm:hidden divide-y divide-neutral-200">
          {data.map((row, rowIndex) => (
            <div 
              key={rowIndex}
              className={`p-4 space-y-3 ${onRowClick ? 'cursor-pointer hover:bg-neutral-50 active:bg-neutral-100' : ''}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between">
                  <span className="text-sm font-medium text-neutral-600">
                    {column.header}:
                  </span>
                  <span className="text-sm text-neutral-900 text-right max-w-[60%]">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block table-container">
          <table className={`table ${className}`} {...props}>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className={column.className || ''}>
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? 'cursor-pointer hover:bg-neutral-100' : ''}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={column.cellClassName || ''}>
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Fallback to original table view
  return (
    <div className="table-container">
      <table className={`table ${className}`} {...props}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className || ''}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'cursor-pointer hover:bg-neutral-100' : ''}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={column.cellClassName || ''}>
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table