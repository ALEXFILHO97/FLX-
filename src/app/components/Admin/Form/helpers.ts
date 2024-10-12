export function nameToLabel(string: string) {
  return string
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
}

export function formatEnumValue(value: string): string {
  const words = value.split("_");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return capitalizedWords.join(" ");
}
