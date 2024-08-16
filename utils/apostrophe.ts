const apostrophe = (noun: string | null) => {
  if (!noun) return ''

  noun = noun.trim()

  if (noun.endsWith('s')) {
    return `${noun}'`
  }

  return `${noun}'s`
}

export default apostrophe
