const apostrophe = (noun: string) => {
  noun = noun.trim()

  if (noun.endsWith('s')) {
    return `${noun}'`
  }

  return `${noun}'s`
}

export default apostrophe
