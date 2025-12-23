/**
 * Password Generator Utility
 * Generates secure random passwords
 */

export function generatePassword(length = 12) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  // Ensure at least one character from each set
  const allChars = lowercase + uppercase + numbers + symbols
  let password = ''
  
  // Add one from each category
  password += getRandomChar(lowercase)
  password += getRandomChar(uppercase)
  password += getRandomChar(numbers)
  password += getRandomChar(symbols)
  
  // Fill the rest with random characters from all sets
  for (let i = 4; i < length; i++) {
    password += getRandomChar(allChars)
  }
  
  // Shuffle the password to avoid predictable pattern
  return shuffleString(password)
}

function getRandomChar(characters) {
  return characters[Math.floor(Math.random() * characters.length)]
}

function shuffleString(string) {
  const array = string.split('')
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.join('')
}

/**
 * Check password strength
 * @param {string} password 
 * @returns {object} Strength analysis
 */
export function checkPasswordStrength(password) {
  let score = 0
  const analysis = {
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false
  }
  
  // Check length
  if (password.length >= 8) {
    score += 2
    analysis.length = true
  } else if (password.length >= 6) {
    score += 1
  }
  
  // Check character types
  if (/[A-Z]/.test(password)) {
    score += 1
    analysis.uppercase = true
  }
  
  if (/[a-z]/.test(password)) {
    score += 1
    analysis.lowercase = true
  }
  
  if (/[0-9]/.test(password)) {
    score += 1
    analysis.numbers = true
  }
  
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 2
    analysis.symbols = true
  }
  
  // Deduct for consecutive characters
  if (/(.)\1{2,}/.test(password)) {
    score -= 1
  }
  
  // Deduct for common patterns
  const commonPatterns = [
    '123', 'abc', 'qwerty', 'password', 'admin'
  ]
  
  if (commonPatterns.some(pattern => 
    password.toLowerCase().includes(pattern))) {
    score -= 2
  }
  
  // Determine strength level
  let strength = 'weak'
  let message = 'كلمة مرور ضعيفة'
  
  if (score >= 7) {
    strength = 'strong'
    message = 'كلمة مرور قوية جداً'
  } else if (score >= 5) {
    strength = 'good'
    message = 'كلمة مرور جيدة'
  } else if (score >= 3) {
    strength = 'medium'
    message = 'كلمة مرور مقبولة'
  }
  
  return {
    score,
    strength,
    message,
    analysis,
    suggestions: getPasswordSuggestions(analysis)
  }
}

function getPasswordSuggestions(analysis) {
  const suggestions = []
  
  if (!analysis.length) {
    suggestions.push('اجعلها 8 أحرف على الأقل')
  }
  
  if (!analysis.uppercase) {
    suggestions.push('أضف حرفاً كبيراً')
  }
  
  if (!analysis.lowercase) {
    suggestions.push('أضف حرفاً صغيراً')
  }
  
  if (!analysis.numbers) {
    suggestions.push('أضف رقماً')
  }
  
  if (!analysis.symbols) {
    suggestions.push('أضف رمزاً خاصاً')
  }
  
  return suggestions
}

/**
 * Generate memorable password
 * @param {number} wordCount Number of words
 * @param {string} separator Separator between words
 * @returns {string} Memorable password
 */
export function generateMemorablePassword(wordCount = 4, separator = '-') {
  const words = [
    'apple', 'brave', 'cloud', 'dance', 'eagle', 'flame', 'grace', 'heart',
    'ivory', 'jewel', 'knife', 'light', 'magic', 'night', 'ocean', 'peace',
    'queen', 'river', 'stone', 'truth', 'unity', 'valor', 'water', 'xenon',
    'youth', 'zenith'
  ]
  
  const numbers = ['123', '456', '789', '2024', '007', '999', '111', '888']
  const symbols = ['!', '@', '#', '$', '%', '&', '*']
  
  let password = ''
  
  // Add random words
  for (let i = 0; i < wordCount; i++) {
    if (i > 0) password += separator
    password += words[Math.floor(Math.random() * words.length)]
  }
  
  // Add random number
  password += numbers[Math.floor(Math.random() * numbers.length)]
  
  // Add random symbol
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  return password
}

/**
 * Generate pronounceable password
 * @param {number} length Password length
 * @returns {string} Pronounceable password
 */
export function generatePronounceablePassword(length = 10) {
  const vowels = 'aeiou'
  const consonants = 'bcdfghjklmnpqrstvwxyz'
  let password = ''
  
  // Start with consonant or vowel randomly
  let useVowel = Math.random() > 0.5
  
  for (let i = 0; i < length; i++) {
    if (useVowel) {
      password += getRandomChar(vowels)
    } else {
      password += getRandomChar(consonants)
    }
    
    // Alternate between vowel and consonant
    useVowel = !useVowel
    
    // Occasionally break the pattern for more randomness
    if (Math.random() < 0.2) {
      useVowel = Math.random() > 0.5
    }
  }
  
  // Capitalize first letter
  password = password.charAt(0).toUpperCase() + password.slice(1)
  
  // Add number at the end
  password += Math.floor(Math.random() * 90 + 10)
  
  return password
}

export default {
  generatePassword,
  checkPasswordStrength,
  generateMemorablePassword,
  generatePronounceablePassword
}
