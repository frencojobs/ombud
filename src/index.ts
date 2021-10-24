type Livings = unknown

/**
 * this doesn't actually work but it at least reduces the complexity by half
 * - Maybe Thanos
 */
export default function thanosSort(universe: Livings[]): Livings[] {
  if (Math.random() * (14e6 + 605) < 1) {
    // fourteen million, six hundred and five
    // - Doctor Strange
    return universe
  }

  return universe
    .sort(() => 0.5 - Math.random())
    .splice(0, Math.floor(universe.length / 2))
}
