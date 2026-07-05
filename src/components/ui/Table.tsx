import React from 'react'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
}

export function Table<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'Aucune donnée disponible',
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        {emptyMessage}
      </div>
    )
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-header-bg">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-wider ${alignClasses[col.align || 'left']}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-border">
          {data.map((item, index) => (
            <tr
              key={index}
              className={`transition-colors hover:bg-filter-bg ${index % 2 === 0 ? 'bg-white' : 'bg-stripe'}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-sm text-gray-900 ${alignClasses[col.align || 'left']}`}
                >
                  {col.render ? col.render(item) : (item as any)[col.key]}
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
