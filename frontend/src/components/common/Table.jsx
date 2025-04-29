import React from 'react'

const Table = ({ 
  columns, 
  data, 
  onRowClick, 
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
  ...props 
}) => {
  if (isLoading) {
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
    )
  }

  if (!data || data.length === 0) {
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
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-neutral-500">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

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