/**
 * Utility functions for cleaning and formatting text content
 */

export function cleanAndTruncateDescription(description: string, maxLength: number = 150): {
  truncated: string;
  fullMarkdown: string;
  isTruncated: boolean;
} {
  // Keep the original markdown for full display
  const fullMarkdown = description.trim()

  // Create a plain text version for truncation
  let plainText = description
    // Remove ### headers
    .replace(/###[^#\n]*\n/g, '')
    // Remove ** bold formatting but keep the text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Convert bullet points to clean format
    .replace(/- \*\*([^*]+)\*\*/g, '• $1')
    .replace(/- /g, '• ')
    // Remove excessive line breaks
    .replace(/\n{3,}/g, ' ')
    .replace(/\n/g, ' ')
    // Remove leading/trailing whitespace
    .trim()

  // If it's short enough, return as is
  if (plainText.length <= maxLength) {
    return {
      truncated: plainText,
      fullMarkdown,
      isTruncated: false
    }
  }

  // Find a good truncation point (prefer sentence boundaries)
  let truncated = plainText.substring(0, maxLength)
  const lastSentence = truncated.lastIndexOf('.')
  const lastSpace = truncated.lastIndexOf(' ')

  // Use sentence boundary if it's not too short, otherwise use word boundary
  if (lastSentence > maxLength * 0.6) {
    truncated = truncated.substring(0, lastSentence + 1)
  } else if (lastSpace > maxLength * 0.6) {
    truncated = truncated.substring(0, lastSpace) + '...'
  } else {
    truncated = truncated + '...'
  }

  return {
    truncated,
    fullMarkdown,
    isTruncated: true
  }
}

export function formatObjectiveText(objective: string): string {
  // Clean up objective text to be more concise
  return objective
    .replace(/^(Transform|Shift|Reframe|Establish|Position)/i, '')
    .replace(/the market perception so that/i, '')
    .replace(/the market narrative by positioning/i, '')
    .trim()
}