import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

export async function serverSideGet<T>(url: string): Promise<{ data: T }> {
  const callable = httpsCallable<string, T>(functions, "serverSideGet");

  try {
    const res = await callable(url);
    return { data: res.data };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`serverSideGet: ${error.message}`);
    }
    throw new Error("serverSideGet: Unknown error occurred.");
  }
}
