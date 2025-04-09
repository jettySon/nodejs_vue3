// src/utils/dateUtils.ts

/**
 * Format date to 'YYYY-MM-DD' string
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * Format date to 'YYYY-MM-DD HH:MM' string
 */
export function formatDateTime(date: Date): string {
    const dateStr = formatDate(date)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${dateStr} ${hours}:${minutes}`
}