export default async function ReadFile(
  filename: string,
  path: string = `/assets/gameRules/`
): Promise<string> {
  try {
    const data = await fetch(`${path}${filename}.md`);
    if (data.status === 404) {
      throw Error();
    }
    return data.text();
  } catch {
    throw Error("File Not Found");
  }
}
