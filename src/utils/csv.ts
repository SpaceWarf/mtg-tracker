import Papa from "papaparse";

export function parseAsJson(
  filename: string,
  cb: (data: { [key: string]: string }[]) => void
) {
  Papa.parse(`/src/assets/csv/${filename}`, {
    download: true,
    header: true,
    complete: function (results) {
      cb(results.data as { [key: string]: string }[]);
    },
  });
}
